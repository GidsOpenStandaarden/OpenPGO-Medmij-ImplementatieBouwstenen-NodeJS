/*
Generic list class for validating and parsing lists 
Copyright (C) 2018 Hugo W.L. ter Doest

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

"use strict";

var fs = require('fs');
var https = require('https');
var xmllint = require('node-xmllint');
var xml2js = require('xml2js');

var settings = require('./settings');
var DEBUG = settings.debug;


class List {
  
  constructor(schemaPath, xmlURL, callback) {
    var that = this;

    var readSchemaFromPathPromise = new Promise(
      function(resolve, reject) {
        fs.readFile(schemaPath, 'utf8', function(error, data) {
          if (error) {
            reject(error);
          }
          else {
            resolve(data);
          }
      });
      }
    );

    var readListFromURLPromise = new Promise(
      function(resolve, reject) {
        that.readFileFromURL(xmlURL, resolve, reject);
      }
    );
    
    Promise.all([readSchemaFromPathPromise, readListFromURLPromise])
      .then(function([schema, xml]) {
        return new Promise(
          function(resolve, reject) {
            // Validate using node xmllint
            var result = xmllint.validateXML({
              xml: xml,
              schema: schema
            });
            if (result.errors) {
              reject(result.errors);
            }
            else {
              DEBUG && console.log('List conforms to schema: ' + result);
              resolve({
                xml: xml,
                schema: schema
              });
            }
          }
        );
      })
      .then(function(data) {
        return new Promise(
          function(resolve, reject) {
            xml2js.parseString(data.xml, function (error, json) {
              if (error) {
                reject(error); 
              }
              else {
                DEBUG && console.log("xml2js result: " + json);
                resolve({
                  xml: data.xml,
                  schema: data.schema,
                  json: json
                });
              }
            });
          }
        )
      })
      .then(function(data) {
        that.list = data.json;
        that.xml = data.xml;
        that.schema = data.schema;
        callback(null, that)
      })
      .catch(function(error) {
        callback(error);
      });
  }
  

  // Reads a file from a URL
  readFileFromURL(URL, resolve, reject) {
    var data = "";
    var request = https.get(URL, function(res) {

      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function() {
        DEBUG && console.log("DATA: " + data);
        resolve(data);
      })
    });

    request.on('error', function(error) {
      reject(error);
    });
  }

  
  // Returns the whitelist
  getList() {
    return this.list;
  }
  
}


module.exports = List;
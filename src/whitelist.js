/*
Whitelist class for parsing the whitelist and validating hostnames
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

var List = require('./list');

var settings = require('./settings');
var schemaURL = settings.whitelistSchemaURL;
var xmlURL = settings.whitelistURL;
var DEBUG = settings.debug;


class Whitelist extends List {
  
  constructor(callback) {
    super(schemaURL, xmlURL, callback);
  }
  
  // Validates a hostname against the whitelist, returns true if the hostname is on the list
  // NB: this is a linear search.
  // If the whitelist becomes long, a map should be used instead of the original structure
  isMedMijNode(hostname) {
    var found = false;
    this.list.Whitelist.MedMijNodes[0].MedMijNode.forEach(function(node) {
      DEBUG && console.log("Check node: " + JSON.stringify(node));
      if (node.Hostname ==  hostname) {
        found = true;
      }
    });
    return found;
  }
};

module.exports = Whitelist;
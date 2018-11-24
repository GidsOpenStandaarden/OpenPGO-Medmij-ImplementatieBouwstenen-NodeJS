/*
GNL class for parsing the Gegevensdienstnamen (data services) list
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
var schemaPath = settings.gnlSchemaPath;
var xmlURL = settings.gnlURL;
var DEBUG = settings.debug;


class GNL extends List {
  
  constructor(callback) {
    super(schemaPath, xmlURL, callback);
  }
  
  
  createMap() {
    // process list to convenient mapping from id to gegevensdienstnaam
    this.mapIdToNaam = {}
    this.list.Gegevensdienstnamenlijst.Gegevensdiensten[0].Gegevensdienst.forEach(gdn => {
      var id = gdn.GegevensdienstId;
      var naam = gdn.Weergavenaam;
      DEBUG && console.log("(id, gegevensdienstnaam): (" + id + ", " + naam + ")");
      this.mapIdToNaam[id] = naam;
    });
  }
  
  
  // Returns a map from id to gegevensdienstnaam
  getMapIdToName() {
    if (!this.mapIdToNaam) {
      this.createMap();
    }
    return this.mapIdToNaam;
  }
  
}


module.exports = GNL;
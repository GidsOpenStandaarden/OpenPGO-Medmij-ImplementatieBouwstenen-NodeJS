/*
Whitelist unit test
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


var medmij = require('../src');
var Whitelist = medmij.Whitelist;

var whitelistGlobal = null;

describe('Whitelist parser', function() {
  
  it('should create a whitelist parser from schema and XML files', function(done) {
    new Whitelist(function(error, whitelist) {
      if (error) {
        console.log(error);
      }
      else {
        expect(whitelist instanceof Whitelist).toEqual(true);
        whitelistGlobal = whitelist;
        done();
      }
    })
  });
                  
  it('should process requests correctly', function() {
    expect(whitelistGlobal.getList()).toBeDefined();
    expect(whitelistGlobal.isMedMijNode('iets')).toEqual(false);
    expect(whitelistGlobal.isMedMijNode('pgocluster68.personalhealthprovider.net')).toEqual(true);
  });
});

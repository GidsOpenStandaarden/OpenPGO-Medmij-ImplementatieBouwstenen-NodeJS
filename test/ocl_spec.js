/*
OCL unit test
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
var OCL = medmij.OCL;

describe('OCL parser', function() {
  var oclGlobal = null;
  
  it('should create a whitelist parser from schema and XML files', function(done) {
    new OCL(function(error, ocl) {
      if (error) {
        console.log(error);
      }
      else {
        expect(ocl instanceof OCL).toEqual(true);
        oclGlobal = ocl;
        done();
      }
    })
  });
                  
  it('should process requests correctly', function() {
    expect(oclGlobal.getList()).toBeDefined();
    expect(oclGlobal.getClient('iets')).toEqual(null);
    expect(oclGlobal.getClient('De Enige Echte PGO')).not.toBe(null);
  });
});
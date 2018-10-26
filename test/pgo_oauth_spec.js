/*
PGOOAuth unit test
Copyright (C) 2018 Zorgdoc

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
var PGOOAuth = medmij.PGOOAuth;
var ZAL = medmij.ZAL;
var OCL = medmij.OCL;

describe('PGO OAuth', function() {
  var pgoGlobal = null;
  
  it('should create a PGOOAuth instance', function() {
    pgoGlobal = new PGOOAuth();
    expect(pgoGlobal instanceof PGOOAuth).toEqual(true);
  });
                  
  it('should return correct oauth url', function() {
    new OCL(function (error, ocl) {
      if (error) {
        console.log(error);
      } else {
        new ZAL(function (error, zal) {
          if (error) {
            console.log(error);
          } else {
            const za = zal.getZorgaanbieder("umcharderwijk@medmij");
            const geg = za.Gegevensdiensten[0].Gegevensdienst[0];
            const authEndpoint = geg.AuthorizationEndpoint[0].AuthorizationEndpointuri[0];
            const zorgaanbieder = "umcharderwijk";
            const gegID = geg.GegevensdienstId[0];

            const oc = ocl.getClient("De Enige Echte PGO");
            const expected = `${authEndpoint}?response_type=code&client_id=${oc.Hostname[0]}&redirect_uri=${encodeURIComponent("https://pgo.example.com/oauth")}&scope=${encodeURIComponent(`${zorgaanbieder}~${gegID}`).replace("~", "%7E")}&state=abcd`;
            expect(pgoGlobal.makeAuthURL(authEndpoint, zorgaanbieder, gegID, oc.Hostname[0], "https://pgo.example.com/oauth", "abcd").href).toEqual(expected);
          }
        });
      }
    });
  });

  it('should return an access token', function(done) {
    new ZAL(function (error, zal) {
      if (error) {
        console.log(error);
      } else {
        const za = zal.getZorgaanbieder("umcharderwijk@medmij");
        const geg = za.Gegevensdiensten[0].Gegevensdienst[0];
        const tokenEndpoint = geg.TokenEndpoint[0].TokenEndpointuri[0];
        const zorgaanbieder = "umcharderwijk";
        const gegID = geg.GegevensdienstId[0];

        pgoGlobal.getAccessToken(tokenEndpoint, "xyz", "https://pgo.example.com/oauth", function(token, error) {
          if (error) {
            console.log(error);
          } else {
            //expect(token).toBeDefined();
          }
        });
      }
    });
  });
});

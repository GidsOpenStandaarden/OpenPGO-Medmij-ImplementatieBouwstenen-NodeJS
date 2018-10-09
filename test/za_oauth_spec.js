/*
ZAOAuth unit test
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
var ZAOAuth = medmij.ZAOAuth;

describe('ZA OAuth', function() {
  var zaoGlobal = null;
  
  it('should create a ZAOAuth instance', function() {
    zaoGlobal = new ZAOAuth();
    expect(zaoGlobal instanceof ZAOAuth).toEqual(true);
  });
                  
  it('should return correct oauth url', function() {
    expect(zaoGlobal.makeRedirectURL("https://pgo.example.com/oauth", "abc", "xyz").href).toEqual("https://pgo.example.com/oauth/cb?state=abc&code=xyz");
  });
});
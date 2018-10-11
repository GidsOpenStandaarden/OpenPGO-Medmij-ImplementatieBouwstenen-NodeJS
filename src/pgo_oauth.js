/*
PGOOAuth class for implementing OAuth on the PGO side.
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

"use strict";

const url = require('url');
const https = require('https');

class PGOOAuth {
    /**
     * Returns an URL with which a zorggebruiker can request an authorization-code at a zorgaanbieder
     *
     * @param {Object} baseURL The base URL for authorization requests to the given zorgaanbieder.
     * @param {String} zorgaanbieder The name of the zorgaanbieder.
     * @param {String} gegevensdienstID The ID of the gegevensdienst.
     * @param {String} clientID The clientID of the PGO.
     * @param {String} redirectURI The URI to redirect the client to with a valid access token.
     * @param {String} state Application-specific state. Use this to identify the client upon returning to the redirectURL.
     * @return {URL} The URL where the client will login.
     * @throws {DOMException} If the resulting redirect URL is invalid.
     */
    makeAuthURL(baseURL, zorgaanbieder, gegevensdienstID, clientID, redirectURI, state) {
        var redirectURL = new url.URL(baseURL);

        redirectURL.searchParams.append("response_type", "code");
        redirectURL.searchParams.append("client_id", clientID);
        redirectURL.searchParams.append("redirect_uri", redirectURI);
        redirectURL.searchParams.append("scope", `${zorgaanbieder}~${gegevensdienstID}`);
        redirectURL.searchParams.append("state", state);

        return redirectURL;
    }

    /**
     * Retrieves an access token at the zorgaanbieder.
     * 
     * @param {String} tokenEndpoint The endpoint at which to retrieve the token.
     * @param {String} authorizationCode The authorization code which you received from the zorgaanbieder.
     * @param {String} redirectURI The same value as in the preceeding authorization request
     * @param {Function} callback The function to call with the resulting token and any error as parameters.
     */
    getAccessToken(tokenEndpoint, authorizationCode, redirectURI, callback) {
        try {
            var tokenURL = new url.URL(tokenEndpoint);
        } catch (e) {
            callback(null, e);
        }

        tokenURL.searchParams.append("grant_type", "authorization_code");
        tokenURL.searchParams.append("code", authorizationCode);
        tokenURL.searchParams.append("client_id", "");
        tokenURL.searchParams.append("redirect_uri", redirectURI);

        const options = {
            hostname: tokenURL.hostname,
            port: 443,
            path: tokenURL.pathname,
            method: 'POST'
        };

        var response = "";
        const request = https.request(options, function(res) {
            res.on('response', function(chunk) {
                response += chunk;
            });

            res.on('end', function() {
                callback(response, null);
            })
        });

        request.on('error', function (error) {
            callback(null, `Error requesting token: ${error}`);
        });
    }
}

module.exports = PGOOAuth;
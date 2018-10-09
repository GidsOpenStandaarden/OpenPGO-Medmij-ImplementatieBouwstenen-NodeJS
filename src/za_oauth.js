/*
ZAOauth class for implementing OAuth on the Zorgaanbieder side.
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

class ZAOauth {
    /**
     * Returns the URL to which the zorggebruiker should be redirected.
     * 
     * @param {String} baseURL The base URL of the PGO, as returned to the client.
     * @param {String} state The state which the PGO passed to the client.
     * @param {String} authCode The authorization code which grants access to the patient data.
     * @return {URL} The URL to which the zorggebruiker should be redirected, including all
     *                  nessecary parameters.
     * @throws {DOMException} If the given baseURL or the resulting redirect URL is invalid.
     */
    makeRedirectURL(baseURL, state, authCode) {
        if (!baseURL.endsWith("/")) {
            baseURL += "/";
        }
        baseURL += "cb";

        const redirectURL = new url.URL(baseURL);
        redirectURL.searchParams.append("state", state);
        redirectURL.searchParams.append("code", authCode);

        return redirectURL;
    }
}

module.exports = ZAOauth;
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var User_1 = require("../user/User");
var log_1 = require("../util/log");
var request = require("request");
var d = console.dir;
var LoginService = (function () {
    function LoginService() {
    }
    /*
        Logs in a user to facebook, given an access token.
        Returns a promise of a verified user object, or the promise is rejected.

        Example of what is promised:
        {
            "id":"10153162607041397",       // The facebook id
            "first_name":"Dave",
            "gender":"male",
            "last_name":"MacDonald",
            "link":"https://www.facebook.com/app_scoped_user_id/10153162607041397/",
            "locale":"en_GB",
            "name":"Dave MacDonald",
            "timezone":-5,
            "updated_time":"2015-11-17T17:23:11+0000",
            "verified":true
        }
    */
    LoginService.verifyAccessToken = function (accessToken) {
        // TODO Is an https Agent pool needed here, since this will default to using the global agent which may be a bottleneck.
        log_1.default("LoginService # verifyAccessToken");
        return new Promise(function (resolve, reject) {
            log_1.default("Sending access token:");
            console.dir(accessToken);
            request.get({
                url: "https://graph.facebook.com/me",
                qs: {
                    "access_token": accessToken
                }
            }, function (err, httpResponse, body) {
                var parsedBody = null;
                if (body) {
                    parsedBody = JSON.parse(body);
                }
                if (err || httpResponse.statusCode != 200 || parsedBody == null || !parsedBody.verified) {
                    console.log("Call to https://graph.facebook.com/me failed with status code %d, error %s, and body %s", httpResponse ? httpResponse.statusCode : "undefined", err, parsedBody);
                    console.log("response: ");
                    console.dir(httpResponse);
                    console.log("body: ");
                    console.dir(body);
                    console.log("err: ");
                    console.dir(err);
                    reject({ err: err, body: body });
                }
                else {
                    console.log("Facebook response %s", body);
                    //q.reject({err, body});
                    resolve(parsedBody);
                }
            });
        });
    };
    /**
     * A promise for a status object with the following
     *  {
     *      accessTokenVerified : true/false,
     *      userIsRegistered : true/false
     *  }
     *  Also, if both are true, then session.user will be set to the logged in user.
     *
     * @param c         A database connection
     * @param session   The session object (normally bound to the request as req.session)
     * @param auth      An object containing an accessToken to validate with facebook.
     * @returns         A promise for the status object above.
     */
    LoginService.login = function (c, session, auth) {
        var status = {
            accessTokenVerified: false,
            userIsRegistered: false
        };
        return LoginService.verifyAccessToken(auth["accessToken"]).
            then(function (fbUser) {
            status.accessTokenVerified = true;
            log_1.default("Access token verified for fbUser.id: " + fbUser.id);
            return User_1.default.loadUserByFbId(c, fbUser.id);
        }).then(function (user) {
            log_1.default("Loaded user: " + log_1.default(user));
            status.userIsRegistered = true;
            session["user"] = user;
            console.log("User added to session.  Session looks like this: ");
            console.dir(session);
        }, function () {
            // TODO The user was not found, record the login attempt.
        }).then(function () {
            log_1.default("login.js # login(): Returning " + log_1.default(status));
            return status;
        }).catch(function (e) {
            log_1.default("login.js # login() error: " + log_1.default(e));
            return status;
        });
    };
    return LoginService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginService;
//# sourceMappingURL=login.js.map
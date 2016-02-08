/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../dao/db"
import UserService from "../user/User"
import l from "../util/log"
var request = require("request");

var d = console.dir;

export default class LoginService {

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

    static verifyAccessToken(accessToken) : Promise<any> {

        // TODO Is an https Agent pool needed here, since this will default to using the global agent which may be a bottleneck.
        l("LoginService # verifyAccessToken")
        return new Promise((resolve,reject) => {
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

                    console.log("Call to https://graph.facebook.com/me failed with status code %d, error %s, and body %s", httpResponse.statusCode, err, parsedBody);
                    reject({err, body});
                    // TODO e-mail sysadmin about failure
                } else {
                    console.log("Facebook response %s", body);
                    //q.reject({err, body});
                    resolve(parsedBody);
                }
            });
        })
    }

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
    static login(c, session, auth) : Promise<any> {
        var status = {
            accessTokenVerified : false,
            userIsRegistered : false
        };
        return LoginService.verifyAccessToken(auth.accessToken).

            then(
                (fbUser) => {
                    status.accessTokenVerified = true;
                    l("Access token verified for fbUser.id: " + fbUser.id);
                    return UserService.loadUserByFbId(c, fbUser.id);
                }
            ).then(
                (user) => {
                    l("Loaded user: " + l(user));
                    status.userIsRegistered = true;
                    session["user"] = user;
                    console.log("User added to session.  Session looks like this: ")
                    console.dir(session);
                },
                () => {
                    // TODO The user was not found, record the login attempt.
                }
            ).then(() => {
                l("login.js # login(): Returning " + l(status));
                return status;
            }).catch(
                (e) => {
                    l("login.js # login() error: " + l(e));
                    return status;
                }
            );

    }
}
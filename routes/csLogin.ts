/// <reference path="../typings/tsd.d.ts" />
"use strict"

import express = require("express")
import LoginService from "./auth/login"
import l from "./util/log"

let router = express.Router();


// Logs in and returns the user's role.
router.post("/", function(req, res, next) {

    LoginService.login(req["c"], req.session, req.body).then((status) => {

        var user = req.session["user"];
        if (user) {
            status.role = user.role;
        }
        l("Sending " + l(status));
        res.send(status);
    });
});

/**
 * Returns the Facebook App ID for this instance of the application.
 * This value is read from the FB_APP_ID environment variable.
 *
 * Local development instances of this application will usually
 * set a different FB_APP_ID than the one that is used for prod to allow
 * access from their local machine.
 */
router.post("/fbid", function(req, res) {
    let id = process.env.FB_APP_ID
    if (!id) {
        l("FB_APP_ID is not set.  This must be set to match the App ID in facebook.")
    } else {
        res.send({id})
    }
})

export default router
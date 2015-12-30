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

export default router
/// <reference path="../typings/tsd.d.ts" />
"use strict";
var express = require("express");
var login_1 = require("./auth/login");
var log_1 = require("./util/log");
var router = express.Router();
// Logs in and returns the user's role.
router.post("/", function (req, res, next) {
    login_1.default.login(req["c"], req.session, req.body).then(function (status) {
        var user = req.session["user"];
        if (user) {
            status.role = user.role;
        }
        log_1.default("Sending " + log_1.default(status));
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
router.post("/fbid", function (req, res) {
    var id = process.env.FB_APP_ID;
    if (!id) {
        log_1.default("FB_APP_ID is not set.  This must be set to match the App ID in facebook.");
    }
    else {
        res.send({ id: id });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csLogin.js.map
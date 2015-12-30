/// <reference path="../typings/tsd.d.ts" />
"use strict";
var express = require("express");
var login_1 = require("./auth/login");
var log_1 = require("./util/log");
var router = express.Router();
// Logs in and returns the user's role.
router.post("/", function (req, res, next) {
    login_1["default"].login(req["c"], req.session, req.body).then(function (status) {
        var user = req.session["user"];
        if (user) {
            status.role = user.role;
        }
        log_1["default"]("Sending " + log_1["default"](status));
        res.send(status);
    });
});
exports.__esModule = true;
exports["default"] = router;
//# sourceMappingURL=csLogin.js.map
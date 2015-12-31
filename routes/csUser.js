/// <reference path="../typings/tsd.d.ts" />
"use strict";
var User_1 = require("./user/User");
var User_2 = require("./user/User");
var db_1 = require("./dao/db");
var log_1 = require("./util/log");
var express = require('express');
var util_1 = require("./util/util");
var jsonMask = require("json-mask");
var router = express.Router();
router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
/**
 * Loads all users within the community, except other admins, ordered by name.
 * Restricted to admins.
 *
 * // TODO add community id
 */
router.post("/loadAll", function (req, res) {
    var user = req.session["user"];
    log_1.default("users: " + log_1.default(user) + "\n" + log_1.default(user.ifAdmin));
    db_1.default.getConnection(function (c) {
        var mask = "userId,fbId,name,role";
        return new User_1.User(user).ifAdmin().
            then(function () { return User_2.default.loadAllMasked(c, mask); }).
            then(function (users) {
            return User_2.default.loadUserByUserId(c, user.userId).
                then(function (self) {
                users.push(jsonMask(self, mask));
                return users;
            });
        });
    })
        .then(util_1.sendResults(res))
        .catch(util_1.error(res));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csUser.js.map
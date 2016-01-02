/// <reference path="../typings/tsd.d.ts" />
"use strict";
var User_1 = require("./user/User");
var Dial_1 = require("./dial/Dial");
var Dial_2 = require("./dial/Dial");
var express = require('express');
var router = express.Router();
var log_1 = require("./util/log");
var util_1 = require("./util/util");
// done create the dial table and add it to the schema.
// todo create a /dial/addNumber api
// todo update the UI to call the above
// todo create a /dial/loadNumber api
// todo update the admin page to allow adding/removing numbers
// todo support deleting a number
/**
 * API section
 */
router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
/**
 *  Adds a phone number for the given user.
 *
 *  request { label, phone, userId }
 *  response { dialId }
 */
router.post("/add", function (req, res) {
    log_1.default("/dial/add " + log_1.default(req.body));
    var c = req["c"];
    var o = req.body;
    var phoneNum = new Dial_2.PhoneNumber(o.label, o.phone, o.userId);
    var user = req.session["user"];
    new User_1.User(user).hasAccessTo(c, o.userId).
        then(function () { return Dial_1.default.addNumber(c, phoneNum); }).
        then(function () { dialId: phoneNum.dialId; }).
        then(util_1.sendResults(res)).
        catch(util_1.error(res));
});
/**
 * Delete a phone number
 *
 *  {
 *      dialId     // The id of the phone number to delete
 *      userId
 *  }
 */
router.post("/delete", function (req, res) {
    log_1.default("/dial/delete");
    var c = req["c"];
    var o = req.body;
    var user = req.session["user"];
    Dial_1.default.loadNumber(c, o.dialId).
        then(function (num) { return new User_1.User(user).hasAccessTo(c, num.userId); }).
        then(function () { return Dial_1.default.deleteNumber(c, o.dialId); }).
        then(function () { ok: true; }).
        then(util_1.sendResults(res)).
        catch(util_1.error(res));
});
/**
 * Loads phone numbers for a user
 *
 * request {
 *      userId      // Loads numbers for this user
 * }
 *
 * response [{      // See class PhoneNumber for a descripion of these properties
 *     label        : string
 *     phone        : string
 *     rank         : number
 *     userId       : number
 *     dialId       : number
 * }]
 */
router.post("/load", function (req, res) {
    log_1.default("/dial/load");
    var c = req["c"];
    var o = req.body;
    var user = req.session['user'];
    new User_1.User(user).hasAccessTo(c, o.userId).
        then(function () { return Dial_1.default.loadNumbers(c, o.userId); }).
        then(util_1.sendResults(res)).
        catch(util_1.error(res));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csDial.js.map
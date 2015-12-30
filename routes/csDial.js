/// <reference path="../typings/tsd.d.ts" />
"use strict";
var Dial_1 = require("./dial/Dial");
var Dial_2 = require("./dial/Dial");
var express = require('express');
var router = express.Router();
var log_1 = require("./util/log");
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
function onFail(res) {
    return function (err) {
        log_1["default"]("Error: " + log_1["default"](err));
        res.send({ error: true });
    };
}
/**
 *  Adds a phone number for the given user.
 *
 *  { label, phone, userId }
 *
 */
router.post("/add", function (req, res) {
    log_1["default"]("/dial/add");
    var c = req["c"];
    var o = req.body;
    var phoneNum = new Dial_2.PhoneNumber(o.label, o.phone, o.userId);
    var user = req.session["user"];
    user.hasAccessTo(c, o.userId).
        then(function () { return Dial_1["default"].addNumber(c, phoneNum); }).
        then(function () { return res.send({ dialId: phoneNum.dialId }); }).
        catch(onFail(res));
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
    log_1["default"]("/dial/delete");
    var c = req["c"];
    var o = req.body;
    var user = req.session["user"];
    Dial_1["default"].loadNumber(c, o.dialId).
        then(function (num) { return user.hasAccessTo(c, num.userId); }).
        then(function () { return Dial_1["default"].deleteNumber(c, o.dialId); }).
        then(function () { return res.send({ ok: true }); }).
        catch(onFail(res));
});
/**
 * Loads phone numbers for a user
 *
 * {
 *      userId      // Loads numbers for this user
 * }
 */
router.post("/load", function (req, res) {
    log_1["default"]("/dial/load");
    var c = req["c"];
    var o = req.body;
    var user = req.session['user'];
    user.hasAccessTo(c, o.userId).
        then(function () { return Dial_1["default"].loadNumbers(c, o.userId); }).
        then(function (users) { return res.send(users); }).
        catch(onFail(res));
});
exports.__esModule = true;
exports["default"] = router;
//# sourceMappingURL=csDial.js.map
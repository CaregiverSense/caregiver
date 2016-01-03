/// <reference path="../typings/tsd.d.ts" />
"use strict";
var User_1 = require("./user/User");
var Places_1 = require("./places/Places");
var express = require('express');
var router = express.Router();
var log_1 = require("./util/log");
var util_1 = require("./util/util");
/**
 * API section
 */
router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
/**
 *  Adds a place
 *
 *  request { placeName, address }
 *  response { placeId }
 */
router.post("/add", function (req, res) {
    log_1.default("/places/add " + log_1.default(req.body));
    var c = req["c"];
    var o = req.body;
    var place = new Places_1.Place(o.placeName, o.address);
    Places_1.default.addPlace(c, place).
        then(util_1.sendResults(res)).
        catch(util_1.error(res));
});
/**
 * Assigns a place to a user
 *
 * { patientId, placeId, label }
 */
router.post("/assign", function (req, res) {
    log_1.default("/places/assign " + log_1.default(req.body));
    var c = req["c"];
    var o = req.body;
    var user = req.session["user"];
    var assignment = new Places_1.UserPlace(o.patientId, o.placeId, o.label);
    new User_1.User(user).
        hasAccessTo(c, o.patientId).
        then(function () { return Places_1.default.assignPlace(c, assignment); }).
        then(util_1.sendResults(res)).
        then(util_1.error(res));
});
/**
 * Unassigns a place from a user
 *
 * { patientId, upId }
 */
router.post("/unassign", function (req, res) {
    log_1.default("/places/unassign");
    var c = req["c"];
    var o = req.body;
    var user = req.session["user"];
    new User_1.User(user).
        hasAccessTo(c, o.patientId).
        then(function () { return Places_1.default.unassignPlace(c, o.upId, o.patientId); }).
        then(function () { ok: true; }).
        then(util_1.sendResults(res)).
        catch(util_1.error(res));
});
/**
 * Loads user_places for a user, ordered by (rank, upId)
 *
 * request {
 *      userId      // Loads numbers for this user
 * }
 *
 * response [{      // See class UserPlace for a description of these properties
        userId	    :number,        // the user to whom the place is assigsned
        placeId	    :number,        // the placeId
        label	    :string,        // the label to represent the address

        rank	   ?:number,        // used to sort and re-order
        upId	   ?:number, 	    // primary key
        place      ?:Place         // Not persisted, but may be decorated by API during load.
   }]
 */
router.post("/load", function (req, res) {
    log_1.default("/places/load");
    var c = req["c"];
    var o = req.body;
    var user = req.session['user'];
    new User_1.User(user).hasAccessTo(c, o.userId).
        then(function () { return Places_1.default.loadUserPlaces(c, o.userId); }).
        then(util_1.sendResults(res)).
        catch(util_1.error(res));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csPlaces.js.map
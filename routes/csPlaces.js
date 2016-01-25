/**
 * csPlaces.ts: REST endpoints for map places and place assignments.
 */
/// <reference path="../typings/tsd.d.ts" />
"use strict";
var Places_1 = require("./places/Places");
var PlacesEndpointSvc_1 = require("./places/PlacesEndpointSvc");
var util_1 = require("./util/util");
var router = require('express').Router();
var endpoint = new util_1.default(router).endpoint;
/**
 * Add some middleware
 */
router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
/**
 * Finds a place given its latitude and longitude.
 *
 * request { lat, lng }
 * response { found : boolean, placeName }
 */
endpoint("/find", function (c, o) {
    return PlacesEndpointSvc_1.default.find(c, o.lat, o.lng);
});
/**
 *  Inserts or updates a place
 *
 *  request { placeName, address, lat, lng }
 *  response { placeId }
 */
endpoint("/save", function (c, o) {
    return PlacesEndpointSvc_1.default.save(c, new Places_1.Place(o.placeName, o.address, o.lat, o.lng));
});
/**
 *  Inserts or updates a place, and assigns it to a user
 *
 *  request { placeName, address, lat, lng, userId }
 *  response { placeId }
 */
endpoint("/saveAndAssign", function (c, o, user) {
    return PlacesEndpointSvc_1.default.saveAndAssign(c, new Places_1.Place(o.placeName, o.address, o.lat, o.lng), user, o.userId, o.placeLabel || o.placeName);
});
/**
 * Unassigns a place from a user
 *
 * request { userId, placeId }
 */
endpoint("/unassign", function (c, o, user) {
    return PlacesEndpointSvc_1.default.unassign(c, user, o.userId, o.placeId);
});
/**
 * Loads user_places for a user, ordered by (rank, upId)
 *
 * request {
 *      userId      // Loads numbers for this user
 * }
 *
 * response [{
        userId	    :number,   // the user to whom the place is assigned
        placeId	    :number,   // the placeId
        label	    :string,   // the label to represent the address

        rank       ?:number,   // used to sort and re-order
        upId       ?:number,   // primary key of the assignment
        place      ?:Place     // The place itself
   }]
 */
endpoint("/load", function (c, o, user) {
    return PlacesEndpointSvc_1.default.loadUserPlaces(c, user, o.userId);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csPlaces.js.map
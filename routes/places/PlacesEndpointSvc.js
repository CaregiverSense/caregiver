/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var User_1 = require("../user/User");
var Places_1 = require("../places/Places");
var PlacesEndpointSvc = (function () {
    function PlacesEndpointSvc() {
        this.placesSvc = new Places_1.default();
    }
    /**
     * Find a place by latitude and longitude, and return
     * {found: true/false} which may also contain a placeName if found == true
     *
     * @param c The database connection
     * @param lat latitude
     * @param lng longitude
     */
    PlacesEndpointSvc.prototype.find = function (c, lat, lng) {
        return this.placesSvc.
            findPlace(c, lat, lng).
            then(function (place) {
            return (place == null) ?
                { found: false, placeName: undefined } :
                { found: true, placeName: place.placeName };
        });
    };
    PlacesEndpointSvc.prototype.save = function (c, place) {
        return this.placesSvc.savePlace(c, place);
    };
    /**
     * Save a place and assign the user to that place
     * @param c
     * @param place
     * @param user
     * @returns {Promise<number>}
     */
    PlacesEndpointSvc.prototype.saveAndAssign = function (c, place, user, placeLabel) {
        var self = this;
        var userId = user.userId;
        return user.
            hasAccessTo(c, user.userId).
            then(function () { return self.placesSvc.savePlace(c, place); }).
            then(function (place) { return self.placesSvc.assignPlace(c, new Places_1.UserPlace(userId, place.placeId, placeLabel)); });
    };
    /**
     * Unassigns a place from a user

     * @param c
     * @param userId
     * @param placeId
     * @returns {ok : true}
     */
    PlacesEndpointSvc.prototype.unassign = function (c, user, userId, placeId) {
        var self = this;
        return user.hasAccessTo(c, userId).
            then(function () { return self.placesSvc.unassignPlace(c, userId, placeId); }).
            then(function () { ok: true; });
    };
    /**
     * Loads user_places for a user, ordered by (rank, upId)
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
    PlacesEndpointSvc.prototype.loadUserPlaces = function (c, user) {
        var self = this;
        return new User_1.User(user).
            hasAccessTo(c, user.userId).
            then(function () { return self.placesSvc.loadUserPlaces(c, user.userId); });
    };
    return PlacesEndpointSvc;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new PlacesEndpointSvc();
//# sourceMappingURL=PlacesEndpointSvc.js.map
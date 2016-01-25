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
     * @param user      The user performing the assignment.
     * @param userId    The user being assigned the place
     * @param placeLabel
     * @returns {Promise<UserPlace>}
     */
    PlacesEndpointSvc.prototype.saveAndAssign = function (c, place, user, userId, placeLabel) {
        var self = this;
        return user.
            hasAccessTo(c, userId).
            then(function () { return self.placesSvc.savePlace(c, place); }).
            then(function (place) {
            var assignment = new Places_1.UserPlace(userId, place.placeId, placeLabel);
            assignment.place = place;
            return self.placesSvc.assignPlace(c, assignment);
        });
    };
    /**
     * Unassigns a place from a user

     * @param c
     * @param user      The user performing the assignment.
     * @param userId    The user being assigned the place
     * @param placeId   The id of the place
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
     * @param c
     * @param user
     * @param userId
     * @returns {Promise<UserPlace[]>}
     */
    PlacesEndpointSvc.prototype.loadUserPlaces = function (c, user, userId) {
        var self = this;
        return new User_1.User(user).
            hasAccessTo(c, userId).
            then(function () { return self.placesSvc.loadUserPlaces(c, userId); });
    };
    return PlacesEndpointSvc;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new PlacesEndpointSvc();
//# sourceMappingURL=PlacesEndpointSvc.js.map
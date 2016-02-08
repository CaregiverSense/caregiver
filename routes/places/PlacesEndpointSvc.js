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
     * @param c          The database connection
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

     * @param c         The database connection
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
     * @param c          The database connection
     * @param actor      The user performing this action (used to check security).
     * @param userId     UserPlaces are loaded for this user.
     * @returns {Promise<UserPlace[]>}
     */
    PlacesEndpointSvc.prototype.loadUserPlaces = function (c, actor, userId) {
        var self = this;
        return new User_1.User(actor).
            hasAccessTo(c, userId).
            then(function () { return self.placesSvc.loadUserPlaces(c, userId); });
    };
    /**
     * Updates the rank of the given user_places (identified by upId) so that
     * they are saved as ordered in the same order as they appear in the given upIds list.
     *
     * @param c         The database connection
     * @param actor     The user performing this action (used to check security).
     * @param userId    Sorting is limited to the assignments for this user only.
     * @param upIds     A list of upId, identifying the user_places in the order they should be sorted.
     */
    PlacesEndpointSvc.prototype.sort = function (c, actor, userId, upIds) {
        var self = this;
        return new User_1.User(actor).
            hasAccessTo(c, userId).
            then(function () { return self.placesSvc.setRank(c, userId, upIds); });
    };
    return PlacesEndpointSvc;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new PlacesEndpointSvc();
//# sourceMappingURL=PlacesEndpointSvc.js.map
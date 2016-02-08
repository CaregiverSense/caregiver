/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../../routes/dao/db");
var log_1 = require("../util/log");
/**
 * A service for managing the PLACE and USER_PLACE tables.
 *
 */
var PlacesService = (function () {
    function PlacesService() {
    }
    // Converts
    PlacesService.prototype.fix = function (latOrLng) {
        return new Number(latOrLng).toFixed(12);
    };
    /**
     * Finds a place given latitude and longitude coordinates.
     */
    PlacesService.prototype.findPlace = function (c, lat, lng) {
        var _this = this;
        console.log("PlaceService.findPlace( c, lat = ", lat, ", lng = ", lng, ")");
        return db_1.default.queryOne(c, "select * from place where lat = ? and lng = ?", [
            this.fix(lat), this.fix(lng)
        ]).
            then(function (row) {
            log_1.default("Found: " + log_1.default(row));
            return new Place(row.placeName, row.address, _this.fix(row.lat), _this.fix(row.lng), row.placeId);
        });
    };
    /**
     * Saves a place.  If the placeId is provided then
     * the existing row is updated, otherwise the place is inserted.
     *
     * @param c         The connection
     * @param place     The Place to insert
     * @returns A promise of the place inserted
     */
    PlacesService.prototype.savePlace = function (c, place) {
        var _this = this;
        console.log("PlaceService.savePlace( c, place = ", place, ")");
        return new Promise(function (y, n) {
            if (typeof (place.placeId) !== "undefined") {
                y(db_1.default.query(c, "update place set " +
                    "placeName = ?, " +
                    "address = ?, " +
                    "lat = ?, " +
                    "lng = ? " +
                    "where placeId = ?", [
                    place.placeName,
                    place.address,
                    _this.fix(place.lat), _this.fix(place.lng),
                    place.placeId
                ]).then(function () { return place; }));
            }
            else {
                y(db_1.default.query(c, "insert into place (placeName, address, lat, lng) " +
                    "values (?, ?, ?, ?)", [place.placeName, place.address,
                    _this.fix(place.lat), _this.fix(place.lng),
                ]).then(function (rs) {
                    log_1.default("Inserted place with placeId " + rs.insertId);
                    place.placeId = rs.insertId;
                    return place;
                }));
            }
        });
    };
    /**
     * Assigns a place to a user, stored as a user_place record.
     *
     * Note:  The upId of the given userPlace will be ignored and
     * a new one will be written to the object upon insert.
     *
     * @param c         The connection
     * @param userPlace The entry to insert.
     * @returns A promise of the saved UserPlace with the upId field populated.
     */
    PlacesService.prototype.assignPlace = function (c, userPlace) {
        console.log("PlaceService.addUserPlace( c, userPlace = ", userPlace, ")");
        return db_1.default.query(c, "insert into user_place " +
            "(userId, placeId, label, rank) values (?, ?, ?, ?)", [userPlace.userId, userPlace.placeId, userPlace.label,
            userPlace.rank ? userPlace.rank : 0
        ]).
            then(function (rs) {
            userPlace.upId = rs.insertId;
            return userPlace;
        });
    };
    /**
     * Unassigns a place from a user.
     *
     * @param c         The connection
     * @param userId    The userId who is assigned the user_place identified by the upId
     * @param placeId   The id of the place to unassign from the user
     * @returns {Promise<any>}
     */
    PlacesService.prototype.unassignPlace = function (c, userId, placeId) {
        console.log("PlacesService.deleteUserPlace( c, userId = ", userId, ", placeId = ", placeId, ")");
        return db_1.default.query(c, "delete from user_place where userId = ? and placeId = ?", [userId, placeId]);
    };
    /**
     * Promises to return whether or not the given userId is assigned to the
     * given placeId.
     *
     * @param c         A database connection
     * @param userId    The userId
     * @param placeId   The placeId
     */
    PlacesService.prototype.isAssigned = function (c, userId, placeId) {
        console.log("PlacesService.isAssigned(c, userId = " + userId + ", " + placeId);
        return db_1.default.query(c, "select * from user_place where userId = ? and placeId = ?", [userId, placeId]).
            then(function (rows) { return rows.length > 0; });
    };
    /**
     * Loads places assigned to the given user
     *
     * @param c         A database connection
     * @param userId    The id of the user
     * @returns {Promise<TResult>|Promise<U>}
     */
    PlacesService.prototype.loadUserPlaces = function (c, userId) {
        console.log("PlacesService.loadUserPlaces( c, userId = ", userId, ")");
        return db_1.default.query(c, "select up.*, p.placeId, p.placeName, p.address, p.lat, p.lng " +
            "from user_place up, place p " +
            "where up.placeId = p.placeId and " +
            "up.userId = ? " +
            "order by rank, upId", [userId]).then(function (rs) {
            return rs.map(function (row) {
                var place = new Place(row.placeName, row.address, row.lat, row.lng, row.placeId);
                return new UserPlace(row.userId, place.placeId, row.label, row.rank, row.upId, place);
            });
        });
    };
    PlacesService.prototype.setRank = function (c, userId, upIds) {
        var updates = [];
        upIds.forEach(function (upId, index) {
            updates.push(db_1.default.query(c, "update user_place set rank = ? where upId = ? and userId = ?", [index, upId, userId]));
        });
        return Promise.all(upIds);
    };
    return PlacesService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlacesService;
var Place = (function () {
    function Place(placeName, // the name of the place
        address, // the address of the place
        lat, // latitude
        lng, // longitude
        placeId // primary key
        ) {
        this.placeName = placeName;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.placeId = placeId;
    }
    return Place;
})();
exports.Place = Place;
// Represents a row of the 'dial' table.
var UserPlace = (function () {
    function UserPlace(userId, // the user to whom the place is assigsned
        placeId, // the placeId
        label, // the label to represent the address
        rank, // used to sort and re-order
        upId, // primary key
        place // Not persisted, but may be decorated by API during load.
        ) {
        this.userId = userId;
        this.placeId = placeId;
        this.label = label;
        this.rank = rank;
        this.upId = upId;
        this.place = place;
    }
    /**
     * One UserPlace is considered equal to another if the following fields are equal:
     * (userId, placeId, label)
     *
     * @param userPlace
     */
    UserPlace.prototype.equals = function (userPlace) {
        return (userPlace.userId == this.userId &&
            userPlace.placeId == this.placeId &&
            userPlace.label == this.label);
    };
    return UserPlace;
})();
exports.UserPlace = UserPlace;
//# sourceMappingURL=Places.js.map
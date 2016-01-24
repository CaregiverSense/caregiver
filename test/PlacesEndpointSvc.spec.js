/// <reference path="../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../routes/dao/db");
var Places_1 = require("../routes/places/Places");
var PlacesEndpointSvc_1 = require("../routes/places/PlacesEndpointSvc");
var User_1 = require("../routes/user/User");
var User_2 = require("../routes/user/User");
var TestUtil_1 = require("./TestUtil");
var chai_1 = require("chai");
db_1.default.init("test/databaseSettings.json");
var chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();
describe("PlacesEndpointSvc", function () {
    beforeEach(function () {
        return db_1.default.getConnection(function (c) {
            return TestUtil_1.default.resetDatabase(c);
        });
    });
    it("supports the find() endpoint", function () {
        return db_1.default.getConnection(function (c) {
            // Save some places then find the right one by lat/lng
            var place1 = new Places_1.Place("X1", "A1", 1.1, 1.2);
            var place2 = new Places_1.Place("X2", "A2", 2.1, 2.2);
            var place3 = new Places_1.Place("X3", "A3", 3.1, 3.2);
            return PlacesEndpointSvc_1.default.save(c, place1).
                then(function () { return PlacesEndpointSvc_1.default.save(c, place2); }).
                then(function () { return PlacesEndpointSvc_1.default.save(c, place3); }).
                then(function () {
                return PlacesEndpointSvc_1.default.find(c, 2.1, 2.2);
            }).
                then(function (result) {
                chai_1.expect(result).to.not.be.a('null');
                chai_1.expect(result.found).to.equal(true);
                chai_1.expect(result.placeName).to.equals(place2.placeName);
            });
        });
    });
    it("supports the save() endpoint", function () {
        return db_1.default.getConnection(function (c) {
            var name = "TestPlace";
            var address = "398 Atlantic Ave, Toronto";
            var lat = 3.14159;
            var lng = 9.51413;
            var place = new Places_1.Place(name, address, lat, lng);
            return PlacesEndpointSvc_1.default.save(c, place).
                then(function () {
                return db_1.default.query(c, "select * from place where placeName = ?", [name]);
            }).then(function (rows) {
                chai_1.expect(rows).to.not.be.a("null");
                chai_1.expect(rows.length).to.equal(1);
                chai_1.expect(rows[0].placeName).to.equal(name);
                chai_1.expect(rows[0].address).to.equal(address);
                chai_1.expect(rows[0].lat).to.equal(lat);
                chai_1.expect(rows[0].lng).to.equal(lng);
            });
        });
    });
    it("the saveAndAssign() endpoint will save and assign a place", function () {
        return db_1.default.getConnection(function (c) {
            var name = "SomePlace";
            var label = "SomeLabel";
            var address = "398 Pacific Ave, Toronto";
            var lat = 3.14159;
            var lng = 9.51413;
            var place = new Places_1.Place(name, address, lat, lng);
            var user = new User_2.User({ fbId: "saveAndAssign", role: 'patient' });
            return User_1.default.addUser(c, user).
                then(function () {
                return PlacesEndpointSvc_1.default.save(c, place);
            }).then(function () {
                return PlacesEndpointSvc_1.default.saveAndAssign(c, place, user, label);
            }).then(function () {
                return db_1.default.query(c, "select * from place where placeName = ?", [name]);
            }).then(function (rows) {
                chai_1.expect(rows).to.not.be.a("null");
                chai_1.expect(rows.length).to.equal(1);
                chai_1.expect(rows[0].placeName).to.equal(name);
                chai_1.expect(rows[0].address).to.equal(address);
                chai_1.expect(rows[0].lat).to.equal(lat);
                chai_1.expect(rows[0].lng).to.equal(lng);
                return true;
            }).then(function () {
                return db_1.default.query(c, "select * from user_place where userId = ?", [user.userId]);
            }).then(function (rows) {
                chai_1.expect(rows).to.not.be.a("null");
                chai_1.expect(rows.length).to.equal(1);
                chai_1.expect(rows[0].placeId).to.equal(place.placeId);
                chai_1.expect(rows[0].userId).to.equal(user.userId);
                chai_1.expect(rows[0].label).to.equal(label);
                return true;
            });
        });
    });
    it("should support the unassign() endpoint", function () {
        // Create a user and a place, assign the user to the place and verify the assignment.
        // Perform the unassignment and verify that the assignment was removed.
        return db_1.default.getConnection(function (c) {
            var name = "ANicePlace";
            var label = "ANiceLabel";
            var address = "398 Arctic Ave, Toronto";
            var lat = 0.12345;
            var lng = 29.5113;
            var place = new Places_1.Place(name, address, lat, lng);
            var user = new User_2.User({ fbId: "unassign", role: 'patient' });
            var placesSvc = new Places_1.default();
            return User_1.default.addUser(c, user).
                then(function () { return placesSvc.savePlace(c, place); }).
                then(function () { return placesSvc.isAssigned(c, user.userId, place.placeId); }).
                then(function (assigned) {
                if (assigned)
                    throw "Unexpected assignment";
                return true;
            }).
                then(function () { return placesSvc.assignPlace(c, new Places_1.UserPlace(user.userId, place.placeId, label)); }).
                then(function () { return placesSvc.isAssigned(c, user.userId, place.placeId); }).
                then(function (assigned) {
                if (!assigned)
                    throw "Missing assignment";
                return true;
            }).
                then(function () { return PlacesEndpointSvc_1.default.unassign(c, user, user.userId, place.placeId); }).
                then(function () { return placesSvc.isAssigned(c, user.userId, place.placeId); }).
                then(function (assigned) {
                if (assigned)
                    throw "Unexpected assignment";
                return true;
            });
        });
    });
});
//# sourceMappingURL=PlacesEndpointSvc.spec.js.map
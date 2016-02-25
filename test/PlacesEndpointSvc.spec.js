/// <reference path="../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../routes/dao/db");
var Places_1 = require("../routes/places/Places");
var PlacesEndpointSvc_1 = require("../routes/places/PlacesEndpointSvc");
var User_1 = require("../routes/user/User");
var User_2 = require("../routes/user/User");
var TestUtil_1 = require("./TestUtil");
var chai_1 = require("chai");
var chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();
describe("PlacesEndpointSvc", function () {
    var placeA = new Places_1.Place("TestPlaceA", "123 Street Rd.", "11.11119999", "22.11119999");
    var placeB = new Places_1.Place("TestPlaceB", "124 Street Rd.", "11.22229999", "22.22229999");
    var placeC = new Places_1.Place("TestPlaceC", "125 Street Rd.", "11.33339999", "22.33339999");
    var userA = new User_2.User({ fbId: "U1", name: "User A", role: 'patient' });
    var userB = new User_2.User({ fbId: "U2", name: "User B", role: 'patient' });
    beforeEach(function () {
        return db_1.default.getConnection(function (c) {
            return TestUtil_1.default.resetDatabase(c).
                then(function () { return User_1.default.addUser(c, userA); }).
                then(function () { return User_1.default.addUser(c, userB); }).
                then(function () { return PlacesEndpointSvc_1.default.save(c, placeA); }).
                then(function () { return PlacesEndpointSvc_1.default.save(c, placeB); }).
                then(function () { return PlacesEndpointSvc_1.default.save(c, placeC); });
        });
    });
    it("supports the sort() endpoint", function () {
        return db_1.default.getConnection(function (c) {
            // Assign each place to userA and userB, then sort userA's assignments.
            var a1 = new Places_1.UserPlace(userA.userId, placeA.placeId, "UA,PA", 1);
            var a2 = new Places_1.UserPlace(userA.userId, placeB.placeId, "UA,PB", 3);
            var a3 = new Places_1.UserPlace(userA.userId, placeC.placeId, "UA,PC", 2);
            var b1 = new Places_1.UserPlace(userB.userId, placeA.placeId, "UB,PA", 3);
            var b2 = new Places_1.UserPlace(userB.userId, placeB.placeId, "UB,PB", 2);
            var b3 = new Places_1.UserPlace(userB.userId, placeC.placeId, "UB,PC", 1);
            var ps = new Places_1.default();
            return ps.assignPlace(c, a1).
                then(function () { return ps.assignPlace(c, a2); }).
                then(function () { return ps.assignPlace(c, a3); }).
                then(function () { return ps.assignPlace(c, b1); }).
                then(function () { return ps.assignPlace(c, b2); }).
                then(function () { return ps.assignPlace(c, b3); }).
                then(function () { return ps.loadUserPlaces(c, userA.userId); }).
                then(function (userPlacesForA) {
                chai_1.expect(userPlacesForA).to.not.be.a('null');
                chai_1.expect(userPlacesForA.length).to.equal(3);
                chai_1.expect(userPlacesForA[0].equals(a1)).to.be.true;
                chai_1.expect(userPlacesForA[1].equals(a3)).to.be.true;
                chai_1.expect(userPlacesForA[2].equals(a2)).to.be.true;
            }).
                then(function () {
                var upIds = [a1.upId, a2.upId, a3.upId];
                return PlacesEndpointSvc_1.default.sort(c, userA, userA.userId, upIds);
            }).
                then(function () { return ps.loadUserPlaces(c, userA.userId); }).
                then(function (userPlacesForA) {
                chai_1.expect(userPlacesForA).to.not.be.a('null');
                chai_1.expect(userPlacesForA.length).to.equal(3);
                chai_1.expect(userPlacesForA[0].equals(a1)).to.be.true;
                chai_1.expect(userPlacesForA[1].equals(a2)).to.be.true;
                chai_1.expect(userPlacesForA[2].equals(a3)).to.be.true;
            }).
                then(function () {
                var upIds = [a3.upId, a1.upId, a2.upId];
                return PlacesEndpointSvc_1.default.sort(c, userA, userA.userId, upIds);
            }).
                then(function () { return ps.loadUserPlaces(c, userA.userId); }).
                then(function (userPlacesForA) {
                chai_1.expect(userPlacesForA).to.not.be.a('null');
                chai_1.expect(userPlacesForA.length).to.equal(3);
                chai_1.expect(userPlacesForA[0].equals(a3)).to.be.true;
                chai_1.expect(userPlacesForA[1].equals(a1)).to.be.true;
                chai_1.expect(userPlacesForA[2].equals(a2)).to.be.true;
            }).
                then(function () { return ps.loadUserPlaces(c, userB.userId); }).
                then(function (userPlacesForB) {
                chai_1.expect(userPlacesForB).to.not.be.a('null');
                chai_1.expect(userPlacesForB.length).to.equal(3);
                chai_1.expect(userPlacesForB[0].equals(b3)).to.be.true;
                chai_1.expect(userPlacesForB[1].equals(b2)).to.be.true;
                chai_1.expect(userPlacesForB[2].equals(b1)).to.be.true;
            });
        });
    });
    it("supports the find() endpoint", function () {
        return db_1.default.getConnection(function (c) {
            // Save some places then find the right one by lat/lng
            var place1 = new Places_1.Place("X1", "A1", "1.1", "1.2");
            var place2 = new Places_1.Place("X2", "A2", "2.1", "2.2");
            var place3 = new Places_1.Place("X3", "A3", "3.1", "3.2");
            return PlacesEndpointSvc_1.default.save(c, place1).
                then(function () { return PlacesEndpointSvc_1.default.save(c, place2); }).
                then(function () { return PlacesEndpointSvc_1.default.save(c, place3); }).
                then(function () {
                return PlacesEndpointSvc_1.default.find(c, "2.1", "2.2");
            }).
                then(function (result) {
                chai_1.expect(result).to.not.be.a('null');
                chai_1.expect(result.found).to.equal(true);
                chai_1.expect(result.placeName).to.equals(place2.placeName);
            });
        });
    });
    it("can find items with high precision lat/lng", function () {
        var place = new Places_1.Place("X4", "A4", "43.650893", "-79.378380999999999999999999");
        return db_1.default.getConnection(function (c) {
            return PlacesEndpointSvc_1.default.save(c, place).
                then(function () {
                return PlacesEndpointSvc_1.default.find(c, "43.650893", "-79.378380999999999999999999");
            }).
                then(function (result) {
                chai_1.expect(result).to.not.be.a('null');
                chai_1.expect(result.found).to.equal(true);
                chai_1.expect(result.placeName).to.equals(place.placeName);
            });
        });
    });
    it("supports the save() endpoint", function () {
        return db_1.default.getConnection(function (c) {
            var name = "TestPlace";
            var address = "398 Atlantic Ave, Toronto";
            var lat = "3.14159";
            var lng = "9.51413";
            var place = new Places_1.Place(name, address, lat, lng);
            return PlacesEndpointSvc_1.default.save(c, place).
                then(function () {
                return db_1.default.query(c, "select * from place where placeName = ?", [name]);
            }).then(function (rows) {
                chai_1.expect(rows).to.not.be.a("null");
                chai_1.expect(rows.length).to.equal(1);
                chai_1.expect(rows[0].placeName).to.equal(name);
                chai_1.expect(rows[0].address).to.equal(address);
                chai_1.expect("" + rows[0].lat).to.equal(lat);
                chai_1.expect("" + rows[0].lng).to.equal(lng);
            });
        });
    });
    it("the saveAndAssign() endpoint will save and assign a place", function () {
        return db_1.default.getConnection(function (c) {
            var name = "SomePlace";
            var label = "SomeLabel";
            var address = "398 Pacific Ave, Toronto";
            var lat = "3.14159";
            var lng = "9.51413";
            var place = new Places_1.Place(name, address, lat, lng);
            var user = new User_2.User({ fbId: "saveAndAssign", role: 'patient' });
            return User_1.default.addUser(c, user).
                then(function () {
                return PlacesEndpointSvc_1.default.save(c, place);
            }).then(function () {
                return PlacesEndpointSvc_1.default.saveAndAssign(c, place, user, user.userId, label);
            }).then(function () {
                return db_1.default.query(c, "select * from place where placeName = ?", [name]);
            }).then(function (rows) {
                chai_1.expect(rows).to.not.be.a("null");
                chai_1.expect(rows.length).to.equal(1);
                chai_1.expect(rows[0].placeName).to.equal(name);
                chai_1.expect(rows[0].address).to.equal(address);
                chai_1.expect("" + rows[0].lat).to.equal(lat);
                chai_1.expect("" + rows[0].lng).to.equal(lng);
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
            var lat = "0.12345";
            var lng = "29.5113";
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
    it("should support the loadUserPlaces() endpoint", function () {
        // Create a user and three places, assign two to the user, one to another, then load it.
        return db_1.default.getConnection(function (c) {
            var place1 = new Places_1.Place("P1", "A1", "1.1", "1.2");
            var place2 = new Places_1.Place("P1", "A1", "1.1", "1.2");
            var place3 = new Places_1.Place("P1", "A1", "1.1", "1.2");
            var placesSvc = new Places_1.default();
            return placesSvc.savePlace(c, place1).
                then(function () { return placesSvc.savePlace(c, place2); }).
                then(function () { return placesSvc.savePlace(c, place3); }).
                then(function () { return placesSvc.assignPlace(c, new Places_1.UserPlace(userA.userId, place1.placeId, "L1")); }).
                then(function () { return placesSvc.assignPlace(c, new Places_1.UserPlace(userB.userId, place2.placeId, "L2")); }).
                then(function () { return placesSvc.assignPlace(c, new Places_1.UserPlace(userB.userId, place3.placeId, "L3")); }).
                then(function () { return PlacesEndpointSvc_1.default.loadUserPlaces(c, userB, userB.userId); }).
                then(function (rows) {
                console.log(rows);
                chai_1.expect(rows).to.not.be.a('null');
                chai_1.expect(rows.length).to.equal(2);
                chai_1.expect(rows[0].userId).to.equal(userB.userId);
                chai_1.expect(rows[0].placeId).to.equal(place2.placeId);
                chai_1.expect(rows[0].label).to.equal("L2");
                chai_1.expect(rows[1].userId).to.equal(userB.userId);
                chai_1.expect(rows[1].placeId).to.equal(place3.placeId);
                chai_1.expect(rows[1].label).to.equal("L3");
            });
        });
    });
});
//# sourceMappingURL=PlacesEndpointSvc.spec.js.map
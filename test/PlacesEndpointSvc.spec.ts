/// <reference path="../typings/tsd.d.ts" />
"use strict"

import db from "../routes/dao/db"
import PlacesService, { Place, UserPlace } from "../routes/places/Places"
import svc from "../routes/places/PlacesEndpointSvc"
import UserService from "../routes/user/User"
import NoteService from "../routes/notes/notes"
import { Note } from "../routes/notes/notes"
import { User, IUser } from "../routes/user/User"
import TestUtil from "./TestUtil"
import { expect } from "chai"

db.init("test/databaseSettings.json")

let chai = require("chai")
chai.use(require("chai-as-promised"))
chai.should()


describe("PlacesEndpointSvc", function() {

    beforeEach(function() {
        return db.getConnection(c => {
            return TestUtil.resetDatabase(c)
        })
    })

    it("supports the find() endpoint", function() {

        return db.getConnection(c => {

            // Save some places then find the right one by lat/lng

            let place1 = new Place("X1", "A1", "1.1", "1.2")
            let place2 = new Place("X2", "A2", "2.1", "2.2")
            let place3 = new Place("X3", "A3", "3.1", "3.2")


            return svc.save(c, place1).
                then(() => svc.save(c, place2)).
                then(() => svc.save(c, place3)).
                then(() => {
                    return svc.find(c, "2.1", "2.2")
                }).
                then((result) => {
                    expect(result).to.not.be.a('null')
                    expect(result.found).to.equal(true)
                    expect(result.placeName).to.equals(place2.placeName)
                })
        })
    })

    it("can find items with high precision lat/lng", function() {
        let place = new Place("X4", "A4", "43.650893", "-79.378380999999999999999999")

        return db.getConnection(c => {
            return svc.save(c, place).
                then(() => {
                    return svc.find(c, "43.650893", "-79.378380999999999999999999")
                }).
                then((result) => {
                    expect(result).to.not.be.a('null')
                    expect(result.found).to.equal(true)
                    expect(result.placeName).to.equals(place.placeName)
                })
        })

    })

    it("supports the save() endpoint", function() {

        return db.getConnection(c => {
            let name    = "TestPlace"
            let address = "398 Atlantic Ave, Toronto"
            let lat     = "3.14159"
            let lng     = "9.51413"

            let place = new Place(name, address, lat, lng)

            return svc.save(c, place).
                then(() => {
                    return db.query(c, "select * from place where placeName = ?", [name])
                }).then((rows) => {
                    expect(rows).to.not.be.a("null")
                    expect(rows.length).to.equal(1)
                    expect(rows[0].placeName).to.equal(name)
                    expect(rows[0].address).to.equal(address)
                    expect(""+rows[0].lat).to.equal(lat)
                    expect(""+rows[0].lng).to.equal(lng)
                })
        })


    })

    it("the saveAndAssign() endpoint will save and assign a place", function() {
        return db.getConnection(c => {
            let name    = "SomePlace"
            let label   = "SomeLabel"
            let address = "398 Pacific Ave, Toronto"
            let lat     = "3.14159"
            let lng     = "9.51413"

            let place = new Place(name, address, lat, lng)
            let user = new User({fbId:"saveAndAssign", role:'patient'})

            return UserService.addUser(c, user).
            then(() => {
                return svc.save(c, place)
            }).then(() => {
                return svc.saveAndAssign(c, place, user, label)
            }).then(() => {
                return db.query(c, "select * from place where placeName = ?", [name])
            }).then((rows) => {
                expect(rows).to.not.be.a("null")
                expect(rows.length).to.equal(1)
                expect(rows[0].placeName).to.equal(name)
                expect(rows[0].address).to.equal(address)
                expect(""+rows[0].lat).to.equal(lat)
                expect(""+rows[0].lng).to.equal(lng)
                return true
            }).then(() => {
                return db.query(c, "select * from user_place where userId = ?", [user.userId])
            }).then((rows) => {
                expect(rows).to.not.be.a("null")
                expect(rows.length).to.equal(1)

                expect(rows[0].placeId).to.equal(place.placeId)
                expect(rows[0].userId).to.equal(user.userId)
                expect(rows[0].label).to.equal(label)
                return true
            })

        })
    })

    it("should support the unassign() endpoint", function() {
        // Create a user and a place, assign the user to the place and verify the assignment.
        // Perform the unassignment and verify that the assignment was removed.

        return db.getConnection(c => {
            let name    = "ANicePlace"
            let label   = "ANiceLabel"
            let address = "398 Arctic Ave, Toronto"
            let lat     = "0.12345"
            let lng     = "29.5113"

            let place = new Place(name, address, lat, lng)
            let user = new User({fbId:"unassign", role:'patient'})
            let placesSvc = new PlacesService()

            return UserService.addUser(c, user).
                then(() => placesSvc.savePlace(c, place)).
                then(() => placesSvc.isAssigned(c, user.userId, place.placeId)).
                then((assigned) => {
                    if (assigned) throw "Unexpected assignment"
                    return true
                }).
                then(() => placesSvc.assignPlace(c,
                    new UserPlace(user.userId, place.placeId, label))
                ).
                then(() => placesSvc.isAssigned(c, user.userId, place.placeId)).
                then((assigned) => {
                    if (!assigned) throw "Missing assignment"
                    return true
                }).
                then(() => svc.unassign(c, user, user.userId, place.placeId)).
                then(() => placesSvc.isAssigned(c, user.userId, place.placeId)).
                then((assigned) => {
                    if (assigned) throw "Unexpected assignment"
                    return true
                })
            })
    })

    it("should support the loadUserPlaces() endpoint", function() {
        // Create a user and three places, assign two to the user, one to another, then load it.

        return db.getConnection(c => {

            let place1 = new Place("P1", "A1", "1.1", "1.2")
            let place2 = new Place("P1", "A1", "1.1", "1.2")
            let place3 = new Place("P1", "A1", "1.1", "1.2")
            let user1 = new User({fbId:"U1", role:'patient'})
            let user2 = new User({fbId:"U2", role:'patient'})

            let placesSvc = new PlacesService()

            return UserService.addUser(c, user1).
            then(() => UserService.addUser(c, user2)).
            then(() => placesSvc.savePlace(c, place1)).
            then(() => placesSvc.savePlace(c, place2)).
            then(() => placesSvc.savePlace(c, place3)).
            then(() => placesSvc.assignPlace(c,
                new UserPlace(user1.userId, place1.placeId, "L1"))
            ).
            then(() => placesSvc.assignPlace(c,
                new UserPlace(user2.userId, place2.placeId, "L2"))
            ).
            then(() => placesSvc.assignPlace(c,
                new UserPlace(user2.userId, place3.placeId, "L3"))
            ).
            then(() => svc.loadUserPlaces(c, user2, user2.userId)).
            then(rows => {
                console.log(rows)
                expect(rows).to.not.be.a('null')
                expect(rows.length).to.equal(2)
                expect(rows[0].userId).to.equal(user2.userId)
                expect(rows[0].placeId).to.equal(place2.placeId)
                expect(rows[0].label).to.equal("L2")
                expect(rows[1].userId).to.equal(user2.userId)
                expect(rows[1].placeId).to.equal(place3.placeId)
                expect(rows[1].label).to.equal("L3")
            })
        })
    })
})
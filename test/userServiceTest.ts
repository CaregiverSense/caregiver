/// <reference path="../typings/tsd.d.ts" />
"use strict"

import { PhoneNumber } from "../routes/dial/Dial";
import { expect } from "chai"
import * as chai from "chai"

import db from "../routes/dao/db";
db.init("test/databaseSettings.json");

import User, { UserService, IUser } from "../routes/user/User";
import TestUtil from "./TestUtil"

chai.use(require("chai-as-promised"))
chai.should()

describe("User", function() {

    let userA   = new User({fbId : "P1"})
    let userB   = new User({fbId : "P2"})

    beforeEach(function() {
        return db.getConnection(c => {
            return TestUtil.resetDatabase(c).then(
                () => Promise.all([
                        UserService.addUser(c, userA),
                        UserService.addUser(c, userB)
                    ])
            )
        })
    })

    describe("#makeSupervisorOf(userId)", function() {

        it("should make a user a supervisor of another", function(done) {
            db.getConnection(c => {
                return userA.makeSupervisorOf(c, userB.userId).
                then(() => {
                    userA.isSupervisorOf(c, userB.userId).should.eventually.equal(true)
                    userB.isSupervisorOf(c, userA.userId).should.eventually.equal(false)
                    done()
                })
            }).catch(done)
        })
    })

    describe("#isSupervisorOf(userId)", function() {


        let supervisorA = new User({fbId : "S1"})


        before(function() {
            return db.getConnection(c => {
                return UserService.addUser(c, supervisorA)
            })
        })

        it("resolves to true if this is a supervisor of the user", function(done) {
            db.getConnection(c => {
                supervisorA.makeSupervisorOf(c, userA.userId).
                    then(() => {
                        expect(supervisorA.isSupervisorOf(c, userA.userId)).to.equal(true)
                        done()
                    })
            }).catch(done)
        })

        it("resolves to false if this is not a supervisor of the user", function(done) {
            db.getConnection(c => {
                supervisorA.makeSupervisorOf(c, userA.userId).
                then(() => {
                    expect(supervisorA.isSupervisorOf(c, userB.userId)).to.equal(false)
                    done()
                })
            }).catch(done)
        })
    })

    describe("#hasAccessTo(userId)", function() {

        it("allows the user to access themself ", function(done) {
            db.getConnection(c => {
                return userA.hasAccessTo(c, userB.userId).then((result) => {
                    expect(result).to.equal(false)
                    done()
                })
            }).catch(done)
        })

        it("prevents the user from accessing another user", function(done) {
            db.getConnection(c => {
                return userA.hasAccessTo(c, userA.userId).then((result) => {
                    expect(result).to.equal(true)
                    done()
                })
            }).catch(done)
        })

        it("allows access if this is a caregiver of the userId", function() {

        })

        it("denies access if this is a caregiver, but not of the user", function() {

        })

        it("allows access if the user is an admin", function() {

        })

    })

})

describe("UserService", function() {

    before(function() {
        return db.getConnection(c => TestUtil.resetDatabase(c))
    })

    describe("#addUser(IUser)", function() {
        it("can save a user with all properties", function(done) {
            db.getConnection(c => {
                var user : IUser = {
                    tagId      : "A",
                    name       : "B",
                    email      : "C",
                    fbId       : "D",
                    fbLink     : "E",
                    role       : "F",
                    first_name : "G",
                    last_name  : "H",
                    locale     : "I",
                    timezone   : "J"
                }
                UserService.addUser(c, user).then(() => {
                        console.log("selecting user")

                        // Check that it is saved
                        return db.queryOne(c, "select * from user where tagId = 'A'", [])

                    }).then((user) => {
                        console.log("asserting")
                        expect(user).to.not.be.a('null')
                        expect(user.tagId).to.equal("A")
                        expect(user.name).to.equal("B")
                        expect(user.email).to.equal("C")
                        expect(user.fbId).to.equal("D")
                        expect(user.fbLink).to.equal("E")
                        expect(user.role).to.equal("F")
                        expect(user.first_name).to.equal("G")
                        expect(user.last_name).to.equal("H")
                        expect(user.locale).to.equal("I")
                        expect(user.timezone).to.equal("J")
                        console.log("calling done")
                        done()
                    }).catch(done)
            })
            // check there is a user id
        })
    })

    describe("#loadUserByFbId(fbId)", function () {

        it("loads the right user", function(done) {

            db.getConnection(c => {
                Promise.all([
                    UserService.addUser(c, {fbId: "U1", name : "A"}),
                    UserService.addUser(c, {fbId: "U2", name : "B"}),
                    UserService.addUser(c, {fbId: "U3", name : "C"}),
                    UserService.addUser(c, {fbId: "U4", name : "D"})
                ]).then(() => {
                    return UserService.loadUserByFbId(c, "U3").then((user) => {
                        expect(user).to.not.be.a('null')
                        expect(user.fbId).to.equal('U3')
                        expect(user.name).to.equal('C')
                        expect(user.userId).to.be.a('number')
                        done()
                    })
                }).catch(done)
            })
        })
    });
})
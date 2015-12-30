/// <reference path="../typings/tsd.d.ts" />
"use strict"
import TestUtil from "./TestUtil";

import { PhoneNumber } from "../routes/dial/Dial";
import { expect } from "chai"
import * as chai from "chai"

import db from "../routes/dao/db";
db.init("test/databaseSettings.json");

import UserService from "../routes/user/User";
import { User, IUser } from "../routes/user/User";


chai.use(require("chai-as-promised"))
chai.should()

let userA: User, userB: User, supervisorA: User;

function createTestUsers(done) {
    console.log("Created test users");
    userA = new User({fbId : "P1"})
    userB = new User({fbId : "P2"})
    supervisorA = new User({fbId : "S1", role : 'caregiver'})
    return db.getConnection(c => {
        return TestUtil.resetDatabase(c).then(
            () => Promise.all([
                UserService.addUser(c, userA),
                UserService.addUser(c, userB),
                UserService.addUser(c, supervisorA),
            ])
        ).then(() => supervisorA.makeSupervisorOf(c, userA.userId)
        ).then(() => done())
    }).catch(done)
}

describe("User", function() {

    beforeEach(createTestUsers)

    describe("#makeSupervisorOf(userId)", function () {

        it("should make a user a supervisor of another", function (done) {
            return db.getConnection(c => {
                return userA.makeSupervisorOf(c, userB.userId).then(() => {
                    userA.isSupervisorOf(c, userB.userId).should.eventually.equal(true)
                    userB.isSupervisorOf(c, userA.userId).should.eventually.equal(false)
                    done()
                })
            }).catch(done)
        })
    })

    describe("#isSupervisorOf(userId)", function () {

        it("resolves to true if this is a supervisor of the user", function (done) {
            return db.getConnection(c => {
                supervisorA.makeSupervisorOf(c, userA.userId).then(() => {
                    expect(supervisorA.isSupervisorOf(c, userA.userId)).to.equal(true)
                    done()
                })
            }).catch(done)
        })

        it("resolves to false if this is not a supervisor of the user", function (done) {
            return db.getConnection(c => {
                supervisorA.makeSupervisorOf(c, userA.userId).then(() => {
                    expect(supervisorA.isSupervisorOf(c, userB.userId)).to.equal(false)
                    done()
                })
            }).catch(done)
        })
    })

    describe("#hasAccessTo(userId)", function () {

        it("allows the user to access themself ", function (done) {
            return db.getConnection(c => {
                return userA.hasAccessTo(c, userA.userId).then((result) => {
                    expect(result).to.equal(true)
                    done()
                })
            }).catch(done)
        })

        it("prevents the user from accessing another user", function (done) {
            return db.getConnection(c => {
                return userA.hasAccessTo(c, userB.userId).then((result) => {
                    expect(result).to.equal(false)
                    done()
                })
            }).catch(done)
        })

        it("allows access if this user supervises the other", function (done) {
            return db.getConnection(c => {
                return supervisorA.hasAccessTo(c, userA.userId).then((result) => {
                    expect(result).to.equal(true)
                    done()
                })
            }).catch(done)
        })

        it("denies access if this is a supervisor, but not of the user", function (done) {
            return db.getConnection(c => {
                return supervisorA.hasAccessTo(c, userB.userId).then((result) => {
                    expect(result).to.equal(false)
                    done()
                })
            }).catch(done)
        })

        it.skip("allows access if the user is an admin", function(done) {

        })

    })

})

describe("UserService", function() {

    beforeEach(createTestUsers)

    describe("#addUser(IUser)", function() {
        it("can save a user with all properties", function(done) {
            return db.getConnection(c => {
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
                    timezone   : "J",
                    patientId  : 101
                }
                return UserService.addUser(c, user).then(() => {
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
                        expect(user.patientId).to.equal(101)
                        done()
                    })
            }).catch(done)
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
    })

    describe("#loadUsersByRole(..)", function() {
        it("should load only users with a given role", function(done) {
            return db.getConnection(c => {

                return UserService.loadUsersByRole(c, 'caregiver').
                    then((users) => {
                    expect(users).to.be.an("array")
                    expect(users.length).to.equal(1)
                    expect(users[0].fbId).to.equal('S1')
                    expect(users[0].role).to.equal('caregiver')
                    done()
                })

            }).catch(done)
        })
    })
})
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
    userA = new User({fbId : "P1", name:"User A", role:'patient'})
    userB = new User({fbId : "P2", name:"User B", role:'patient'})
    supervisorA = new User({fbId : "S1", name:"Supervisor A", role : 'caregiver'})
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

    describe("#ifAdmin", function() {
        it("should return true if the user is an admin", function() {
            let admin = new User({fbId : "C1", name:"User A", role : 'admin'})
            return admin.ifAdmin()
        })

        it("should return false if the user has a non-admin role", function() {
            let user = new User({fbId : "C1", name:"User A", role : 'caregiver'})
            user.ifAdmin().should.be.rejected
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
                    UserService.addUser(c, {fbId: "U1", name : "A", role:'patient'}),
                    UserService.addUser(c, {fbId: "U2", name : "B", role:'patient'}),
                    UserService.addUser(c, {fbId: "U3", name : "C", role:'patient'}),
                    UserService.addUser(c, {fbId: "U4", name : "D", role:'patient'})
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

    describe("#loadAllMasked", function() {
        it("should return sorted by name", function() {
            return db.getConnection(c => {
                return UserService.loadAllMasked(c, null).
                    then((users) => {

                        expect(users).to.be.an('array')
                        expect(users.length).to.equal(3)
                        expect(users[0].name).to.equal('Supervisor A')
                        expect(users[1].name).to.equal('User A')
                        expect(users[2].name).to.equal('User B')
                    })
            })
        })
        it("should just return properties specified in the mask", function() {
            return db.getConnection(c => {
                return UserService.loadAllMasked(c, "name,email").
                then((users) => {

                    expect(users).to.be.an('array')
                    expect(users.length).to.equal(3)

                    let u = users[0]
                    expect(u.userId).to.be.undefined
                    expect(u.tagId).to.be.undefined
                    expect(u.name).to.equal('Supervisor A')
                    expect(u.email).to.be.null
                    expect(u.fbId).to.be.undefined
                    expect(u.fbLink).to.be.undefined
                    expect(u.role).to.be.undefined
                    expect(u.first_name).to.be.undefined
                    expect(u.last_name).to.be.undefined
                    expect(u.locale).to.be.undefined
                    expect(u.timezone).to.be.undefined
                    expect(u.patientId).to.be.undefined
                })
            })
        })
    })
})
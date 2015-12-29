/// <reference path="../typings/tsd.d.ts" />
"use strict";
var chai_1 = require("chai");
var chai = require("chai");
var db_1 = require("../routes/dao/db");
db_1.default.init("test/databaseSettings.json");
var User_1 = require("../routes/user/User");
var TestUtil_1 = require("./TestUtil");
chai.use(require("chai-as-promised"));
chai.should();
describe("User", function () {
    let userA = new User_1.default({ fbId: "P1" });
    let userB = new User_1.default({ fbId: "P2" });
    beforeEach(function () {
        return db_1.default.getConnection(c => {
            return TestUtil_1.default.resetDatabase(c).then(() => Promise.all([
                User_1.UserService.addUser(c, userA),
                User_1.UserService.addUser(c, userB)
            ]));
        });
    });
    describe("#makeSupervisorOf(userId)", function () {
        it("should make a user a supervisor of another", function (done) {
            db_1.default.getConnection(c => {
                return userA.makeSupervisorOf(c, userB.userId).
                    then(() => {
                    userA.isSupervisorOf(c, userB.userId).should.eventually.equal(true);
                    userB.isSupervisorOf(c, userA.userId).should.eventually.equal(false);
                    done();
                });
            }).catch(done);
        });
    });
    describe("#isSupervisorOf(userId)", function () {
        let supervisorA = new User_1.default({ fbId: "S1" });
        before(function () {
            return db_1.default.getConnection(c => {
                return User_1.UserService.addUser(c, supervisorA);
            });
        });
        it("resolves to true if this is a supervisor of the user", function (done) {
            db_1.default.getConnection(c => {
                supervisorA.makeSupervisorOf(c, userA.userId).
                    then(() => {
                    chai_1.expect(supervisorA.isSupervisorOf(c, userA.userId)).to.equal(true);
                    done();
                });
            }).catch(done);
        });
        it("resolves to false if this is not a supervisor of the user", function (done) {
            db_1.default.getConnection(c => {
                supervisorA.makeSupervisorOf(c, userA.userId).
                    then(() => {
                    chai_1.expect(supervisorA.isSupervisorOf(c, userB.userId)).to.equal(false);
                    done();
                });
            }).catch(done);
        });
    });
    describe("#hasAccessTo(userId)", function () {
        it("allows the user to access themself ", function (done) {
            db_1.default.getConnection(c => {
                return userA.hasAccessTo(c, userB.userId).then((result) => {
                    chai_1.expect(result).to.equal(false);
                    done();
                });
            }).catch(done);
        });
        it("prevents the user from accessing another user", function (done) {
            db_1.default.getConnection(c => {
                return userA.hasAccessTo(c, userA.userId).then((result) => {
                    chai_1.expect(result).to.equal(true);
                    done();
                });
            }).catch(done);
        });
        it("allows access if this is a caregiver of the userId", function () {
        });
        it("denies access if this is a caregiver, but not of the user", function () {
        });
        it("allows access if the user is an admin", function () {
        });
    });
});
describe("UserService", function () {
    before(function () {
        return db_1.default.getConnection(c => TestUtil_1.default.resetDatabase(c));
    });
    describe("#addUser(IUser)", function () {
        it("can save a user with all properties", function (done) {
            db_1.default.getConnection(c => {
                var user = {
                    tagId: "A",
                    name: "B",
                    email: "C",
                    fbId: "D",
                    fbLink: "E",
                    role: "F",
                    first_name: "G",
                    last_name: "H",
                    locale: "I",
                    timezone: "J"
                };
                User_1.UserService.addUser(c, user).then(() => {
                    console.log("selecting user");
                    // Check that it is saved
                    return db_1.default.queryOne(c, "select * from user where tagId = 'A'", []);
                }).then((user) => {
                    console.log("asserting");
                    chai_1.expect(user).to.not.be.a('null');
                    chai_1.expect(user.tagId).to.equal("A");
                    chai_1.expect(user.name).to.equal("B");
                    chai_1.expect(user.email).to.equal("C");
                    chai_1.expect(user.fbId).to.equal("D");
                    chai_1.expect(user.fbLink).to.equal("E");
                    chai_1.expect(user.role).to.equal("F");
                    chai_1.expect(user.first_name).to.equal("G");
                    chai_1.expect(user.last_name).to.equal("H");
                    chai_1.expect(user.locale).to.equal("I");
                    chai_1.expect(user.timezone).to.equal("J");
                    console.log("calling done");
                    done();
                }).catch(done);
            });
            // check there is a user id
        });
    });
    describe("#loadUserByFbId(fbId)", function () {
        it("loads the right user", function (done) {
            db_1.default.getConnection(c => {
                Promise.all([
                    User_1.UserService.addUser(c, { fbId: "U1", name: "A" }),
                    User_1.UserService.addUser(c, { fbId: "U2", name: "B" }),
                    User_1.UserService.addUser(c, { fbId: "U3", name: "C" }),
                    User_1.UserService.addUser(c, { fbId: "U4", name: "D" })
                ]).then(() => {
                    return User_1.UserService.loadUserByFbId(c, "U3").then((user) => {
                        chai_1.expect(user).to.not.be.a('null');
                        chai_1.expect(user.fbId).to.equal('U3');
                        chai_1.expect(user.name).to.equal('C');
                        chai_1.expect(user.userId).to.be.a('number');
                        done();
                    });
                }).catch(done);
            });
        });
    });
});
//# sourceMappingURL=userServiceTest.js.map
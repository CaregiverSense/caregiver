/// <reference path="../typings/tsd.d.ts" />
"use strict";
var TestUtil_1 = require("./TestUtil");
var chai_1 = require("chai");
var chai = require("chai");
var db_1 = require("../routes/dao/db");
db_1.default.init("test/databaseSettings.json");
var User_1 = require("../routes/user/User");
var User_2 = require("../routes/user/User");
chai.use(require("chai-as-promised"));
chai.should();
var userA, userB, supervisorA;
function createTestUsers(done) {
    console.log("Created test users");
    userA = new User_2.User({ fbId: "P1", name: "User A", role: 'patient' });
    userB = new User_2.User({ fbId: "P2", name: "User B", role: 'patient' });
    supervisorA = new User_2.User({ fbId: "S1", name: "Supervisor A", role: 'caregiver' });
    return db_1.default.getConnection(function (c) {
        return TestUtil_1.default.resetDatabase(c).then(function () { return Promise.all([
            User_1.default.addUser(c, userA),
            User_1.default.addUser(c, userB),
            User_1.default.addUser(c, supervisorA),
        ]); }).then(function () { return supervisorA.makeSupervisorOf(c, userA.userId); }).then(function () { return done(); });
    }).catch(done);
}
describe("User", function () {
    beforeEach(createTestUsers);
    describe("#makeSupervisorOf(userId)", function () {
        it("should make a user a supervisor of another", function (done) {
            return db_1.default.getConnection(function (c) {
                return userA.makeSupervisorOf(c, userB.userId).then(function () {
                    userA.isSupervisorOf(c, userB.userId).should.eventually.equal(true);
                    userB.isSupervisorOf(c, userA.userId).should.eventually.equal(false);
                    done();
                });
            }).catch(done);
        });
    });
    describe("#ifAdmin", function () {
        it("should return true if the user is an admin", function () {
            var admin = new User_2.User({ fbId: "C1", name: "User A", role: 'admin' });
            return admin.ifAdmin();
        });
        it("should return false if the user has a non-admin role", function () {
            var user = new User_2.User({ fbId: "C1", name: "User A", role: 'caregiver' });
            user.ifAdmin().should.be.rejected;
        });
    });
    describe("#isSupervisorOf(userId)", function () {
        it("resolves to true if this is a supervisor of the user", function (done) {
            return db_1.default.getConnection(function (c) {
                supervisorA.makeSupervisorOf(c, userA.userId).then(function () {
                    chai_1.expect(supervisorA.isSupervisorOf(c, userA.userId)).to.equal(true);
                    done();
                });
            }).catch(done);
        });
        it("resolves to false if this is not a supervisor of the user", function (done) {
            return db_1.default.getConnection(function (c) {
                supervisorA.makeSupervisorOf(c, userA.userId).then(function () {
                    chai_1.expect(supervisorA.isSupervisorOf(c, userB.userId)).to.equal(false);
                    done();
                });
            }).catch(done);
        });
    });
    describe("#hasAccessTo(userId)", function () {
        it("allows the user to access themself ", function (done) {
            return db_1.default.getConnection(function (c) {
                return userA.hasAccessTo(c, userA.userId).then(function (result) {
                    chai_1.expect(result).to.equal(true);
                    done();
                });
            }).catch(done);
        });
        it("prevents the user from accessing another user", function (done) {
            return db_1.default.getConnection(function (c) {
                return userA.hasAccessTo(c, userB.userId).then(function (result) {
                    chai_1.expect(result).to.equal(false);
                    done();
                });
            }).catch(done);
        });
        it("allows access if this user supervises the other", function (done) {
            return db_1.default.getConnection(function (c) {
                return supervisorA.hasAccessTo(c, userA.userId).then(function (result) {
                    chai_1.expect(result).to.equal(true);
                    done();
                });
            }).catch(done);
        });
        it("denies access if this is a supervisor, but not of the user", function (done) {
            return db_1.default.getConnection(function (c) {
                return supervisorA.hasAccessTo(c, userB.userId).then(function (result) {
                    chai_1.expect(result).to.equal(false);
                    done();
                });
            }).catch(done);
        });
        it.skip("allows access if the user is an admin", function (done) {
        });
    });
});
describe("UserService", function () {
    beforeEach(createTestUsers);
    describe("#addUser(IUser)", function () {
        it("can save a user with all properties", function (done) {
            return db_1.default.getConnection(function (c) {
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
                    timezone: "J",
                    patientId: 101
                };
                return User_1.default.addUser(c, user).then(function () {
                    console.log("selecting user");
                    // Check that it is saved
                    return db_1.default.queryOne(c, "select * from user where tagId = 'A'", []);
                }).then(function (user) {
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
                    chai_1.expect(user.patientId).to.equal(101);
                    done();
                });
            }).catch(done);
            // check there is a user id
        });
    });
    describe("#loadUserByFbId(fbId)", function () {
        it("loads the right user", function (done) {
            db_1.default.getConnection(function (c) {
                Promise.all([
                    User_1.default.addUser(c, { fbId: "U1", name: "A", role: 'patient' }),
                    User_1.default.addUser(c, { fbId: "U2", name: "B", role: 'patient' }),
                    User_1.default.addUser(c, { fbId: "U3", name: "C", role: 'patient' }),
                    User_1.default.addUser(c, { fbId: "U4", name: "D", role: 'patient' })
                ]).then(function () {
                    return User_1.default.loadUserByFbId(c, "U3").then(function (user) {
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
    describe("#loadUsersByRole(..)", function () {
        it("should load only users with a given role", function (done) {
            return db_1.default.getConnection(function (c) {
                return User_1.default.loadUsersByRole(c, 'caregiver').
                    then(function (users) {
                    chai_1.expect(users).to.be.an("array");
                    chai_1.expect(users.length).to.equal(1);
                    chai_1.expect(users[0].fbId).to.equal('S1');
                    chai_1.expect(users[0].role).to.equal('caregiver');
                    done();
                });
            }).catch(done);
        });
    });
    describe("#loadAllMasked", function () {
        it("should return sorted by name", function () {
            return db_1.default.getConnection(function (c) {
                return User_1.default.loadAllMasked(c, null).
                    then(function (users) {
                    chai_1.expect(users).to.be.an('array');
                    chai_1.expect(users.length).to.equal(3);
                    chai_1.expect(users[0].name).to.equal('Supervisor A');
                    chai_1.expect(users[1].name).to.equal('User A');
                    chai_1.expect(users[2].name).to.equal('User B');
                });
            });
        });
        it("should just return properties specified in the mask", function () {
            return db_1.default.getConnection(function (c) {
                return User_1.default.loadAllMasked(c, "name,email").
                    then(function (users) {
                    chai_1.expect(users).to.be.an('array');
                    chai_1.expect(users.length).to.equal(3);
                    var u = users[0];
                    chai_1.expect(u.userId).to.be.undefined;
                    chai_1.expect(u.tagId).to.be.undefined;
                    chai_1.expect(u.name).to.equal('Supervisor A');
                    chai_1.expect(u.email).to.be.null;
                    chai_1.expect(u.fbId).to.be.undefined;
                    chai_1.expect(u.fbLink).to.be.undefined;
                    chai_1.expect(u.role).to.be.undefined;
                    chai_1.expect(u.first_name).to.be.undefined;
                    chai_1.expect(u.last_name).to.be.undefined;
                    chai_1.expect(u.locale).to.be.undefined;
                    chai_1.expect(u.timezone).to.be.undefined;
                    chai_1.expect(u.patientId).to.be.undefined;
                });
            });
        });
    });
});
//# sourceMappingURL=userServiceTest.js.map
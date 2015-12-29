/// <reference path="../typings/tsd.d.ts" />
"use strict";
let chai = require("chai");
var Dial_1 = require("../routes/dial/Dial");
var chai_1 = require("chai");
var db_1 = require("../routes/dao/db");
db_1.default.init("test/databaseSettings.json");
var TestUtil_1 = require("./TestUtil");
var Dial_2 = require("../routes/dial/Dial");
const TEST_USER_ID = 2;
const OTHER_USER_ID = 3;
let clear = () => {
    console.log("Called clear");
    return db_1.default.getConnection((c) => {
        return TestUtil_1.default.resetDatabase(c).then(() => {
            console.log("Adding user");
            return db_1.default.query(c, "insert into user (userId, fbId) values (" + TEST_USER_ID + ",2)");
        }).then(() => {
            console.log("Deleting from dial");
            return db_1.default.query(c, "delete from dial");
        }).catch((err) => {
            console.log("Failed with " + err);
        });
    });
};
describe('DialService', function () {
    beforeEach(function (done) {
        console.log("Calling before each");
        return clear().then(function () {
            done();
        });
    });
    describe('#addNumber()', function () {
        it('should save a new number', function (done) {
            db_1.default.getConnection((c) => {
                return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("TestHome", "1-755-855-9555", TEST_USER_ID)).then(() => {
                    return db_1.default.query(c, "select * from dial where label = 'TestHome'").then((rs) => {
                        chai_1.expect(rs.length).equals(1);
                        chai_1.expect(rs[0].userId).equals(TEST_USER_ID);
                        chai_1.expect(rs[0].phone).equals("1-755-855-9555");
                        chai_1.expect(rs[0].label).equals("TestHome");
                        chai_1.expect(rs[0].rank).equals(0);
                        done();
                    });
                });
            }).catch(done);
        });
    });
    describe("#loadNumbers()", function () {
        it('should load numbers for a user', function (done) {
            db_1.default.getConnection((c) => {
                return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("NumberA", "1-234-567-8910", TEST_USER_ID)).
                    then(() => {
                    return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("NumberB", "9-876-543-2198", TEST_USER_ID));
                }).then(() => {
                    return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("NumberC", "9-876-543-2198", OTHER_USER_ID));
                }).then(() => {
                    return Dial_2.default.loadNumbers(c, TEST_USER_ID);
                }).then((numbers) => {
                    chai_1.expect(numbers.length).to.equal(2);
                    chai_1.expect(numbers[0].label).to.equal("NumberA");
                    chai_1.expect(numbers[0].phone).to.equal("1-234-567-8910");
                    chai_1.expect(numbers[0].userId).to.equal(TEST_USER_ID);
                    chai_1.expect(numbers[1].label).to.equal("NumberB");
                    chai_1.expect(numbers[1].phone).to.equal("9-876-543-2198");
                    chai_1.expect(numbers[1].userId).to.equal(TEST_USER_ID);
                    done();
                });
            }).catch(done);
        });
    });
    describe("#deleteNumber()", function () {
        it('should just delete the one number', function (done) {
            let insertId = null;
            db_1.default.getConnection((c) => {
                return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("NumberA", "1-234-567-8910", TEST_USER_ID)).
                    then(() => {
                    return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("NumberB", "9-876-543-2198", TEST_USER_ID)).
                        then((rs) => {
                        chai_1.expect(rs).to.have.property('insertId');
                        insertId = rs.insertId;
                    });
                }).then(() => {
                    return Dial_2.default.addNumber(c, new Dial_1.PhoneNumber("NumberC", "9-876-543-2198", OTHER_USER_ID));
                }).then(() => {
                    return Dial_2.default.deleteNumber(c, insertId);
                }).then(() => {
                    return Dial_2.default.loadNumbers(c, TEST_USER_ID);
                }).then((numbers) => {
                    chai_1.expect(numbers.length).to.equal(1);
                    chai_1.expect(numbers[0].label).to.equal("NumberA");
                    chai_1.expect(numbers[0].phone).to.equal("1-234-567-8910");
                    chai_1.expect(numbers[0].userId).to.equal(TEST_USER_ID);
                    done();
                });
            }).catch(done);
        });
    });
});
//# sourceMappingURL=dialServiceTest.js.map
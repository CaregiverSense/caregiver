/// <reference path="../typings/tsd.d.ts" />
"use strict";
var chai = require("chai");
var Dial_1 = require("../routes/dial/Dial");
var chai_1 = require("chai");
var db_1 = require("../routes/dao/db");
db_1.default.init("test/databaseSettings.json");
var Dial_2 = require("../routes/dial/Dial");
let dial = Dial_2.default(db_1.default);
let clear = () => {
    console.log("Called clear");
    return db_1.default.getConnection((c) => {
        return db_1.default.query(c, "delete from user").then(() => {
            console.log("Adding user");
            return db_1.default.query(c, "insert into user (userId, fbId) values (2,2)");
        }).then(() => {
            console.log("Deleting from dial");
            return db_1.default.query(c, "delete from dial");
        }).catch((err) => {
            console.log("Failed with " + err);
        });
    });
};
beforeEach(function (done) {
    console.log("Calling before each");
    return clear().then(function () {
        done();
    });
});
describe('DialService', function () {
    describe('#addNumber()', function () {
        it('should save a new number', function (done) {
            let num = new Dial_1.PhoneNumber("TestHome", "1-755-855-9555", 2);
            db_1.default.getConnection((c) => {
                return dial.addNumber(c, num).then(() => {
                    return db_1.default.query(c, "select * from dial where label = 'TestHome'").then((rs) => {
                        chai_1.expect(rs.length).equals(1);
                        chai_1.expect(rs[0].userId).equals(2);
                        chai_1.expect(rs[0].phone).equals("1-755-855-9555");
                        chai_1.expect(rs[0].label).equals("TestHome");
                        exp;
                        ect(rs[0].rank).equals(0);
                        done();
                    });
                });
            }).fail(done);
        });
    });
});
//# sourceMappingURL=dialServiceTest.js.map
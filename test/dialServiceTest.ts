/// <reference path="../typings/tsd.d.ts" />
"use strict"

let chai = require("chai");

import { PhoneNumber } from "../routes/dial/Dial";
import { expect, assert } from "chai"
import db from "../routes/dao/db";
db.init("test/databaseSettings.json");

import TestUtil from "./TestUtil"
import dial from "../routes/dial/Dial";

const TEST_USER_ID = 2
const OTHER_USER_ID = 3

let clear = () => {
    console.log("Called clear");
    return db.getConnection((c) => {
        console.log("TestUtil is " + TestUtil)
        return TestUtil.resetDatabase(c).then(() => {
            console.log("Adding user")
            return db.query(c, "insert into user (userId, fbId) values (" + TEST_USER_ID + ",2)")
        })
    })
}



describe('DialService', function() {

    beforeEach(function(done) {
        console.log("Calling before each")
        return clear().then(function() {
            done();
        });
    })

    describe('#addNumber()', function() {

        it('should save a new number', function (done) {

            return db.getConnection((c) => {
                return dial.addNumber(c, new PhoneNumber("TestHome", "1-755-855-9555", TEST_USER_ID)).then(() => {

                    return db.query(c, "select * from dial where label = 'TestHome'").then(
                        (rs) => {
                            expect(rs.length).equals(1)
                            expect(rs[0].userId).equals(TEST_USER_ID)
                            expect(rs[0].phone).equals("1-755-855-9555")
                            expect(rs[0].label).equals("TestHome")
                            expect(rs[0].rank).equals(0)
                            done()
                        }
                    )
                });
            }).catch(done)
        });

    })


    describe("#loadNumbers()", function() {
        it('should load numbers for a user', function(done) {
            db.getConnection((c) => {
                return dial.addNumber(c, new PhoneNumber("NumberA", "1-234-567-8910", TEST_USER_ID)).
                    then(() => {
                        return dial.addNumber(c, new PhoneNumber("NumberB", "9-876-543-2198", TEST_USER_ID))
                    }).then(() => {
                        return dial.addNumber(c, new PhoneNumber("NumberC", "9-876-543-2198", OTHER_USER_ID))
                    }).then(() => {
                        return dial.loadNumbers(c, TEST_USER_ID)
                    }).then((numbers : PhoneNumber[]) => {
                        expect(numbers.length).to.equal(2)
                        expect(numbers[0].label).to.equal("NumberA")
                        expect(numbers[0].phone).to.equal("1-234-567-8910")
                        expect(numbers[0].userId).to.equal(TEST_USER_ID)
                        expect(numbers[1].label).to.equal("NumberB")
                        expect(numbers[1].phone).to.equal("9-876-543-2198")
                        expect(numbers[1].userId).to.equal(TEST_USER_ID)
                        done()
                    })
            }).catch(done)
        });
    });

    describe("#deleteNumber()", function() {
        it('should just delete the one number', function(done) {
            let dialId : number = null;
            db.getConnection((c) => {
                return dial.addNumber(c, new PhoneNumber("NumberA", "1-234-567-8910", TEST_USER_ID)).
                then(() => {
                    return dial.addNumber(c, new PhoneNumber("NumberB", "9-876-543-2198", TEST_USER_ID)).
                        then((rs) => {
                            dialId = rs
                            expect(dialId).to.be.a('number')
                        })
                }).then(() => {
                    return dial.addNumber(c, new PhoneNumber("NumberC", "9-876-543-2198", OTHER_USER_ID))
                }).then(() => {
                    return dial.deleteNumber(c, dialId)
                }).then(() => {
                    return dial.loadNumbers(c, TEST_USER_ID)
                }).then((numbers : PhoneNumber[]) => {
                    expect(numbers.length).to.equal(1)
                    expect(numbers[0].label).to.equal("NumberA")
                    expect(numbers[0].phone).to.equal("1-234-567-8910")
                    expect(numbers[0].userId).to.equal(TEST_USER_ID)
                    done()
                })
            }).catch(done)
        });
    });


});
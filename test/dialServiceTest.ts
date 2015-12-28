/// <reference path="../typings/tsd.d.ts" />
"use strict"

var chai = require("chai");

import { PhoneNumber } from "../routes/dial/Dial";
import { expect } from "chai"
import db from "../routes/dao/db";
db.init("test/databaseSettings.json");

import createDial from "../routes/dial/Dial";
let dial = createDial(db);

let clear = () => {
    console.log("Called clear");
    return db.getConnection((c) => {
        return db.query(c, "delete from user").then(() => {
            console.log("Adding user")
            return db.query(c, "insert into user (userId, fbId) values (2,2)")
        }).then(() => {
            console.log("Deleting from dial")
            return db.query(c, "delete from dial")
        }).catch((err) => {
            console.log("Failed with " + err);
        })
    })
}


beforeEach(function(done) {
    console.log("Calling before each")
    return clear().then(function() {
        done();
    });
})

describe('DialService', function() {
    describe('#addNumber()', function() {

        it('should save a new number', function(done) {

            let num:PhoneNumber = new PhoneNumber(
                "TestHome",
                "1-755-855-9555",
                2
            )

            db.getConnection((c) => {
                return dial.addNumber(c, num).then(() => {

                    return db.query(c, "select * from dial where label = 'TestHome'").then(
                        (rs) => {
                            expect(rs.length).equals(1)
                            expect(rs[0].userId).equals(2)
                            expect(rs[0].phone).equals("1-755-855-9555")
                            expect(rs[0].label).equals("TestHome")
                            exp
                            ect(rs[0].rank).equals(0)
                            done()
                        }
                    )
                });
            }).fail(done)
        });
    });
});
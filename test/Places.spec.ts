/// <reference path="../typings/tsd.d.ts" />
"use strict"

import db from "../routes/dao/db"
import { UserPlace } from "../routes/places/Places"
import { expect } from "chai"

let chai = require("chai")
chai.use(require("chai-as-promised"))
chai.should()


describe("UserPlace", function() {

    it("equals() is true if label, userId and placeId are equal", function() {
        let a1 = new UserPlace(1, 2, "A", 111);
        let a2 = new UserPlace(1, 2, "A", 222);
        expect(a1.equals(a2)).to.be.true;
    })

    it("equals() is false if labels mismatch", function() {
        let a1 = new UserPlace(1, 2, "A", 111);
        let a2 = new UserPlace(1, 2, "B", 111);
        expect(a1.equals(a2)).to.be.false;
    })

    it("equals() is false if userIds mismatch", function() {
        let a1 = new UserPlace(1, 33, "A", 111);
        let a2 = new UserPlace(2, 33, "A", 111);
        expect(a1.equals(a2)).to.be.false;
    })

    it("equals() is false if placeIds mismatch", function() {
        let a1 = new UserPlace(1, 11, "A", 111);
        let a2 = new UserPlace(1, 88, "A", 111);
        expect(a1.equals(a2)).to.be.false;
    })
})
/// <reference path="../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../routes/dao/db");
var Places_1 = require("../routes/places/Places");
var chai_1 = require("chai");
db_1.default.init("test/databaseSettings.json");
var chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();
describe("UserPlace", function () {
    it("equals() is true if label, userId and placeId are equal", function () {
        var a1 = new Places_1.UserPlace(1, 2, "A", 111);
        var a2 = new Places_1.UserPlace(1, 2, "A", 222);
        chai_1.expect(a1.equals(a2)).to.be.true;
    });
    it("equals() is false if labels mismatch", function () {
        var a1 = new Places_1.UserPlace(1, 2, "A", 111);
        var a2 = new Places_1.UserPlace(1, 2, "B", 111);
        chai_1.expect(a1.equals(a2)).to.be.false;
    });
    it("equals() is false if userIds mismatch", function () {
        var a1 = new Places_1.UserPlace(1, 33, "A", 111);
        var a2 = new Places_1.UserPlace(2, 33, "A", 111);
        chai_1.expect(a1.equals(a2)).to.be.false;
    });
    it("equals() is false if placeIds mismatch", function () {
        var a1 = new Places_1.UserPlace(1, 11, "A", 111);
        var a2 = new Places_1.UserPlace(1, 88, "A", 111);
        chai_1.expect(a1.equals(a2)).to.be.false;
    });
});
//# sourceMappingURL=Places.spec.js.map
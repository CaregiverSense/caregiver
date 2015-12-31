/// <reference path="../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../routes/dao/db");
var TestUtil = (function () {
    function TestUtil() {
    }
    TestUtil.resetDatabase = function (c) {
        return Promise.resolve().
            then(function () { return db_1.default.query(c, "delete from notes"); }).
            then(function () { return db_1.default.query(c, "delete from dial"); }).
            then(function () { return db_1.default.query(c, "delete from user_patient"); }).
            then(function () { return db_1.default.query(c, "delete from user"); });
    };
    return TestUtil;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestUtil;
//# sourceMappingURL=TestUtil.js.map
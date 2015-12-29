/// <reference path="../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../routes/dao/db");
var TestUtil = (function () {
    function TestUtil() {
    }
    TestUtil.resetDatabase = function (c) {
        return db_1["default"].query(c, "delete from user");
    };
    return TestUtil;
})();
exports.__esModule = true;
exports["default"] = TestUtil;
//# sourceMappingURL=TestUtil.js.map
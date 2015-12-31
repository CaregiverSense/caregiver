/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../dao/db");
var log_1 = require("../util/log");
var Tag = (function () {
    function Tag(row) {
        this.id = row.id;
        this.tagId = row.tagId;
        this.redirectURL = row.redirectURL;
        this.type = row.type;
    }
    return Tag;
})();
exports.Tag = Tag;
var TagService = (function () {
    function TagService() {
    }
    TagService.loadTag = function (c, tagId) {
        return db_1.default.query(c, "select * from tag where tagId = ?", [tagId]).
            then(function (rs) {
            log_1.default("Loaded tag: " + log_1.default(rs));
            if (rs.length == 0) {
                throw "Tag not found " + tagId;
            }
            return new Tag(rs[0]);
        });
    };
    return TagService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TagService;
//# sourceMappingURL=tag.js.map
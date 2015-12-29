/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../../routes/dao/db");
/*
 create table dial (
 dialId 		integer not null primary key auto_increment,	-- primary key
 userId 		integer not null references user(userId),		-- the user who the number is for
 phone		varchar(30) not null,							-- the phone number (without the tel:// prefix)
 label		varchar(80) not null,							-- the label to use for the phone number
 rank		integer not null default 0						-- used to sort and reorder the numbers for a user
 );

 */
var Service = (function () {
    function Service() {
    }
    Service.addNumber = function (c, number) {
        console.log("Dial.Service.addNumber( c, number = ", number, ")");
        return db_1["default"].query(c, "insert into dial (userId, phone, label) " +
            "values (?, ?, ?)", [number.userId, number.phone, number.label]).then(function (rs) {
            return rs;
        });
    };
    Service.loadNumbers = function (c, userId) {
        console.log("Dial.Service.loadNumbers( c, userId = ", userId, ")");
        return db_1["default"].query(c, "select * from dial where userId = ? order by rank, dialId", [userId]).then(function (rs) {
            var result = rs.map(function (row) {
                return new PhoneNumber(row.label, row.phone, row.userId, row.dialId);
            });
            return result;
        });
    };
    Service.deleteNumber = function (c, dialId) {
        console.log("Dial.Service.deleteNumber( c, dialId = ", dialId, ")");
        return db_1["default"].query(c, "delete from dial where dialId = ?", [dialId]);
    };
    return Service;
})();
exports.__esModule = true;
exports["default"] = Service;
var PhoneNumber = (function () {
    function PhoneNumber(label, phone, userId, dialId) {
        this.label = label;
        this.phone = phone;
        this.userId = userId;
        this.dialId = dialId;
    }
    return PhoneNumber;
})();
exports.PhoneNumber = PhoneNumber;
//# sourceMappingURL=Dial.js.map
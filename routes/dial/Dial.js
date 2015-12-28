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
    Service.prototype.addNumber = function (c, number) {
        console.log("Adding number");
        return db_1["default"].query(c, "insert into dial (userId, phone, label) " +
            "values (?, ?, ?)", [number.userId, number.phone, number.label]);
    };
    return Service;
})();
exports.Service = Service;
var PhoneNumber = (function () {
    function PhoneNumber(label, phone, userId) {
        this.label = label;
        this.phone = phone;
        this.userId = userId;
    }
    return PhoneNumber;
})();
exports.PhoneNumber = PhoneNumber;
exports.__esModule = true;
exports["default"] = function (db) {
    Service.db = db;
    return new Service();
};
//# sourceMappingURL=Dial.js.map
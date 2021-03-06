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
    /**
     * Inserts a phone number and decorates the given number with
     * the dialId assigned during the insert.
     *
     * @param c         The connection
     * @param number    The PhoneNumber to insert
     * @returns A promise of the dialId of the number insterted
     */
    Service.addNumber = function (c, number) {
        console.log("Dial.Service.addNumber( c, number = ", number, ")");
        return db_1.default.query(c, "insert into dial (userId, phone, label) " +
            "values (?, ?, ?)", [number.userId, number.phone, number.label]).then(function (rs) {
            number.dialId = rs.insertId;
            return number.dialId;
        });
    };
    Service.loadNumbers = function (c, userId) {
        console.log("Dial.Service.loadNumbers( c, userId = ", userId, ")");
        return db_1.default.query(c, "select * from dial where userId = ? order by rank, dialId", [userId]).then(function (rs) {
            var result = rs.map(function (row) {
                return new PhoneNumber(row.label, row.phone, row.userId, row.rank, row.dialId);
            });
            return result;
        });
    };
    Service.deleteNumber = function (c, dialId) {
        console.log("Dial.Service.deleteNumber( c, dialId = ", dialId, ")");
        return db_1.default.query(c, "delete from dial where dialId = ?", [dialId]);
    };
    Service.loadNumber = function (c, dialId) {
        return db_1.default.queryOne(c, "select * from dial where dialId = ?", [dialId]).
            then(function (row) { return new PhoneNumber(row.label, row.phone, row.userId, row.rank, row.dialId); });
    };
    return Service;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Service;
// Represents a row of the 'dial' table.
var PhoneNumber = (function () {
    function PhoneNumber(label, // A label to display, instead of the phone number
        phone, // The phone number
        userId, // The userId of the user to whom this quick dial is assigned
        rank, // Used to rank/order quick dial relative to the other quick dials assigned
        dialId // Primary key, uniquely identifies the record.
        ) {
        this.label = label;
        this.phone = phone;
        this.userId = userId;
        this.rank = rank;
        this.dialId = dialId;
    }
    return PhoneNumber;
})();
exports.PhoneNumber = PhoneNumber;
//# sourceMappingURL=Dial.js.map
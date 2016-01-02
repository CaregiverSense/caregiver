/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db";

/*
 create table dial (
 dialId 		integer not null primary key auto_increment,	-- primary key
 userId 		integer not null references user(userId),		-- the user who the number is for
 phone		varchar(30) not null,							-- the phone number (without the tel:// prefix)
 label		varchar(80) not null,							-- the label to use for the phone number
 rank		integer not null default 0						-- used to sort and reorder the numbers for a user
 );

 */

export default class Service {

    static db:any;

    constructor() {
    }

    /**
     * Inserts a phone number and decorates the given number with
     * the dialId assigned during the insert.
     *
     * @param c         The connection
     * @param number    The PhoneNumber to insert
     * @returns A promise of the dialId of the number insterted
     */
    static addNumber(c : any, number:  PhoneNumber) : Promise<number> {
        console.log("Dial.Service.addNumber( c, number = ", number, ")")
        return db.query(c, "insert into dial (userId, phone, label) " +
            "values (?, ?, ?)",
            [number.userId, number.phone, number.label]
        ).then((rs) => {
            number.dialId = rs.insertId
            return number.dialId
        });
    }

    static loadNumbers(c : any, userId : number) : Promise<PhoneNumber[]> {
        console.log("Dial.Service.loadNumbers( c, userId = ", userId, ")")
        return db.query(c, "select * from dial where userId = ? order by rank, dialId", [userId]
        ).then((rs) => {
            var result = rs.map((row) => {
                return new PhoneNumber(row.label, row.phone, row.userId, row.rank, row.dialId)
            })
            return result;
        })
    }

    static deleteNumber(c : any, dialId : number) : Promise<any[]> {
        console.log("Dial.Service.deleteNumber( c, dialId = ", dialId, ")")
        return db.query(c, "delete from dial where dialId = ?", [dialId]);
    }

    static loadNumber(c : any, dialId : number) : Promise<PhoneNumber> {
        return db.queryOne(c, "select * from dial where dialId = ?", [dialId]).
            then(row => new PhoneNumber(row.label, row.phone, row.userId, row.rank, row.dialId))
    }

}

// Represents a row of the 'dial' table.
export class PhoneNumber {
    constructor(
        public label    : string,       // A label to display, instead of the phone number
        public phone    : string,       // The phone number
        public userId   : number,       // The userId of the user to whom this quick dial is assigned
        public rank    ?: number,       // Used to rank/order quick dial relative to the other quick dials assigned
        public dialId  ?: number        // Primary key, uniquely identifies the record.
                                        // It should not be specified for new entries, since this value is auto-generated.
    ) {
    }
}


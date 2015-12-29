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

    static addNumber(c : any, number:  PhoneNumber) : Promise<any> {
        console.log("Dial.Service.addNumber( c, number = ", number, ")")
        return db.query(c, "insert into dial (userId, phone, label) " +
            "values (?, ?, ?)",
            [number.userId, number.phone, number.label]
        ).then((rs) => {
            return rs
        });
    }

    static loadNumbers(c : any, userId : number) : Promise<PhoneNumber[]> {
        console.log("Dial.Service.loadNumbers( c, userId = ", userId, ")")
        return db.query(c, "select * from dial where userId = ? order by rank, dialId", [userId]
        ).then((rs) => {
            var result = rs.map((row) => {
                return new PhoneNumber(row.label, row.phone, row.userId, row.dialId)
            })
            return result;
        })
    }

    static deleteNumber(c : any, dialId : number) : Promise<any[]> {
        console.log("Dial.Service.deleteNumber( c, dialId = ", dialId, ")")
        return db.query(c, "delete from dial where dialId = ?", [dialId]);
    }

}


export class PhoneNumber {
    constructor(
        public label : string,
        public phone : string,
        public userId : number,
        public dialId? : number
    ) {
    }
}

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

export class Service {

    static db:any;

    constructor() {
    }

    addNumber(c : any, number:  PhoneNumber) : Promise<void> {
        console.log("Adding number")
        return db.query(c, "insert into dial (userId, phone, label) " +
            "values (?, ?, ?)",
            [number.userId, number.phone, number.label]
        );
    }
}


export class PhoneNumber {
    constructor(public label:string, public phone:string, public userId:number) {
    }
}

export default (db) => {
    Service.db = db;
    return new Service();
}
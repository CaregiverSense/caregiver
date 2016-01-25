/// <reference path="../typings/tsd.d.ts" />
"use strict"

import db from "../routes/dao/db";


export default class TestUtil {

    static resetDatabase(c) : Promise<any> {

        return Promise.resolve().
            then(() => db.query(c, "delete from notes")).
            then(() => db.query(c, "delete from dial")).
            then(() => db.query(c, "delete from user_patient")).
            then(() => db.query(c, "delete from user_place")).
            then(() => db.query(c, "delete from user")).
            then(() => db.query(c, "delete from place"))
    }
}
/// <reference path="../typings/tsd.d.ts" />
"use strict"

import db from "../routes/dao/db";


export default class TestUtil {

    static resetDatabase(c) : Promise<any> {

        return db.query(c, "delete from user")
    }
}
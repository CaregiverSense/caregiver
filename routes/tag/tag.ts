/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../dao/db"
import l from "../util/log"

export class Tag {
    id          : number
    tagId       : string
    redirectURL : string
    type        : string

    constructor(row : any) {
        this.id = row.id
        this.tagId = row.tagId
        this.redirectURL = row.redirectURL
        this.type = row.type
    }
}

export default class TagService {

    static loadTag(c, tagId : string) : Promise<Tag> {
        return db.query(c, "select * from tag where tagId = ?", [tagId]).
            then((rs) => {
                l("Loaded tag: " + l(rs))
                if (rs.length == 0) {
                    throw "Tag not found " + tagId
                }
                return new Tag(rs[0])
            })
    }

}
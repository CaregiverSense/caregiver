/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db";

export interface IUser {
    userId     ?: number
    tagId      ?: string
    name       ?: string
    email      ?: string
    fbId        : string
    fbLink     ?: string
    role       ?: string
    first_name ?: string
    last_name  ?: string
    locale     ?: string
    timezone   ?: string
}

export default class User implements IUser {

    userId      : number
    tagId       : string
    name        : string
    email       : string
    fbId        : string
    fbLink      : string
    role        : string
    first_name  : string
    last_name   : string
    locale      : string
    timezone    : string

    constructor(row : IUser) {
        this.userId = row.userId
        this.tagId = row.tagId
        this.name = row.name
        this.email = row.email
        this.fbId = row.fbId
        this.fbLink = row.fbLink
        this.role = row.role
        this.first_name = row.first_name
        this.last_name = row.last_name
        this.locale = row.locale
        this.timezone = row.timezone
    }


    hasAccessTo(c, userId : number) : Promise<boolean> {
        return new Promise((yes, no) => {

            if (this.userId == userId) {
                yes(true)
            } else {
                return db.query(c, "")
            }

        })
    }

    /**
     * Make this user a supervisor of the given one.
     *
     * @param c         The connection
     * @param userId    The user to be supervised by this user
     * @returns {Promise<TResult>|Promise<U>} to allow chaining
     */
    makeSupervisorOf(c, userId : number) : Promise<any> {
        return this.isSupervisorOf(c, userId).
            then((isSupervisor) => {
                if (!isSupervisor) {
                    return db.query(c, "insert into user_patient (userId, patientId) values (?,?)",
                    [this.userId, userId])
                }
            }).then(() => {})
    }

    /**
     * True if and only if this user is a supervisor of the given user
     *
     * @param c         The connection
     * @param userId    The id of the given user
     * @returns {Promise<TResult>|Promise<U>} to allow chaining
     */
    isSupervisorOf(c, userId : number) : Promise<boolean> {
        return db.query(c, "select * from user_patient where userId = ? and patientId = ?",
            [this.userId, userId]
        ).then((results) => {
            console.log('user patients for userId: ', results.length)
            return (results.length == 1);
        })
    }

}

export class UserService {

    /**
     * Adds the given user and decorates it with the generated userId
     *
     * @param c     The connection
     * @param user  The user to add
     * @returns {Promise<T>|Promise} to allow chaining
     */
    static addUser(c : any, user : IUser) : Promise<void> {
        console.log("UserService.addUser: Adding ", JSON.stringify(user))
        return db.query(c,
            "insert into user (" +
                "tagId," +
                "name," +
                "email," +
                "fbId," +
                "fbLink," +
                "role," +
                "first_name," +
                "last_name," +
                "locale," +
                "timezone" +
            ") values (?,?,?,?,?,?,?,?,?,?)",
            [
                user.tagId,
                user.name,
                user.email,
                user.fbId,
                user.fbLink,
                user.role,
                user.first_name,
                user.last_name,
                user.locale,
                user.timezone
            ]).
        then((results) => {
            user.userId = results.insertId
            console.log("Added user ", user.name, " with id ", user.userId)
        })
    }

    static loadUserByFbId(c : any, fbId : string) : Promise<User> {
        console.log("UserService.loadUserByFbId: Loading user with fbId " + fbId);

        return db.queryOne(c, "select * from user where fbId = ?", [fbId]).
            then((row) => {
                console.log("Have row");
                console.dir(row)
                return new User(row)
            });
    }

}
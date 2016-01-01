/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db"
let jsonMask = require("json-mask")

export interface IUser {
    userId     ?: number
    tagId      ?: string
    name       ?: string
    email      ?: string
    fbId        : string
    fbLink     ?: string
    role        : string
    first_name ?: string
    last_name  ?: string
    locale     ?: string
    timezone   ?: string
    patientId  ?: number
}

export class User implements IUser {

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
    patientId   : number

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
        this.patientId = row.patientId
    }


    hasAccessTo(c, userId : number) : Promise<boolean> {
        if (this.userId == userId || this.role == 'admin') {
            return new Promise((y)=>y(true))
        } else {
            return this.isSupervisorOf(c, userId)
        }
    }

    /**
     * Returns a promise that resolves iff the user is an admin.
     * @param userId
     */
    ifAdmin() : Promise<boolean> {
        return new Promise((y,n) => (this.role == 'admin' ? y() : n()))
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
    isSupervisorOf(c : any, userId : number) : Promise<boolean> {
        return db.query(c, "select * from user_patient where userId = ? and patientId = ?",
            [this.userId, userId]
        ).then((results) => {
            console.log('user patients for userId: ', results.length)
            return (results.length == 1);
        })
    }

    /**
     * Unassign a patient from the given user
     *
     * @param c         The connection
     * @param userId    The userId of the patient to unassign from this user
     * @returns {Promise<any>}
     */
    unassignPatient(c : any, userId : number) : Promise<any> {
        return db.query(c, "delete from user_patient where userId = ? and patientId = ?", [this.userId, userId])
    }


}


export default class UserService {

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
                "timezone," +
                "patientId" +
            ") values (?,?,?,?,?,?,?,?,?,?,?)",
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
                user.timezone,
                user.patientId
            ]).
        then((results) => {
            user.userId = results.insertId
            console.log("Added user with name ", user.name, " with id ", user.userId)
        })
    }

    static loadUserByFbId(c : any, fbId : string) : Promise<User> {
        console.log("UserService.loadUserByFbId: Loading user with fbId " + fbId);

        return db.queryOne(c, "select * from user where fbId = ?", [fbId]).
            then((row) => {
                return new User(row)
            });
    }

    static loadUserByUserId(c : any, userId : number) : Promise<User> {
        console.log("UserService.loadUserByUserId: Loading user with userId " + userId);

        return db.queryOne(c, "select * from user where userId = ?", [userId]).
            then((row) => {
                return new User(row)
            });
    }

    // TODO Add communityId
    static loadUsersByRole(c : any, role : string) : Promise<User[]> {
        return (db.
            query(c, "select * from user where role = ? order by name", [role]).
            then((results) => {
                console.log("Loaded users for role " + role)
                console.dir(results)
                return results.map((row) => new User(row))
            }) as Promise<User[]>)
    }

    static loadCaregiversForPatient(c : any, patientId : number) : Promise<User[]> {
        return (db.
            query(c,
                "select u.* from user u, user_patient up where " +
                "u.userId = up.userId and up.patientId = ?",
                [patientId]).
            then((results) => {
                return results.map((row) => new User(row))
            }) as Promise<User[]>)
    }

    static loadPatientsForCaregiver(c : any, caregiverId : number) : Promise<User[]> {
        return (db.
            query(c,
                "select u.* from user u, user_patient up where u.userId = up.patientId and up.userId = ?",
                [caregiverId]).
            then((results) => {
                return results.map((row) => new User(row))
            }) as Promise<User[]>)
    }

    /**
     * Loads all non-admin users, ordered by name.
     * A json-mask can be specified to return only specific properties.
     *
     * TODO Add support for a community id.
     *
     * @param c
     * @param projection
     */

    static loadAllMasked(c : any, mask ?: Object) : Promise<User[]> {
        return (db.
        query(c,
            "select * from user where role <> 'admin' order by name", []).
        then((results) => {
            console.dir(results)
            return mask ? results.map((row) => jsonMask(new User(row), mask)) : results
        }) as Promise<User[]>)
    }


}
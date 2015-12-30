/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../dao/db"
import IUser from "../user/User";
import UserService from "../user/User"

export default class RegisterService {

    /**
     * A promise of the registration corresponding to the given registrationId
     */
    static loadRegistration(c, registrationId : string) : Promise<any> {
        return db.queryOne(c, "select * from registration where registrationId = ?", [registrationId]);
    }

    // Adds a registration entry for the new user and returns the registration link.
    static addRegistration(c, name : string, email : string, phoneNumber : string) : Promise<string> {
        return db.query(c, "select md5(uuid()) as id", []).
            then((rs) => {

                let registrationId = rs[0].id
                let registrationLink = "http://52.88.50.116:7000/register?id=" + registrationId

            return c.query(
                "insert into registration (registrationId, registrationDate, name, " +
                "email, phoneNumber, registrationLink) values (?,?,?,?,?,?)",
                [registrationId, new Date(), name, email, phoneNumber, registrationLink]).
                then(() => registrationLink)
        })
    }

    /*
     Example auth object:
     {
     "id":"10153162607041397",       // The facebook id
     "first_name":"Dave",
     "gender":"male",
     "last_name":"MacDonald",
     "link":"https://www.facebook.com/app_scoped_user_id/10153162607041397/",
     "locale":"en_GB",
     "name":"Dave MacDonald",
     "timezone":-5,
     "updated_time":"2015-11-17T17:23:11+0000",
     "verified":true
     }

     */
    static registerUser(c, auth, registrationId : string, role : string) {

        // Load the registration
        return db.queryOne(c,
            "select * from registration where registrationId = ?",
            [registrationId]

        ).then((registration) => {
            // Insert the user

            return UserService.addUser(c, {
                tagId      : '',
                name       : auth.name,
                email      : registration.email,
                fbId       : auth.id,
                fbLink     : auth.link,
                role       : role,
                first_name : auth.first_name,
                last_name  : auth.last_name,
                locale     : auth.locale,
                timezone   : auth.timezone,
                patientId  : null
            })

        }).then(() => {
            // Mark the registration as complete

            return db.query(c,
                "update registration set hasRegistered = 'Y', registrationDate = ? where registrationId = ?",
                [new Date(), registrationId]
            )
        })
    }


}
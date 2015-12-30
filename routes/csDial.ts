/// <reference path="../typings/tsd.d.ts" />
"use strict"

import { User } from "./user/User"
import DialService from "./dial/Dial"
import UserService from "./user/User"
import { PhoneNumber } from "./dial/Dial"
import express = require('express')
let router = express.Router()

import db from "./dao/db"
import l from "./util/log"


// done create the dial table and add it to the schema.
// todo create a /dial/addNumber api
// todo update the UI to call the above
// todo create a /dial/loadNumber api
// todo update the admin page to allow adding/removing numbers
// todo support deleting a number



/**
 * API section
 */

router.use(require("./middleware/setIsAPIFlag"))
router.use(require("./middleware/checkIsLoggedIn"))


function onFail(res) {
    return function(err) {
        l("Error: " + l(err))
        res.send({error: true})
    }
}


/**
 *  Adds a phone number for the given user.
 *
 *  { label, phone, userId }
 *
 */
router.post("/add", function(req, res) {
    l("/dial/add")
    let c = req["c"]
    let o = req.body
    let phoneNum = new PhoneNumber(o.label, o.phone, o.userId)
    let user : User = req.session["user"]

    user.hasAccessTo(c, o.userId).

        then(() => DialService.addNumber(c, phoneNum) ).
        then(() => res.send( {dialId : phoneNum.dialId} ) ).

        catch(onFail(res))
})


/**
 * Delete a phone number
 *
 *  {
 *      dialId     // The id of the phone number to delete
 *      userId
 *  }
 */
router.post("/delete", function(req, res) {
    l("/dial/delete")
    let c = req["c"]
    let o = req.body
    let user : User = req.session["user"]

    DialService.loadNumber(c, o.dialId).

        then((num) => user.hasAccessTo(c, num.userId)).
        then(() => DialService.deleteNumber(c, o.dialId) ).
        then(() => res.send( {ok:true} ) ).

        catch(onFail(res))
})

/**
 * Loads phone numbers for a user
 *
 * {
 *      userId      // Loads numbers for this user
 * }
 */
router.post("/load", function(req, res) {
    l("/dial/load")
    let c = req["c"]
    let o = req.body
    let user : User = req.session['user']

    user.hasAccessTo(c, o.userId).
        then(() => DialService.loadNumbers(c, o.userId)).
        then(users => res.send(users)).
        catch(onFail(res))
})


export default router
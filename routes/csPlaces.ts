/// <reference path="../typings/tsd.d.ts" />
"use strict"

import { User } from "./user/User"
import PlacesService, {Place, UserPlace} from "./places/Places"
import express = require('express')
let router = express.Router()

import db from "./dao/db"
import l from "./util/log"
import { error, sendResults } from "./util/util"


/**
 * API section
 */

router.use(require("./middleware/setIsAPIFlag"))
router.use(require("./middleware/checkIsLoggedIn"))


/**
 *  Adds a place
 *
 *  request { placeName, address }
 *  response { placeId }
 */
router.post("/add", function(req, res) {
    l("/places/add " + l(req.body))
    let c = req["c"]
    let o = req.body

    let place = new Place(o.placeName, o.address)

    PlacesService.addPlace(c, place).
        then(sendResults(res)).
        catch(error(res))
})

/**
 * Assigns a place to a user
 *
 * { patientId, placeId, label }
 */
router.post("/assign", function(req, res) {
    l("/places/assign " + l(req.body))
    let c = req["c"]
    let o = req.body
    let user : User = req.session["user"]

    let assignment = new UserPlace(o.patientId, o.placeId, o.label)

    new User(user).
        hasAccessTo(c, o.patientId).
        then(() => PlacesService.assignPlace(c, assignment)).
        then(sendResults(res)).
        then(error(res))
})

/**
 * Unassigns a place from a user
 *
 * { patientId, upId }
 */
router.post("/unassign", function(req, res) {
    l("/places/unassign")
    let c = req["c"]
    let o = req.body
    let user : User = req.session["user"]

    new User(user).
        hasAccessTo(c, o.patientId).
        then(() => PlacesService.unassignPlace(c, o.upId, o.patientId)).
        then(() => {ok:true}).
        then(sendResults(res)).
        catch(error(res))
})

/**
 * Loads user_places for a user, ordered by (rank, upId)
 *
 * request {
 *      userId      // Loads numbers for this user
 * }
 *
 * response [{      // See class UserPlace for a description of these properties
        userId	    :number,        // the user to whom the place is assigsned
        placeId	    :number,        // the placeId
        label	    :string,        // the label to represent the address

        rank	   ?:number,        // used to sort and re-order
        upId	   ?:number, 	    // primary key
        place      ?:Place         // Not persisted, but may be decorated by API during load.
   }]
 */
router.post("/load", function(req, res) {
    l("/places/load")
    let c = req["c"]
    let o = req.body
    let user : User = req.session['user']

    new User(user).hasAccessTo(c, o.userId).
        then(() => PlacesService.loadUserPlaces(c, o.userId)).
        then(sendResults(res)).
        catch(error(res))
})


export default router
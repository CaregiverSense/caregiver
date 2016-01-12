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
 * Finds a place given its latitude and longitude.
 *
 * request { lat, lng }
 * response { found : boolean, placeName }
 */
router.post("/find", function(req, res) {
    l("/places/find " + l(req.body))
    let c = req["c"]
    let o = req.body

    PlacesService.findPlace(c, o.lat, o.lng).
        then(place => {
            return (place == null) ?
                { found : false } :
                { found : true, placeName : place.placeName }
        }).
        then(sendResults(res)).
        catch(error(res))
})

/**
 *  Inserts or updates a place
 *
 *  request { placeName, address, lat, lng }
 *  response { placeId }
 */
router.post("/save", function(req, res) {
    l("/places/save " + l(req.body))
    let c = req["c"]
    let o = req.body

    let place = new Place(o.placeName, o.address, o.lat, o.lng)

    PlacesService.savePlace(c, place).
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
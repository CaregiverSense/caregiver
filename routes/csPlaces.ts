/**
 * csPlaces.ts: REST endpoints for map places and place assignments.
 */
/// <reference path="../typings/tsd.d.ts" />
"use strict"
import {User} from "./user/User"
import {Place, UserPlace} from "./places/Places"
import svc from "./places/PlacesEndpointSvc"
import endpointBuilder from "./util/util"
let router = require('express').Router()
let endpoint = new endpointBuilder(router).endpoint;

/**
 * Add some middleware
 */
router.use(require("./middleware/setIsAPIFlag"))
router.use(require("./middleware/checkIsLoggedIn"))




/**
 * Finds a place given its latitude and longitude.
 *
 * request { lat, lng }
 * response { found : boolean, placeName }
 */
endpoint("/find", (c, o) =>
    svc.find(c, o.lat, o.lng)
)



/**
 *  Inserts or updates a place
 *
 *  request { placeName, address, lat, lng }
 *  response { placeId }
 */
endpoint("/save", (c, o) =>
    svc.save(c, new Place(o.label, o.address, o.lat, o.lng))
)



/**
 *  Inserts or updates a place, and assigns it to a user
 *
 *  request { label, address, lat, lng, userId }
 *  response { placeId }
 */
endpoint("/saveAndAssign", (c, o, user) => {
    let place = new Place(o.label, o.address, o.lat, o.lng)
    return svc.saveAndAssign(c, place, user, o.userId, o.label || o.placeName)
})



/**
 * Unassigns a place from a user
 *
 * request { userId, placeId }
 */
endpoint("/unassign", (c, o, user) =>
    svc.unassign(c, user, o.userId, o.placeId)
)



/**
 * Loads user_places for a user, ordered by (rank, upId)
 *
 * request {
 *      userId      // Loads numbers for this user
 * }
 *
 * response [{
        userId	    :number,   // the user to whom the place is assigned
        placeId	    :number,   // the placeId
        label	    :string,   // the label to represent the address

        rank       ?:number,   // used to sort and re-order
        upId       ?:number,   // primary key of the assignment
        place      ?:Place     // The place itself
   }]
 */
endpoint("/load", (c, o, user) =>
    svc.loadUserPlaces(c, user, o.userId)
)



export default router

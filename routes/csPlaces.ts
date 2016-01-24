/// <reference path="../typings/tsd.d.ts" />
"use strict"

import {User} from "./user/User"
import {Place, UserPlace} from "./places/Places"
import svc from "./places/PlacesEndpointSvc"
import endpointBuilder from "./util/util"
let router = require('express').Router()
let endpoint = new endpointBuilder(router).endpoint;
export default router



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
    svc.save(c, new Place(o.placeName, o.address, o.lat, o.lng))
)



/**
 *  Inserts or updates a place, and assigns it to a user
 *
 *  request { placeName, address, lat, lng, patientId }
 *  response { placeId }
 */
endpoint("/saveAndAssign", (c, o, user) =>
    svc.saveAndAssign(c,
            new Place(o.placeName, o.address, o.lat, o.lng),
            user,
            o.placeLabel || o.placeName)
)



/**
 * Unassigns a place from a user
 *
 * { patientId, upId }
 */
endpoint("/unassign", (c, o, user) =>
    svc.unassign(c, user, o.upId)
)



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
endpoint("/load", (c, o, user) =>
    svc.loadUserPlaces(c, user)
)





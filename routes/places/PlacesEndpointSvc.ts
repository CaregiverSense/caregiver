/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import { User } from "../user/User"
import PlacesService, {Place, UserPlace} from "../places/Places"
import UserService from "../user/User";



class PlacesEndpointSvc {

    private placesSvc : PlacesService = new PlacesService();

    /**
     * Find a place by latitude and longitude, and return
     * {found: true/false} which may also contain a placeName if found == true
     *
     * @param c The database connection
     * @param lat latitude
     * @param lng longitude
     */
    find(c, lat:number, lng:number) : Promise<{found: boolean, placeName ?: string}> {
        return this.placesSvc.
            findPlace(c, lat, lng).
            then(place => {
                return (place == null) ?
                { found : false, placeName : undefined } :
                { found : true, placeName : place.placeName }
            })
    }

    save(c, place : Place) {
        return this.placesSvc.savePlace(c, place);
    }

    /**
     * Save a place and assign the user to that place
     * @param c
     * @param place
     * @param user
     * @returns {Promise<number>}
     */
    saveAndAssign(c, place : Place, user : User, placeLabel : string) {
        let self = this
        let userId = user.userId
        return user.
            hasAccessTo(c, user.userId).
            then(() => self.placesSvc.savePlace(c, place)).
            then((place) => self.placesSvc.assignPlace(c, new UserPlace(userId, place.placeId, placeLabel)))
    }

    /**
     * Unassigns a place from a user

     * @param c
     * @param userId
     * @param placeId
     * @returns {ok : true}
     */
    unassign(c, user : User, userId : number, placeId : number) {
        let self = this;
        return user.hasAccessTo(c, userId).
            then(() => self.placesSvc.unassignPlace(c, userId, placeId)).
            then(() => {ok:true})
    }

    /**
     * Loads user_places for a user, ordered by (rank, upId)
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
    loadUserPlaces(c, user : User) {
        let self = this;
        return new User(user).
            hasAccessTo(c, user.userId).
            then(() => self.placesSvc.loadUserPlaces(c, user.userId))
    }

}

export default new PlacesEndpointSvc();

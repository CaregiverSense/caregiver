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
    find(c, lat:string, lng:string) : Promise<{found: boolean, placeName ?: string}> {
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
     * @param c          The database connection
     * @param place
     * @param user      The user performing the assignment.
     * @param userId    The user being assigned the place
     * @param placeLabel
     * @returns {Promise<UserPlace>}
     */
    saveAndAssign(c, place : Place, user : User, userId : number, placeLabel : string) : Promise<UserPlace> {
        let self = this
        return user.
            hasAccessTo(c, userId).
            then(() => self.placesSvc.savePlace(c, place)).
            then((place) => {
                let assignment = new UserPlace(userId, place.placeId, placeLabel)
                assignment.place = place;
                return self.placesSvc.assignPlace(c, assignment)
            })
    }

    /**
     * Unassigns a place from a user

     * @param c         The database connection
     * @param user      The user performing the assignment.
     * @param userId    The user being assigned the place
     * @param placeId   The id of the place
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
     * @param c          The database connection
     * @param actor      The user performing this action (used to check security).
     * @param userId     UserPlaces are loaded for this user.
     * @returns {Promise<UserPlace[]>}
     */
    loadUserPlaces(c, actor : User, userId : number) : Promise<UserPlace[]> {
        let self = this;
        return new User(actor).
            hasAccessTo(c, userId).
            then(() => self.placesSvc.loadUserPlaces(c, userId))
    }

    /**
     * Updates the rank of the given user_places (identified by upId) so that
     * they are saved as ordered in the same order as they appear in the given upIds list.
     *
     * @param c         The database connection
     * @param actor     The user performing this action (used to check security).
     * @param userId    Sorting is limited to the assignments for this user only.
     * @param upIds     A list of upId, identifying the user_places in the order they should be sorted.
     */
    sort(c, actor : User, userId : number, upIds : number[]) : Promise<void> {
        let self = this
        return new User(actor).
            hasAccessTo(c, userId).
            then(() => self.placesSvc.setRank(c, userId, upIds))


    }
}

export default new PlacesEndpointSvc();

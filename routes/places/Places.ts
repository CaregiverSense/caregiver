/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db";

/**
 * A service for managing the PLACE and USER_PLACE tables.
 *
 */
export default class PlacesService {

    /**
     * Inserts a phone number and decorates the given number with
     * the dialId assigned during the insert.
     *
     * @param c         The connection
     * @param place     The Place to insert
     * @returns A promise of the placeId of the place inserted
     */
    static addPlace(c : any, place:  Place) : Promise<number> {
        console.log("PlaceService.addPlace( c, place = ", place, ")")
        return db.query(c, "insert into place (placeName, address) " +
            "values (?, ?)",
            [place.placeName, place.address]
        ).then((rs) => {
            place.placeId = rs.insertId
            return place.placeId
        });
    }

    /**
     * Assigns a place to a user, stored as a user_place record.
     *
     * Note:  The upId of the given userPlace will be ignored and
     * a new one will be written to the object upon insert and will
     * be returned as a promise.
     *
     *
     * @param c         The connection
     * @param userPlace The entry to insert.
     * @returns A promise of upId of the user_place inserted
     */
    static assignPlace(c : any, userPlace : UserPlace) : Promise<number> {
        console.log("PlaceService.addUserPlace( c, userPlace = ", userPlace, ")")
        return db.query(c, "insert into user_place " +
                "(userId, placeId, label, rank) values (?, ?, ?, ?)",
                [userPlace.userId, userPlace.placeId, userPlace.label, userPlace.rank]).
            then((rs) => {
                userPlace.upId = rs.insertId
                return userPlace.upId
            })

    }

    /**
     * Deletes a user_place identified by its upId primary key if it represents
     * an assignment to the given userId.
     *
     * @param c         The connection
     * @param upId      The id of the user_place to delete
     * @param userId    The userId who is assigned the user_place identified by the upId
     * @returns {Promise<any>}
     */
    static unassignPlace(c : any, upId : number, userId : number) : Promise<any[]> {
        console.log("PlacesService.deleteUserPlace( c, upId = ", upId, ")")
        return db.query(c, "delete from user_place where upId = ? and userId = ?", [upId, userId]);
    }

    /**
     * Loads places assigned to the given user
     *
     * @param c         A database connection
     * @param userId    The id of the user
     * @returns {Promise<TResult>|Promise<U>}
     */
    static loadUserPlaces(c : any, userId : number) : Promise<UserPlace[]> {
        console.log("PlacesService.loadUserPlaces( c, userId = ", userId, ")")
        return db.query(c, "select u.*, p.placeName, p.address " +
            "from user_place up, place p " +
            "where up.placeId = p.placeId and " +
            "up.userId = ?" +
            "order by rank, upId", [userId]
        ).then((rs) => {
            return rs.map((row) => {
                let place = new Place(row.placeId, row.placeName, row.placeAddress)
                return new UserPlace(row.userId, place.placeId, row.label, row.rank, row.upId, place)
            })
        })
    }

}

export class Place {
    constructor(
        public placeName    :string,        // the name of the place
        public address      :string,        // the address of the place
        public placeId     ?:number 	    // primary key
    ) {}
}



// Represents a row of the 'dial' table.
export class UserPlace {
    constructor(
        public userId	    :number,        // the user to whom the place is assigsned
        public placeId	    :number,        // the placeId
        public label	    :string,        // the label to represent the address

        public rank		   ?:number,        // used to sort and re-order
        public upId		   ?:number, 	    // primary key
        public place       ?:Place          // Not persisted, but may be decorated by API during load.
    ) {}
}

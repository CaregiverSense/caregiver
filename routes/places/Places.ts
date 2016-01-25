/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db"
import l from "../util/log"

/**
 * A service for managing the PLACE and USER_PLACE tables.
 *
 */
export default class PlacesService {

    /**
     * Finds a place given latitude and longitude coordinates.
     */
    findPlace(c : any, lat : string, lng : string) : Promise<Place> {
        console.log("PlaceService.findPlace( c, lat = ", lat, ", lng = ", lng, ")")

        return db.queryOne(c, "select * from place where lat = ? and lng = ?", [lat, lng]).
            then(row => {
                l("Found: " + l(row))
                return new Place(row.placeName, row.address, this.format(row.lat), this.format(row.lng), row.placeId)
            })
    }

    /**
     * Saves a place.  If the placeId is provided then
     * the existing row is updated, otherwise the place is inserted.
     *
     * @param c         The connection
     * @param place     The Place to insert
     * @returns A promise of the place inserted
     */
    savePlace(c : any, place:  Place) : Promise<Place> {
        console.log("PlaceService.savePlace( c, place = ", place, ")")

        return new Promise((y,n) => {
            if (typeof(place.placeId) !== "undefined") {
                y(db.query(c, "update place set " +
                    "placeName = ?, " +
                    "address = ?, " +
                    "lat = ?, " +
                    "lng = ? " +
                    "where placeId = ?", [
                        place.placeName,
                        place.address,
                        place.lat,
                        place.lng,
                        place.placeId
                    ]
                ).then(() => place))
            } else {
                y(db.query(c, "insert into place (placeName, address, lat, lng) " +
                    "values (?, ?, ?, ?)",
                    [place.placeName, place.address, place.lat, place.lng]
                ).then((rs) => {
                    l("Inserted place with placeId " + rs.insertId)
                    place.placeId = rs.insertId
                    return place
                }));
            }
        })
    }

    /**
     * Assigns a place to a user, stored as a user_place record.
     *
     * Note:  The upId of the given userPlace will be ignored and
     * a new one will be written to the object upon insert.
     *
     * @param c         The connection
     * @param userPlace The entry to insert.
     * @returns A promise of the saved UserPlace with the upId field populated.
     */
    assignPlace(c : any, userPlace : UserPlace) : Promise<UserPlace> {
        console.log("PlaceService.addUserPlace( c, userPlace = ", userPlace, ")")
        return db.query(c, "insert into user_place " +
                "(userId, placeId, label) values (?, ?, ?)",
                [userPlace.userId, userPlace.placeId, userPlace.label]).
            then((rs) => {
                userPlace.upId = rs.insertId
                return userPlace
            })
    }

    /**
     * Unassigns a place from a user.
     *
     * @param c         The connection
     * @param userId    The userId who is assigned the user_place identified by the upId
     * @param placeId   The id of the place to unassign from the user
     * @returns {Promise<any>}
     */
    unassignPlace(c : any, userId : number, placeId : number) : Promise<any[]> {
        console.log("PlacesService.deleteUserPlace( c, userId = ", userId, ", placeId = ", placeId, ")")
        return db.query(c, "delete from user_place where userId = ? and placeId = ?", [userId, placeId]);
    }

    /**
     * Promises to return whether or not the given userId is assigned to the
     * given placeId.
     *
     * @param c         A database connection
     * @param userId    The userId
     * @param placeId   The placeId
     */
    isAssigned(c : any, userId :number, placeId : number) : Promise<boolean> {
        console.log("PlacesService.isAssigned(c, userId = " + userId + ", " + placeId);
        return db.query(c, "select * from user_place where userId = ? and placeId = ?", [userId, placeId]).
            then(rows => rows.length > 0)
    }

    /**
     * Loads places assigned to the given user
     *
     * @param c         A database connection
     * @param userId    The id of the user
     * @returns {Promise<TResult>|Promise<U>}
     */
    loadUserPlaces(c : any, userId : number) : Promise<UserPlace[]> {
        console.log("PlacesService.loadUserPlaces( c, userId = ", userId, ")")
        return db.query(c, "select up.*, p.placeId, p.placeName, p.address, p.lat, p.lng " +
            "from user_place up, place p " +
            "where up.placeId = p.placeId and " +
            "up.userId = ? " +
            "order by rank, upId", [userId]
        ).then((rs) => {
            return rs.map((row) => {
                let place = new Place(row.placeName, row.address, row.lat, row.lng, row.placeId)
                return new UserPlace(row.userId, place.placeId, row.label, row.rank, row.upId, place)
            })
        })
    }

    private format(num : string) : string {
        return new Number(num).toFixed(9);
    }

}

export class Place {

    constructor(
        public placeName    :string,        // the name of the place
        public address      :string,        // the address of the place
        public lat          :string,        // latitude
        public lng          :string,        // longitude
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


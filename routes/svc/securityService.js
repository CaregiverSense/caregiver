/// <reference path="../../typings/tsd.d.ts" />

var db = require("../dao/db.js");
var Q = require("q");

module.exports = {

    /**
     * Returns a promise that is resolved if the given user can see the given patient,
     * and rejected otherwise
     *
     * @param user
     * @param patient
     */
    ifUserCanSeePatient : function(user, patient) {
        var q = Q.defer();

        // TODO implement!!!
        // TODO implement!!!
        // TODO implement!!!

        q.resolve();
        // q.reject();

        return q.promise;
    }

}
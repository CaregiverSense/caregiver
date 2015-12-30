"use strict"
/**
 * Middleware
 *
 * Validates that the logged in user has the caregiver role.
 *  - the user object is attached to the session
 *  - they have the 'caregiver' role.
 */
module.exports = function(req, res, next) {

    let user = req.session["user"]
    if (!user) {
        throw "checkIsCaregiver must be occur after checkIsLoggedIn"
    }
    if (user.role == 'caregiver') {
        next()
    } else {
        next("checkIsCaregiver: Not authorized.  User " + user.userId + " is not a caregiver.")
    }
}
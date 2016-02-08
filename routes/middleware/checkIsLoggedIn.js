"use strict"
/**
 * Middleware
 *
 * Validates that the logged in user has the admin role.
 *  - the user object is attached to the session
 *  - they have the 'admin' role.
 */
module.exports = function(req, res, next) {

    console.log("checkIsLoggedIn invoked for path " + req.path)
    console.log("Stored session is: ")
    console.dir(req.session)

    if (req.session["user"]) {
        next();
    } else {
        req.redirectToLogin = true;
        next("checkIsLoggedIn:  Not authorized.  User is not logged in.");
    }
}
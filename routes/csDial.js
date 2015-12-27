var router = require('express').Router();
var db = require("./dao/db.js");
var l = require("./util/log.js");
var ss = require("./svc/securityService");


// done create the dial table and add it to the schema.
// todo create a /dial/addNumber api
// todo update the UI to call the above
// todo create a /dial/loadNumber api
// todo update the admin page to allow adding/removing numbers
// todo support deleting a number



/**
 * API section
 */

router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));


function onFail(res) {
    return function(err) {
        l("Error: " + l(err));
        res.send({error: true});
    }
}


/**
 *  Adds a phone number for the given user.
 *
 *  userId :
 *
 */
router.post("/addNumber", function(req, res) {
    l("/notes/save");

    var o = req.body;
    var patientId = o.patientId;
    var userId = req.session.user.userId;

    ss.ifUserCanSeePatient(userId, patientId).
    then(() => {
        return db.query(
            req.c,
            "insert into notes (content, lastUpdated, byUserId, forUserId, patientVisible) values (?, ?, ?, ?, ?)",
            [content,
                new Date(),
                userId,
                patientId || userId,                // If the user does not have a patient, then the note is a personal one.
                (patientVisible) ? true : false
            ]
        )}).
    then(() => {
        l("inserted note " + j(o));
        res.send({"inserted": "true"})
    }).fail(onFail(res))
});


/**
 * Load notes for the current patient of the logged in user.
 */
router.post("/load", function(req, res) {       // TODO convert to get with patientId in the path.
    l("/notes/load");
    var patientId = req.body.patientId;
    var userId = req.session.user.userId;
    var loadNotesForUserId = patientId || userId;

    ss.ifUserCanSeePatient(userId, patientId).
    then(() => {
        return db.query(req.c,
            "select n.*, f.name as fromUserName from notes n, user f where n.byUserId = f.userId and n.forUserId = ? order by lastUpdated desc",
            [loadNotesForUserId]
        )}).
    then((rs) => {
        l("Loaded " + j(rs));
        var filtered = [];
        for (var i = 0; i < rs.length; i++) {
            var row = rs[i];

            var isNotPatient = userId != row.forUserId;

            if (isNotPatient || row.patientVisible) {
                filtered.push(row);
            }
        }
        res.send(filtered)
    }).fail(onFail(res))
});

module.exports = router;

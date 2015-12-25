var express = require('express');
var router = express.Router();
var db = require("./dao/db.js");
var log = require("./util/log.js");
var ss = require("./svc/securityService");

var d = console.dir;
var l = console.log;
var j = JSON.stringify;

/*
 create table notes (
     noteId		integer auto_increment primary key,
     content         varchar(1000),
     lastUpdated     datetime not null,
     byUserId	integer not null references user(userId),
     forUserId	integer not null references user(userId),
     patientVisible  varchar(10)
 )

 */

router.get("/template", function(req, res) {
    l("/notes/template");
    res.render("template/patientNotes");
});


/**
 * API section
 */

router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
// TODO Add configurable tracing of every path as middleware.


function onFail(res) {
    return function(err) {
        l("Error: " + l(err));
        res.send({error: true});
    }
}


/**
 *  content
 *  patientVisible
 *
 */
router.post("/save", function(req, res) {
    l("/notes/save");

    var o = req.body;
    var content = o.content;
    var patientId = o.patientId;
    var patientVisible = o.patientVisible;
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

var express = require('express');
var router = express.Router();
var db = require("./dao/db.js");

router.use(require("./middleware/checkIsLoggedIn"));

/*
 create table schedule (
     schedId integer auto_increment primary key,
     name varchar(1000) not null,
     descripton varchar(1000) not null,
     toUserId integer not null references user(userId),
     fromUserId integer not null references user(userId),
     time datetime not null,
     date datetime not null,
     completed varchar(1) not null default 'N',
     directions varchar(1000)
 )



 */

var l = console.log;
var d = console.dir;
var j = JSON.stringify;

/**
 * $http.get("/schedule/load", {
 *    userId,
 *    loadDate
 * }, function(data) {
 *    data has:
 *    schedId
 *    name,
 *    description,
 *    creator,
 *    directions,
 *    date,
 *    time,
 *    completed,
 *    location
 * });
 *
 */
router.post("/load", function(req, res) {

    var c = req.c;
    var s = req.session
    var scheduleOwner  = s.patientId || s.userId
    l("/schedule/load for userId " + scheduleOwner )

    if (scheduleOwner) {
        var loadDate = new Date(req.body.loadDate)

        c.query(
            "select schedId, s.name, description, u.name as creator, directions, date, time, completed " +
            " from schedule s, user u" +
            " where s.toUserId = u.userId and u.userId = ? and s.date = ? order by s.date",
            [scheduleOwner, loadDate],
            db.wrap(rs => {
                d(rs)
                res.send(rs)
            })
        )
    } else {
        log.userOrPatientNotFound("/load")
        res.send({error:true})
    }
})

/**
 * Mark an item as completed
 *
 * $http.post("/schedule/completed", {
 *      schedId : 123,
 *      completed : Y/N
 * }, function(data) {});
 */
router.post("/completed", function(req, res) {
    l("/schedule/completed");
    var c = req.c;
    var s = req.session

    var scheduleOwner = s.patientId || s.userId
    if (scheduleOwner) {
        var o = req.body;

        c.query(
            "update schedule set completed = ? where schedId = ? and toUserId = ?",
            [
                o.completed,
                o.schedId,
                scheduleOwner
            ],
            db.wrap(rs => {
                l("updated schedule " + o.schedId + " to completed = " + o.completed + " for userId " + scheduleOwner);
                res.send({updated: "true"})
            })
        )
    } else {
        log.userOrPatientNotFound("/load")
        res.send({error: true})
    }
});


/**
 * Delete a schedule record
 *
     $http.post("/schedule/delete", {
        schedId
    }).then(function(r) {
        // Remove from page
    });
 *
 */
router.post("/delete", function(req, res) {
    l("/schedule/delete" + j(req.body));

    var c = req.c;
    var s = req.session;

    var scheduleOwner = s.patientId || s.userId
    if (scheduleOwner) {
        var o = req.body;

        c.query(
            "delete from schedule where schedId = ? and toUserId = ?",
            [o.schedId, scheduleOwner],
            db.wrap(() => {
                l("Deleted schedId " + o.schedId + " for userId " + scheduleOwner)
                res.send({"deleted": "true"});
            })
        )
    } else {
        log.userOrPatientNotFound("/load")
        res.send({error: true})
    }
})

/**
 * $http.post("/schedule/save", {
 *     name,
 *     description,
 *     toUserId,
 *     fromUserId,
 *     time,
 *     date,
 *     directions
 * }, function(data) {});
 */
router.post("/save", function(req, res) {
    l("/schedule/save");

    var c = req.c;
    var o = req.body;

    var scheduleOwner = s.patientId || s.userId
    if (scheduleOwner) {
        l("Saving schedule:");
        d(o);

        c.query(
            "insert into schedule (name, description, toUserId, fromUserId, time, date, completed, directions)" +
            " values (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                o.name,
                o.description,
                scheduleOwner,
                s.userId,
                new Date(o.time),       // TODO
                new Date(o.date),       // TODO
                0,
                o.directions
            ],
            db.wrap(() => {
                res.send({inserted: "true"});
            })
        );
    }

});


module.exports = router;

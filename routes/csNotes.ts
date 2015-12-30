/// <reference path="../typings/tsd.d.ts" />
"use strict"

import express = require('express')
let router = express.Router()
import db from "./dao/db"
import l from "./util/log";
import { User } from "./user/User";


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
    var user : User = req.session['user']
    var userId = user.userId;

    user.hasAccessTo(req['c'], patientId).
    then(() => {
        return db.query(
            req['c'],
            "insert into notes (content, lastUpdated, byUserId, forUserId, patientVisible) values (?, ?, ?, ?, ?)",
            [content,
                new Date(),
                userId,
                patientId || userId,                // If the user does not have a patient, then the note is a personal one.
                (patientVisible) ? true : false
            ]
        )}).
    then(() => {
        l("inserted note " + l(o));
        res.send({"inserted": "true"})
    }).catch(onFail(res))
});


/**
 * Load notes for the current patient of the logged in user.
 */
router.post("/load", function(req, res) {       // TODO convert to get with patientId in the path.
    l("/notes/load");
    var patientId = req.body.patientId;
    var user : User = req.session['user']
    var userId = user.userId;
    var loadNotesForUserId = patientId || userId;

    user.hasAccessTo(req['c'], patientId).
    then(() => {
        return db.query(req['c'],
            "select n.*, f.name as fromUserName from notes n, user f where n.byUserId = f.userId and n.forUserId = ? order by lastUpdated desc",
            [loadNotesForUserId]
        )}).
    then((rs) => {
        l("Loaded " + l(rs));
        var filtered = [];
        for (var i = 0; i < rs.length; i++) {
            var row = rs[i];

            var isNotPatient = userId != row.forUserId;

            if (isNotPatient || row.patientVisible) {
                filtered.push(row);
            }
        }
        res.send(filtered)
    }).catch(onFail(res))
});

export default router
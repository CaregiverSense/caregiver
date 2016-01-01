/// <reference path="../typings/tsd.d.ts" />
"use strict"

import NoteService from "./notes/notes";
import express = require('express')
let router = express.Router()
import db from "./dao/db"
import l from "./util/log";
import { User } from "./user/User";
import { Note } from "./notes/notes";
import { error, sendResults } from "./util/util";
let mask = require("json-mask")

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

/**
 * API section
 */

router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
// TODO Add configurable tracing of every path as middleware.


/**
 * Adds a new note
 *
 * {
 *      content         :string,
 *      patientId       :number,
 *      patientVisible  :boolean
 * }
 *
 * Returns { noteId : number }
 *
 */
router.post("/add", function(req, res) {
    l("/notes/add");
    let o = req.body;
    let user : User = req.session['user']
    let c = req['c']

    new User(user).hasAccessTo(c, o.patientId).
    then(() =>
        NoteService.addNote(c, new Note(
            o.content,
            new Date(),
            user.userId,
            o.patientId,
            !!o.patientVisible))).
    then((note) => mask(note, 'noteId')).
    then(sendResults(res)).catch(error(res))
})


/**
 * Load notes for the current patient of the logged in user.
 */
router.post("/load", function(req, res) {       // TODO convert to get with patientId in the path.
    l("/notes/load")
    let user : User = req.session['user']
    let userId = user.userId
    let loadedForPatient = !req.body.patientId
    let loadForUserId = req.body.patientId || userId
    let c = req['c']

    new User(user).hasAccessTo(c, loadForUserId).
    then(() => NoteService.loadNotesForUser(c, loadForUserId)).
    then((notes) => {
        l("Loaded " + l(notes))
        if (loadedForPatient) {
            notes = notes.filter(note => note.patientVisible)
        }
        return notes;
    }).then(sendResults(res)).catch(error(res))
})

export default router
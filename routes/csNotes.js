/// <reference path="../typings/tsd.d.ts" />
"use strict";
var notes_1 = require("./notes/notes");
var express = require('express');
var router = express.Router();
var log_1 = require("./util/log");
var User_1 = require("./user/User");
var notes_2 = require("./notes/notes");
var util_1 = require("./util/util");
var mask = require("json-mask");
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
router.post("/add", function (req, res) {
    log_1.default("/notes/add");
    var o = req.body;
    var user = req.session['user'];
    var c = req['c'];
    new User_1.User(user).hasAccessTo(c, o.patientId).
        then(function () {
        return notes_1.default.addNote(c, new notes_2.Note(o.content, new Date(), user.userId, o.patientId, !!o.patientVisible));
    }).
        then(function (note) { return mask(note, 'noteId'); }).
        then(util_1.sendResults(res)).catch(util_1.error(res));
});
/**
 * Load notes for the current patient of the logged in user.
 */
router.post("/load", function (req, res) {
    log_1.default("/notes/load");
    var user = req.session['user'];
    var userId = user.userId;
    var loadedForPatient = !req.body.patientId;
    var loadForUserId = req.body.patientId || userId;
    var c = req['c'];
    new User_1.User(user).hasAccessTo(c, loadForUserId).
        then(function () { return notes_1.default.loadNotesForUser(c, loadForUserId); }).
        then(function (notes) {
        log_1.default("Loaded " + log_1.default(notes));
        if (loadedForPatient) {
            notes = notes.filter(function (note) { return note.patientVisible; });
        }
        return notes;
    }).then(util_1.sendResults(res)).catch(util_1.error(res));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csNotes.js.map
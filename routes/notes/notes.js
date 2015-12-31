/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../../routes/dao/db");
var NoteService = (function () {
    function NoteService() {
    }
    /**
     * Loads notes for a user.
     * Security must be checked before calling this method.
     *
     */
    NoteService.loadNotesForUser = function (c, userId) {
        return db_1.default.query(c, "select * from notes where forUserId = ?", [userId]).
            then(function (rows) {
            return rows.map(function (row) { return new Note(row.content, row.lastUpdated, row.byUserId, row.forUserId, !!row.patientVisible, row.noteId); });
        });
    };
    /**
     * Saves a note
     */
    NoteService.addNote = function (c, note) {
        return db_1.default.query(c, "insert into notes " +
            "(noteId, content, lastUpdated, byUserId, forUserId, patientVisible) values " +
            "(?,      ?,       ?,           ?,        ?,         ?             )", [
            note.noteId,
            note.content,
            note.lastUpdated,
            note.byUserId,
            note.forUserId,
            note.patientVisible ? 1 : 0
        ]);
    };
    return NoteService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NoteService;
var Note = (function () {
    function Note(content, lastUpdated, byUserId, forUserId, patientVisible, noteId) {
        this.content = content;
        this.lastUpdated = lastUpdated;
        this.byUserId = byUserId;
        this.forUserId = forUserId;
        this.patientVisible = patientVisible;
        this.noteId = noteId;
    }
    return Note;
})();
exports.Note = Note;
//# sourceMappingURL=notes.js.map
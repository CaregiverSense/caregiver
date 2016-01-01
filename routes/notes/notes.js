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
     * Decorations included: writtenBy      // The name of the user who wrote the note.
     *
     */
    NoteService.loadNotesForUser = function (c, userId) {
        return db_1.default.query(c, "select n.*, u.name from notes n, user u " +
            "where n.forUserId = ? and " +
            "n.byUserId = u.userId " +
            "order by n.lastUpdated desc", [userId]).
            then(function (rows) {
            return rows.map(function (row) { return new Note(row.content, row.lastUpdated, row.byUserId, row.forUserId, !!row.patientVisible, row.noteId, row.name); });
        });
    };
    /**
     * Loads a note by id.
     * Security must be checked before calling this method.
     *
     * Decorations included: writtenBy      // The name of the user who wrote the note.
     *
     */
    // TODO test coverage
    NoteService.loadNoteById = function (c, noteId) {
        return db_1.default.queryOne(c, "select n.*, u.name from notes n, user u " +
            "where n.noteId = ? and u.userId = n.byUserId", [noteId]).
            then(function (row) {
            return new Note(row.content, row.lastUpdated, row.byUserId, row.forUserId, !!row.patientVisible, row.noteId, row.name);
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
        ]).
            then(function (rs) { return NoteService.loadNoteById(c, rs.insertId); });
    };
    return NoteService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NoteService;
var Note = (function () {
    function Note(content, lastUpdated, byUserId, forUserId, patientVisible, noteId, writtenBy // Not persisted to the database, but available as a decoration during load.
        ) {
        this.content = content;
        this.lastUpdated = lastUpdated;
        this.byUserId = byUserId;
        this.forUserId = forUserId;
        this.patientVisible = patientVisible;
        this.noteId = noteId;
        this.writtenBy = writtenBy;
    }
    return Note;
})();
exports.Note = Note;
//# sourceMappingURL=notes.js.map
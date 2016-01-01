/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db";

export default class NoteService {

    /**
     * Loads notes for a user.
     * Security must be checked before calling this method.
     *
     * Decorations included: writtenBy      // The name of the user who wrote the note.
     *
     */
    static loadNotesForUser(c : any, userId : number) : Promise<Note[]> {
        return db.query(c, "select n.*, u.name from notes n, user u " +
            "where n.forUserId = ? and " +
            "n.byUserId = u.userId " +
            "order by n.lastUpdated desc", [userId]).
            then(rows => {

            return rows.map(row => new Note(
                row.content,
                row.lastUpdated,
                row.byUserId,
                row.forUserId,
                !!row.patientVisible,
                row.noteId,
                row.name
            ))
        })
    }

    /**
     * Loads a note by id.
     * Security must be checked before calling this method.
     *
     * Decorations included: writtenBy      // The name of the user who wrote the note.
     *
     */
    // TODO test coverage
    static loadNoteById(c : any, noteId : number) : Promise<Note> {
        return db.queryOne(c, "select n.*, u.name from notes n, user u " +
            "where n.noteId = ? and u.userId = n.byUserId", [noteId]).
        then(row => {

            return new Note(
                row.content,
                row.lastUpdated,
                row.byUserId,
                row.forUserId,
                !!row.patientVisible,
                row.noteId,
                row.name
            )
        })
    }

    /**
     * Saves a note
     */
    static addNote(c:any, note:Note) : Promise<Note> {
        return db.query(c, "insert into notes " +
            "(noteId, content, lastUpdated, byUserId, forUserId, patientVisible) values " +
            "(?,      ?,       ?,           ?,        ?,         ?             )",
            [

                note.noteId,
                note.content,
                note.lastUpdated,
                note.byUserId,
                note.forUserId,
                note.patientVisible ? 1 : 0
            ]).
            then((rs) => NoteService.loadNoteById(c, rs.insertId))
    }

}

export class Note {

    constructor(
        public content : string,
        public lastUpdated : Date,
        public byUserId : number,
        public forUserId : number,
        public patientVisible : boolean,
        public noteId ?: number,

        public writtenBy ?: string      // Not persisted to the database, but available as a decoration during load.
    ){}

}
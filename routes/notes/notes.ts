/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../../routes/dao/db";

export default class NoteService {

    /**
     * Loads notes for a user.
     * Security must be checked before calling this method.
     *
     */
    static loadNotesForUser(c : any, userId : number) : Promise<Note[]> {
        return db.query(c, "select * from notes where forUserId = ?", [userId]).
            then(rows => {

            return rows.map(row => new Note(
                row.content,
                row.lastUpdated,
                row.byUserId,
                row.forUserId,
                !!row.patientVisible,
                row.noteId
            ))
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
            ])
    }

}

export class Note {

    constructor(
        public content : string,
        public lastUpdated : Date,
        public byUserId : number,
        public forUserId : number,
        public patientVisible : boolean,
        public noteId ?: number
    ){}

}
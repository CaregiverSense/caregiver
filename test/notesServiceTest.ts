/// <reference path="../typings/tsd.d.ts" />
"use strict"

import db from "../routes/dao/db";
import UserService from "../routes/user/User";
import NoteService from "../routes/notes/notes";
import { Note } from "../routes/notes/notes";
import { User, IUser } from "../routes/user/User";
import TestUtil from "./TestUtil";
import { expect } from "chai"

db.init("test/databaseSettings.json");

let chai = require("chai");
chai.use(require("chai-as-promised"))
chai.should()

describe("NotesService", function() {

    let userA = new User({fbId:"T1", role:'patient'})
    let userB = new User({fbId:"T2", role:'patient'})
    let userC = new User({fbId:"T3", role:'patient'})

    beforeEach(function() {
        return db.getConnection(c => {
            return TestUtil.resetDatabase(c).
            then(() => UserService.addUser(c, userA)).
            then(() => UserService.addUser(c, userB)).
            then(() => UserService.addUser(c, userC))
        })
    });

    describe("#addNote()", function() {
        it("can save a note", function() {
            let lastUpdated = new Date()
            let note = new Note("This is a test note", lastUpdated,
                userA.userId, userB.userId, true)

            return db.getConnection(c => { return (

                NoteService.addNote(c, note).
                then(() => {
                    return db.queryOne(c, "select * from notes where forUserId = ?", [userB.userId])
                }).
                then((row) => {
                    expect(row).to.not.be.a('null')
                    expect(row.content).to.equal("This is a test note")
                    // expect(row.lastUpdated).to.equal(lastUpdated)    // TODO ms are truncated when saved to db
                                                                        // so a better assertion is needed here
                    expect(row.byUserId).to.equal(userA.userId)
                    expect(row.forUserId).to.equal(userB.userId)
                    expect(row.patientVisible).to.equal('1')
                }))
            })
        })
    })

    describe("#loadNotesForUser()", function() {

        it("should load all the properties of a note", function() {
            let note1 = new Note("My note", new Date(),
                userA.userId, userB.userId, true)

            return db.getConnection(c => { return (

                NoteService.addNote(c, note1).
                then(() => NoteService.loadNotesForUser(c, userB.userId)).
                then((notes) => {
                    expect(notes.length).to.equal(1)
                    expect(notes[0].content).to.equal("My note")
                    expect(notes[0].byUserId).to.equal(userA.userId)
                    expect(notes[0].forUserId).to.equal(userB.userId)
                    expect(notes[0].patientVisible).to.equal(true)
                })
            )})
        })

        it("should return an empty array if there are no notes", function() {
            let note1 = new Note("Note for userA", new Date(),
                userA.userId, userA.userId, false)

            return db.getConnection(c => { return (
                NoteService.addNote(c, note1).
                then(() => NoteService.loadNotesForUser(c, userB.userId)).
                then((notes) => {
                    expect(notes).to.be.an('array')
                    expect(notes.length).to.equal(0)
                })
            )})
        })

        it("should load notes for the right user", function() {

            let note1 = new Note("Note 1", new Date(),
                userA.userId, userB.userId, true)

            let note2 = new Note("Note 2", new Date(),
                userC.userId, userB.userId, true)

            let note3 = new Note("Note 3", new Date(),
                userB.userId, userA.userId, true)

            let note4 = new Note("Note 4", new Date(),
                userB.userId, userB.userId, true)

            return db.getConnection(c => { return (

                NoteService.addNote(c, note1).
                    then(() => NoteService.addNote(c, note2)).
                    then(() => NoteService.addNote(c, note3)).
                    then(() => NoteService.addNote(c, note4)).
                    then(() => NoteService.loadNotesForUser(c, userB.userId)).
                    then((notes) => {
                        expect(notes.length).to.equal(3)
                        expect(notes[0].content).to.equal("Note 1")
                        expect(notes[1].content).to.equal("Note 2")
                        expect(notes[2].content).to.equal("Note 4")
                    })
            )})
        })
    })

})
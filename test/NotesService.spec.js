/// <reference path="../typings/tsd.d.ts" />
"use strict";
var moment = require("moment");
var db_1 = require("../routes/dao/db");
var User_1 = require("../routes/user/User");
var notes_1 = require("../routes/notes/notes");
var notes_2 = require("../routes/notes/notes");
var User_2 = require("../routes/user/User");
var TestUtil_1 = require("./TestUtil");
var chai_1 = require("chai");
db_1.default.init("test/databaseSettings.json");
var chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();
describe("NotesService", function () {
    var userA = new User_2.User({ fbId: "T1", role: 'patient' });
    var userB = new User_2.User({ fbId: "T2", role: 'patient' });
    var userC = new User_2.User({ fbId: "T3", role: 'patient' });
    beforeEach(function () {
        return db_1.default.getConnection(function (c) {
            return TestUtil_1.default.resetDatabase(c).
                then(function () { return User_1.default.addUser(c, userA); }).
                then(function () { return User_1.default.addUser(c, userB); }).
                then(function () { return User_1.default.addUser(c, userC); });
        });
    });
    describe("#addNote()", function () {
        it("can save a note", function () {
            var lastUpdated = new Date();
            var note = new notes_2.Note("This is a test note", lastUpdated, userA.userId, userB.userId, true);
            return db_1.default.getConnection(function (c) {
                return (notes_1.default.addNote(c, note).
                    then(function () {
                    return db_1.default.queryOne(c, "select * from notes where forUserId = ?", [userB.userId]);
                }).
                    then(function (row) {
                    chai_1.expect(row).to.not.be.a('null');
                    chai_1.expect(row.content).to.equal("This is a test note");
                    // expect(row.lastUpdated).to.equal(lastUpdated)    // TODO ms are truncated when saved to db
                    // so a better assertion is needed here
                    chai_1.expect(row.byUserId).to.equal(userA.userId);
                    chai_1.expect(row.forUserId).to.equal(userB.userId);
                    chai_1.expect(row.patientVisible).to.equal('1');
                }));
            });
        });
    });
    describe("#loadNotesForUser()", function () {
        it("should load all the properties of a note", function () {
            var note1 = new notes_2.Note("My note", new Date(), userA.userId, userB.userId, true);
            return db_1.default.getConnection(function (c) {
                return (notes_1.default.addNote(c, note1).
                    then(function () { return notes_1.default.loadNotesForUser(c, userB.userId); }).
                    then(function (notes) {
                    chai_1.expect(notes.length).to.equal(1);
                    chai_1.expect(notes[0].content).to.equal("My note");
                    chai_1.expect(notes[0].byUserId).to.equal(userA.userId);
                    chai_1.expect(notes[0].forUserId).to.equal(userB.userId);
                    chai_1.expect(notes[0].patientVisible).to.equal(true);
                }));
            });
        });
        it("should return an empty array if there are no notes", function () {
            var note1 = new notes_2.Note("Note for userA", new Date(), userA.userId, userA.userId, false);
            return db_1.default.getConnection(function (c) {
                return (notes_1.default.addNote(c, note1).
                    then(function () { return notes_1.default.loadNotesForUser(c, userB.userId); }).
                    then(function (notes) {
                    chai_1.expect(notes).to.be.an('array');
                    chai_1.expect(notes.length).to.equal(0);
                }));
            });
        });
        it("should load notes for the right user", function () {
            var note1 = new notes_2.Note("Note 1", moment("2021-01-01").toDate(), userA.userId, userB.userId, true);
            var note2 = new notes_2.Note("Note 2", moment("2022-01-01").toDate(), userC.userId, userB.userId, true);
            var note3 = new notes_2.Note("Note 3", moment("2023-01-01").toDate(), userB.userId, userA.userId, true);
            var note4 = new notes_2.Note("Note 4", moment("2024-01-01").toDate(), userB.userId, userB.userId, true);
            return db_1.default.getConnection(function (c) {
                return (notes_1.default.addNote(c, note1).
                    then(function () { return notes_1.default.addNote(c, note2); }).
                    then(function () { return notes_1.default.addNote(c, note3); }).
                    then(function () { return notes_1.default.addNote(c, note4); }).
                    then(function () { return notes_1.default.loadNotesForUser(c, userB.userId); }).
                    then(function (notes) {
                    chai_1.expect(notes.length).to.equal(3);
                    chai_1.expect(notes[0].content).to.equal("Note 4");
                    chai_1.expect(notes[1].content).to.equal("Note 2");
                    chai_1.expect(notes[2].content).to.equal("Note 1");
                }));
            });
        });
    });
});
//# sourceMappingURL=NotesService.spec.js.map
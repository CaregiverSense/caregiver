/// <reference path="../typings/tsd.d.ts" />
"use strict";
var express = require('express');
var router = express.Router();
var db_1 = require("./dao/db");
var log_1 = require("./util/log");
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
router.get("/template", function (req, res) {
    log_1["default"]("/notes/template");
    res.render("template/patientNotes");
});
/**
 * API section
 */
router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
// TODO Add configurable tracing of every path as middleware.
function onFail(res) {
    return function (err) {
        log_1["default"]("Error: " + log_1["default"](err));
        res.send({ error: true });
    };
}
/**
 *  content
 *  patientVisible
 *
 */
router.post("/save", function (req, res) {
    log_1["default"]("/notes/save");
    var o = req.body;
    var content = o.content;
    var patientId = o.patientId;
    var patientVisible = o.patientVisible;
    var user = req.session['user'];
    var userId = user.userId;
    user.hasAccessTo(req['c'], patientId).
        then(function () {
        return db_1["default"].query(req['c'], "insert into notes (content, lastUpdated, byUserId, forUserId, patientVisible) values (?, ?, ?, ?, ?)", [content,
            new Date(),
            userId,
            patientId || userId,
            (patientVisible) ? true : false
        ]);
    }).
        then(function () {
        log_1["default"]("inserted note " + log_1["default"](o));
        res.send({ "inserted": "true" });
    }).catch(onFail(res));
});
/**
 * Load notes for the current patient of the logged in user.
 */
router.post("/load", function (req, res) {
    log_1["default"]("/notes/load");
    var patientId = req.body.patientId;
    var user = req.session['user'];
    var userId = user.userId;
    var loadNotesForUserId = patientId || userId;
    user.hasAccessTo(req['c'], patientId).
        then(function () {
        return db_1["default"].query(req['c'], "select n.*, f.name as fromUserName from notes n, user f where n.byUserId = f.userId and n.forUserId = ? order by lastUpdated desc", [loadNotesForUserId]);
    }).
        then(function (rs) {
        log_1["default"]("Loaded " + log_1["default"](rs));
        var filtered = [];
        for (var i = 0; i < rs.length; i++) {
            var row = rs[i];
            var isNotPatient = userId != row.forUserId;
            if (isNotPatient || row.patientVisible) {
                filtered.push(row);
            }
        }
        res.send(filtered);
    }).catch(onFail(res));
});
exports.__esModule = true;
exports["default"] = router;
//# sourceMappingURL=csNotes.js.map
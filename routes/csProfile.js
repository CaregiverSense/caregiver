var express = require('express');
var router = express.Router();
var db = require("./dao/db.js");
var log = require("./util/log.js");

var d = console.dir;
var l = console.log;
var j = JSON.stringify;

router.use(require("./middleware/checkIsCaregiver"));


router.post("/moca", function(req, res) {
    l("/moca");

    var s = req.session;
    if (s.userId && s.patientId) {
        req.c.query("select executive+naming+memory+attention1+attention2+attention3+language1+language2+abstraction+delayedRecall+orientation+education as score from moca where userId = ?",
            [s.userId],
            db.wrap(rs => res.send({score : rs.length ? rs[0].score : "none"}))
        );
    } else {
        log.userOrPatientNotFound("/moca");
        res.send({error:true});
    }

});

router.post("/mmse", function(req, res) {
    l("/mmse");

    var s = req.session;
    if (s.userId && s.patientId) {
        req.c.query("select orientation1+orientation2+registration+attention+recall+language1+language2+language3+language4+language5+language6 as score from mmse where userId = ?",
            [s.userId],
            db.wrap(rs => res.send({score: rs.length ? rs[0].score : "none"}))
        );
    } else {
        log.userOrPatientNotFound("/mmse");
        res.send({error:true});
    }
});


router.post("/allergies", function(req, res) {
    l("/allergies");

    var s = req.session;
    if (s.userId && s.patientId) {
        req.c.query("select a.name from allergy a, user_allergy ua where a.allergyId = ua.allergyId and ua.userId = ?", [s.userId],
            db.wrap(rs => {
                l("/allergies sending" + j(rs));
                res.send(rs);
            })
        );
    } else {
        log.userOrPatientNotFound("/mmse");
        res.send({error:true});
    }
});

module.exports = router;

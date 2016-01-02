/// <reference path="../typings/tsd.d.ts" />
"use strict";
var User_1 = require("./user/User");
var tag_1 = require("./tag/tag");
var log_1 = require("./util/log");
var express = require('express');
var router = express.Router();
// TODO refactor so that this is replaced by csLogin.ts
router.post('/loginUser', function (req, res) {
    // TODO register user if necessary.
    log_1.default(req.body);
    // TODO verify the fbId with facebook.
    log_1.default("/loginUser fbId is " + req.body.fbId);
    User_1.default.loadUserByFbId(req["c"], req.body.fbId).then(function (user) {
        console.log("User for fbId " + req.body.fbId + " is " + JSON.stringify(user));
        if (user != null) {
            req.session["user"] = user;
            req.session["userId"] = user.userId;
            req.session["patientId"] = user.patientId;
            var patient = null;
            Promise.resolve((user.patientId) ?
                User_1.default.loadUserByUserId(req["c"], user.patientId).then(function (p) { patient = p; })
                : null).then(function () { return res.status(200).send({ patient: patient, user: user }); });
        }
    });
});
router.post('/tap', function (req, res) {
    var tagId = req.body.tagId;
    console.log('tap post tagId: ', tagId);
    tagId ?
        tag_1.default.loadTag(req["c"], tagId).then(function (tag) {
            console.log("tag loaded: ", tag);
            res.status(200).send({ tags: tag });
        })
        :
            res.status(200).send({ error: 'tag is undefined' });
});
router.get('/self', function (req, res) {
    return res.render('template/self', { fbId: req.query.fbId });
} // TODO fbId shouldn't need to be passed to the client.
 // TODO fbId shouldn't need to be passed to the client.
);
router.get('/', function (req, res) { return res.render('index'); });
router.get('/tag', function (req, res) { return res.render('index'); });
router.get('/other', function (req, res) { return res.render('template/other'); });
router.get('/dial', function (req, res) { return res.render('template/dial'); });
router.get('/directions', function (req, res) { return res.render('template/directions'); });
router.get('/caregiver', function (req, res) { return res.render('template/caregiver'); });
router.get('/notes', function (req, res) { return res.render('template/notes'); });
router.get('/profile', function (req, res) { return res.render('template/profile'); });
router.get('/laundry', function (req, res) { return res.render('template/laundry'); });
router.get('/schedule', function (req, res) { return res.render('template/schedule'); });
router.get('/moca', function (req, res) { return res.render('template/moca'); });
router.get('/userLookup', function (req, res) { return res.render('template/userLookup'); });
router.get('/view/:someView', function (req, res) { return res.render('view/' + req.params.someView); });
router.get('/template/:someTemplate', function (req, res) { return res.render('template/' + req.params.someTemplate); });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csIndex.js.map
/// <reference path="../typings/tsd.d.ts" />
"use strict"

import db from './dao/db'
import UserService from "./user/User";
import TagService from "./tag/tag"
import l from "./util/log"
import express = require('express')
let router = express.Router()



// TODO refactor so that this is replaced by csLogin.ts
router.post('/loginUser', (req : any, res) => {

    // TODO register user if necessary.
    l(req.body);

    // TODO verify the fbId with facebook.
    l(`/loginUser fbId is ${req.body.fbId}`)
    UserService.loadUserByFbId(req["c"], req.body.fbId).then((user) => {
        console.log(`User for fbId ${req.body.fbId} is ${JSON.stringify(user)}`)
        if (user != null) {
            req.session["user"] = user;
            req.session["userId"] = user.userId;
            req.session["patientId"] = user.patientId;

            let patient = null;

            Promise.resolve( (user.patientId) ?

                UserService.loadUserByUserId(req["c"], user.patientId).then((p) => { patient = p; })
                : null

            ).then(
                () => res.status(200).send({ patient, user })
            )
        }
    });
});


router.post('/tap', function (req, res) {
   var tagId = req.body.tagId
   console.log('tap post tagId: ', tagId)

   tagId ?
       TagService.loadTag(req["c"], tagId).then(tag => {
           console.log("tag loaded: ", tag)
           res.status(200).send({ tags: tag })
       })
       :
       res.status(200).send({ error: 'tag is undefined' })

})

router.get('/self', (req, res) =>
    res.render('template/self', { fbId: req.query.fbId })       // TODO fbId shouldn't need to be passed to the client.
)

router.get('/',                     (req, res) => res.render('index'))
router.get('/tag',                  (req, res) => res.render('index'))
router.get('/other',                (req, res) => res.render('template/other'))
router.get('/dial',                 (req, res) => res.render('template/dial'))
router.get('/directions',           (req, res) => res.render('template/directions'))
router.get('/caregiver',            (req, res) => res.render('template/caregiver'))
router.get('/notes',                (req, res) => res.render('template/notes'))
router.get('/profile',              (req, res) => res.render('template/profile'))
router.get('/laundry',              (req, res) => res.render('template/laundry'))
router.get('/schedule',             (req, res) => res.render('template/schedule'))
router.get('/moca',                 (req, res) => res.render('template/moca'))
router.get('/userLookup',           (req, res) => res.render('template/userLookup'))

router.get('/view/:someView',           (req, res) => res.render('view/' + req.params.someView))
router.get('/template/:someTemplate',   (req, res) => res.render('template/' + req.params.someTemplate))


export default router
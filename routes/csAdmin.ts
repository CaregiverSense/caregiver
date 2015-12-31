/// <reference path="../typings/tsd.d.ts" />
"use strict"

import UserService from "./user/User";
import express = require('express')
import db from "./dao/db"
import l from "./util/log"
import * as path from 'path'
import { MailTemplate, MailHeaders } from "./mail/mail";
import MailService from "./mail/mail";
import User from "./user/User";
import RegisterService from "./register/register";
let router = express.Router()

router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
router.use(require("./middleware/checkIsAdmin"));

router.get('/', (req, res) => {
    l("Rendering web/admin");
    res.render('web/admin')
});

router.post("/api/getCaregivers", (req, res) => {

    UserService.loadUsersByRole(req["c"], 'caregiver').
        then((users) => res.send(users)).
        catch((e) => l(e))

})

router.post("/api/getPatients", (req, res) => {

    UserService.loadUsersByRole(req["c"], 'patient').
        then((users) => res.send(users)).
        catch((e) => l(e))
})

router.post("/api/loadUser", (req, res) => {

    let userId = req.body["userId"];

    UserService.loadUserByUserId(req["c"], userId).
        then(user => res.send(user))

})

router.post("/api/addCaregiver", (req, res) => {
    let c = req["c"]
    let binds = {
        name : req.body.name,
        email : req.body.email,
        phoneNumber : req.body.phoneNumber,
        adminName : req.session["user"].name,
        registrationLink : null
    }

    // TODO include the admin name in the registration entry.
    // TODO Add a new registration entry.

    // TODO fix to use promises
    RegisterService.addRegistration(c, binds.name, binds.email, binds.phoneNumber).

        then((registrationLink) => {

            binds.registrationLink = registrationLink;

            return MailService.sendMail(c,
                new MailHeaders(
                    binds.email,
                    "Welcome"
                ),
                new MailTemplate(
                    path.join(__dirname, '../views/web/email/registrationEmail.jade'),
                    binds
                )
            )}).

        then(() => res.send({ok:true})).
        catch(err => l(err))
})

router.post("/api/assignCaregiverToPatient", function(req, res) {
    var caregiverId = req.body.caregiverId
    var patientId = req.body.patientId
    var c = req["c"]

    UserService.loadUserByUserId(c, caregiverId).then((user) => {
        user.makeSupervisorOf(c, patientId)
    }).
    then(() => res.send({ok:true})).
    catch(err => l(err))
})


function unassign(req, res, next) {
    var caregiverId = req.body.caregiverId;
    var patientId = req.body.patientId;
    var caregivers, patients;
    var c = req["c"]

    UserService.loadUserByUserId(c, caregiverId).then((user) => {
        return user.unassignPatient(c, patientId)
    }).
    then(() => UserService.loadPatientsForCaregiver(c, caregiverId)).
    then((rs) => {
        patients = rs
        return UserService.loadCaregiversForPatient(c, patientId)
    }).
    then((rs) => {
        caregivers = rs;
        res.send({patients, caregivers});
    }).
    catch((err) => {
        l("Error: " + l(err));
        res.send({patients : [], caregivers : []});
    });
}

/**
 * Unassign a caregiver from a patient and return the remaining caregivers.
 */
router.post("/api/unassignCaregiverFromPatient", unassign);

/**
 * Unassign a patient from a caregiver and return the remaining patients.
 */
router.post("/api/unassignPatientFromCaregiver", unassign);


router.post("/api/loadCaregiversForPatient", function(req, res) {
    l("/api/loadCaregiversForPatient");
    UserService.loadCaregiversForPatient(req['c'], req.body.patientId).then((rs) => {
        res.send({caregivers : rs});
    }).catch((err) => {     // TODO all endpoints using a promise should have a catch that ends the request.
        console.dir(err);
        res.end();
    });
})


router.post("/api/loadPatientsForCaregiver", function(req, res) {
    l("/api/loadPatientsForCaregiver");
    UserService.loadPatientsForCaregiver(req['c'], req.body.caregiverId).then((rs) => {
        res.send({patients : rs});
    }).catch((err) => {
        console.dir(err);
        res.end();
    });
})

export default router
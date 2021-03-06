/// <reference path="../typings/tsd.d.ts" />
"use strict";
var User_1 = require("./user/User");
var express = require('express');
var log_1 = require("./util/log");
var path = require('path');
var mail_1 = require("./mail/mail");
var mail_2 = require("./mail/mail");
var register_1 = require("./register/register");
var router = express.Router();
router.use(require("./middleware/setIsAPIFlag"));
router.use(require("./middleware/checkIsLoggedIn"));
router.use(require("./middleware/checkIsAdmin"));
router.get('/', function (req, res) {
    log_1.default("Rendering web/admin");
    res.render('web/admin');
});
router.post("/api/getCaregivers", function (req, res) {
    User_1.default.loadUsersByRole(req["c"], 'caregiver').
        then(function (users) { return res.send(users); }).
        catch(function (e) { return log_1.default(e); });
});
router.post("/api/getPatients", function (req, res) {
    User_1.default.loadUsersByRole(req["c"], 'patient').
        then(function (users) { return res.send(users); }).
        catch(function (e) { return log_1.default(e); });
});
router.post("/api/loadUser", function (req, res) {
    var userId = req.body["userId"];
    User_1.default.loadUserByUserId(req["c"], userId).
        then(function (user) { return res.send(user); });
});
router.post("/api/addCaregiver", function (req, res) {
    var c = req["c"];
    var binds = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        adminName: req.session["user"].name,
        registrationLink: null
    };
    // TODO include the admin name in the registration entry.
    // TODO Add a new registration entry.
    // TODO fix to use promises
    register_1.default.addRegistration(c, binds.name, binds.email, binds.phoneNumber).
        then(function (registrationLink) {
        binds.registrationLink = registrationLink;
        return mail_2.default.sendMail(c, new mail_1.MailHeaders(binds.email, "Welcome"), new mail_1.MailTemplate(path.join(__dirname, '../views/web/email/registrationEmail.jade'), binds));
    }).
        then(function () { return res.send({ ok: true }); }).
        catch(function (err) { return log_1.default(err); });
});
router.post("/api/assignCaregiverToPatient", function (req, res) {
    var caregiverId = req.body.caregiverId;
    var patientId = req.body.patientId;
    var c = req["c"];
    User_1.default.loadUserByUserId(c, caregiverId).then(function (user) {
        user.makeSupervisorOf(c, patientId);
    }).
        then(function () { return res.send({ ok: true }); }).
        catch(function (err) { return log_1.default(err); });
});
function unassign(req, res, next) {
    var caregiverId = req.body.caregiverId;
    var patientId = req.body.patientId;
    var caregivers, patients;
    var c = req["c"];
    User_1.default.loadUserByUserId(c, caregiverId).then(function (user) {
        return user.unassignPatient(c, patientId);
    }).
        then(function () { return User_1.default.loadPatientsForCaregiver(c, caregiverId); }).
        then(function (rs) {
        patients = rs;
        return User_1.default.loadCaregiversForPatient(c, patientId);
    }).
        then(function (rs) {
        caregivers = rs;
        res.send({ patients: patients, caregivers: caregivers });
    }).
        catch(function (err) {
        log_1.default("Error: " + log_1.default(err));
        res.send({ patients: [], caregivers: [] });
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
router.post("/api/loadCaregiversForPatient", function (req, res) {
    log_1.default("/api/loadCaregiversForPatient");
    User_1.default.loadCaregiversForPatient(req['c'], req.body.patientId).then(function (rs) {
        res.send({ caregivers: rs });
    }).catch(function (err) {
        console.dir(err);
        res.end();
    });
});
router.post("/api/loadPatientsForCaregiver", function (req, res) {
    log_1.default("/api/loadPatientsForCaregiver");
    User_1.default.loadPatientsForCaregiver(req['c'], req.body.caregiverId).then(function (rs) {
        res.send({ patients: rs });
    }).catch(function (err) {
        console.dir(err);
        res.end();
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=csAdmin.js.map
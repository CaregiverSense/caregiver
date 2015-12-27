var router = require('express').Router();
var db = require("./dao/db");
var l = require("./util/log");
var login = require("./auth/login");
var path = require('path');
var jade = require("jade");
var request = require('request');


// TODO refactor this into a separate module to share with admin.js
var generator = require('xoauth2').createXOAuth2Generator({
    user: process.env.OAUTH_GMAIL_USER,
    clientId: process.env.OAUTH_GMAIL_CLIENT_ID,
    clientSecret: process.env.OAUTH_GMAIL_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_GMAIL_REFRESH_TOKEN
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});


var dao = {};
require("extend")(dao,
    require("./dao/user-dao"),
    require("./dao/register-dao")
);

router.get("/", (req, res) => {

    var registrationId = req.query.id;
    dao.loadRegistration(req.c, registrationId).
        then((reg) => {
            if (reg) {
                res.render("web/welcomeCaregiver", {registrationId, name : reg.name})
            }
        })
});

/*
    // TODO does the signedRequest parameter need to be used in validation?
    Example post:
    auth : {
        accessToken: "CAAAAONCGuQEBANbqNc10NUjMrODciIwqczkUdthamVElYv3zTD2rr06mDiP4Nnqp3rre0FwjsBJsDkTat7hgi7ZAaFRb1Nfmd7sMZANaNBj2veGlUPUUSpVMf98VMxzRR8mpKLLjU0w9MwpZCNMHZCtN2h7ISMQmYyQzmGMOtItTJ64QihYUcMyK9203xCrRyZAZCtxxCGSgZDZD"
        expiresIn: 3880
        signedRequest: "SUahA5O2ijnMgtrHJV1mft5ch9ImNZtcMQS7BOrWrWY.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUQ0YTJFdExFVE44LXA0aWRZb0lmY0pWWDJpMG4yZE1YTGZ2TnlHY3FtMC1EUlhiSnNES1VMUzJFQ2pHNUV1cnZ6NVFVTERSVGVBcmwyeGJoOHBYdGFnRkE2Mk1ydm5DNzNScGt1RGlwY01PMjRQV09VUElaVWl4dmlwNlBURzhvRlExLV9za1lfSW4zRll4Q0ROdHV2eG1Fek03bFJYTTVpODNnVWZwZHpOLTV3d2NJSkFBQVlZY1FfUjB2US1KTmxZdTluTkF6OVZWbUFQdFNpVHI0TG5UMzFSalJjcmRSN1lKOTZWUDhGcWY1VmtCcmNKSFpncjhnRm1PNG80eWZpUExtSlpMcnNRMER1RHlKQW01ejR1cGxuZDlFcWEyTlg5ZTVubEttY0ZYZnVwZ3FhaTFHbGt2TV9ISDk1aFZ2Q2I0cmhWenNnN004YUR0NlowWkw2SCIsImlzc3VlZF9hdCI6MTQ0NzgyMjUyMCwidXNlcl9pZCI6IjEwMTUzMTYyNjA3MDQxMzk3In0"
        userID: "10153162607041397"
    }
    registrationId: '51451a88ab0ba36f8f3b5b3e43a18ae0'
*/

router.post("/", (req, res) => {
    var auth = req.body.auth;
    var registrationId = req.body.registrationId;

    // contact facebook to see if the access token is valid
    l("POST /register called with: " + l(req.body));
    l("Validating access token " + auth.accessToken);

    login.verifyAccessToken(auth.accessToken).then((fbUser) => {

        l("User verified by facebook, loading by fbId " + fbUser.id);

        dao.loadUserByFbId(req.c, fbUser.id).then((user) => {
            if (user) {
                l("The user " + user.name + " already exists with the userId " + fbUser.id);
                // User is already registered, let them in.
                // TODO update user information.

                // If they are a caregiver then let them in.
                if (user.role == 'caregiver') {
                    res.send({userStatus : "alreadyExists"});
                } else {
                    // TODO show a 'not authorized' page.
                }
            } else {
                l("registerUser called for " + fbUser.name + " with userId " + fbUser.id + " for registrationId " + registrationId);
                dao.registerUser(req.c, fbUser, registrationId, 'caregiver').
                    then(() => {
                        // TODO notify the admin of the registration by email
                        l("Registered!");
                        res.send({userStatus : "registered"});
                    }).catch((err) => {
                        l("Error: " + l(err));  // TODO add proper handling
                    });
            }

        });
    }, (err) => {
        l("Error: " + l(err));      // TODO add proper handling
    })

});



module.exports = router;
/// <reference path="./typings/tsd.d.ts" />
import {ErrorRequestHandler} from "express";
"use strict"

import {Response, CookieOptions} from "express";
import {SessionOptions} from "express-session";
import express = require('express');
import path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
import session = require('express-session')
import l from "./routes/util/log";

import db from "./routes/dao/db";

import index    from './routes/csIndex'
import admin    from './routes/csAdmin'
import login    from './routes/csLogin'
import notes    from './routes/csNotes'
import register from './routes/csRegister'
import user     from './routes/csUser'
import dial     from './routes/csDial'
import places   from './routes/csPlaces'

let profile = require('./routes/csProfile')
let schedule = require('./routes/csSchedule')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function releaseConnection(req) {
    if (req.c) {
        req.c.release();
        req.c = null;
        // l("Connection released");
    }
}

/*

 Configure the session

 The session will contain these values:
    userId      - set when a registered user logs in.
    patientId   - set when the user has a patient selected, or when they select a new one.

 */

console.log(process.env.COOKIE_SECRET)

app.use(session(({
    // genid                // Use the uid2 library to generate session IDs.
    name : 'memtag.sid',    // The name of the session ID cookie.
    proxy : true,           // Trust the reverse proxy based on the 'X-Forwarded-Proto' header.
    resave : false,         // TODO verify that the session store implements a touch method.
    rolling : true,         // Set a cookie on each response, causing the expiration date to reset.
    saveUninitialized : false, // A new session will not be saved unless it is modified.
    secret : process.env.COOKIE_SECRET,  // Used to sign cookies.
    // store :              // Defaults to a new MemoryStore.  TODO change this to be a redis store or perhaps use Sequelize.js when clustering.
    unset : 'keep',         // Setting req.session to null or using delete on it will result in the session being kept
                            // open, but the changes made during the request are discarded.
    cookie : {
        httpOnly : true,    // The session cookie is not accessible by script.
        secure : 'auto',      // The cookie will be secure if accessed over HTTPS, and not secure if accessed over HTTP.
        maxAge : 2592000000,// The cookie expires after 30 days.
        path : '/'
    }
} as SessionOptions)
));
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}

// The first middleware chain link establishes a database connection.
app.use(function(req, res, next) {
    l("Path:   "); l(req.path);
    l("Params: "); l(req.params);
    l("Body:   "); l(req.body);

    db.getPool().getConnection(function(err, c) {
        if (!err) {
            // l("Connection obtained");
            req["c"] = c;
            res.on("finish", function() {
                releaseConnection(req);
            });
            next();
        } else {
            next(err);
        }
    });
});



app.use('/',            index)
app.use('/admin',       admin)
app.use('/dial',        dial)
app.use('/login',       login)
app.use('/notes',       notes)
app.use('/places',      places)
app.use('/profile',     profile)
app.use('/register',    register)
app.use('/schedule',    schedule)
app.use('/user',        user)

// catch 404 and forward to error handler
app.use(function(req, res, next) {


    var err = new Error('Not Found');
    err["status"] = 404;
    next(err);
});

// error handlers

// Handler to release the database connection
app.use((function(err, req, res, next) {
    releaseConnection(req);
    next(err);
} as ErrorRequestHandler));


app.use(function(err, req, res : Response, next) {
    l("Error is " + l(err));

    var stack = (app.get('env') === 'development') ? err : {};

    if (req["redirectToLogin"]) {
        if (req["isAPI"]) {
            res.status(200).send({needsLogin : true});
        } else {
            console.log("app.js: Redirecting user to 'web/login.jade'")
            res.status(200).render('web/login', {
                message: err.message,
                error: stack
            });
        }
    } else {
        console.log("app.js: Redirecting user to 'error.jade'")
        res.status(err.status || 500).render('error', {
            message: err.message,
            error: stack
        });
    }

});


module.exports = app;

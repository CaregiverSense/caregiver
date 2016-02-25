"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var log_1 = require("./routes/util/log");
var db_1 = require("./routes/dao/db");
var csIndex_1 = require('./routes/csIndex');
var csAdmin_1 = require('./routes/csAdmin');
var csLogin_1 = require('./routes/csLogin');
var csNotes_1 = require('./routes/csNotes');
var csRegister_1 = require('./routes/csRegister');
var csUser_1 = require('./routes/csUser');
var csDial_1 = require('./routes/csDial');
var csPlaces_1 = require('./routes/csPlaces');
var profile = require('./routes/csProfile');
var schedule = require('./routes/csSchedule');
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
    }
}
/*

 Configure the session

 The session will contain these values:
    userId      - set when a registered user logs in.
    patientId   - set when the user has a patient selected, or when they select a new one.

 */
console.log(process.env.COOKIE_SECRET);
app.use(session({
    // genid                // Use the uid2 library to generate session IDs.
    name: 'memtag.sid',
    proxy: true,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    // store :              // Defaults to a new MemoryStore.  TODO change this to be a redis store or perhaps use Sequelize.js when clustering.
    unset: 'keep',
    // open, but the changes made during the request are discarded.
    cookie: {
        httpOnly: true,
        secure: 'auto',
        maxAge: 2592000000,
        path: '/'
    }
}));
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}
// The first middleware chain link establishes a database connection.
app.use(function (req, res, next) {
    log_1.default("Path:   ");
    log_1.default(req.path);
    log_1.default("Params: ");
    log_1.default(req.params);
    log_1.default("Body:   ");
    log_1.default(req.body);
    db_1.default.getPool().getConnection(function (err, c) {
        if (!err) {
            // l("Connection obtained");
            req["c"] = c;
            res.on("finish", function () {
                releaseConnection(req);
            });
            next();
        }
        else {
            next(err);
        }
    });
});
app.use('/', csIndex_1.default);
app.use('/admin', csAdmin_1.default);
app.use('/dial', csDial_1.default);
app.use('/login', csLogin_1.default);
app.use('/notes', csNotes_1.default);
app.use('/places', csPlaces_1.default);
app.use('/profile', profile);
app.use('/register', csRegister_1.default);
app.use('/schedule', schedule);
app.use('/user', csUser_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err["status"] = 404;
    next(err);
});
// error handlers
// Handler to release the database connection
app.use((function (err, req, res, next) {
    releaseConnection(req);
    next(err);
}));
app.use(function (err, req, res, next) {
    log_1.default("Error is " + log_1.default(err));
    var stack = (app.get('env') === 'development') ? err : {};
    if (req["redirectToLogin"]) {
        if (req["isAPI"]) {
            res.status(200).send({ needsLogin: true });
        }
        else {
            console.log("app.js: Redirecting user to 'web/login.jade'");
            res.status(200).render('web/login', {
                message: err.message,
                error: stack
            });
        }
    }
    else {
        console.log("app.js: Redirecting user to 'error.jade'");
        res.status(err.status || 500).render('error', {
            message: err.message,
            error: stack
        });
    }
});
module.exports = app;
//# sourceMappingURL=app.js.map
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var log_1 = require("../util/log");
var mysql = require("mysql");
var db;
(function (db) {
    var settings = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        connectionLimit: process.env.DB_POOL_SIZE,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    };
    var s = settings;
    if (!s.host || !s.connectionLimit || !s.database || !s.database || !s.user || !s.password) {
        log_1.default("The following environment variables need to be set, to connect to the database");
        log_1.default("\tDB_HOST            // e.g. localhost");
        log_1.default("\tDB_POOL_SIZE       // e.g. 20");
        log_1.default("\tDB_NAME            // e.g. memtag");
        log_1.default("\tDB_USER            // e.g. root");
        log_1.default("\tDB_PASSWORD        // e.g. XawzDZeKh9OwU4eyNVKA");
    }
    var me = {
        pool: null
    };
    function wrap(cb) {
        return function (err, result) {
            if (err)
                throw err;
            cb(result);
        };
    }
    db.wrap = wrap;
    function getPool() {
        if (me.pool == null) {
            me.pool = mysql.createPool(settings);
        }
        return me.pool;
    }
    db.getPool = getPool;
    function getConnection(cb) {
        if (settings == null) {
            throw "init() was not called with database settings";
        }
        return new Promise(function (resolve, reject) {
            getPool().getConnection(function (err, c) {
                var release = function (endedWell, results) {
                    return function (err) {
                        if (err) {
                            log_1.default(err);
                        }
                        log_1.default("Connection released");
                        c.release();
                        if (endedWell) {
                            resolve(results);
                        }
                        else {
                            reject(err);
                        }
                    };
                };
                if (!err) {
                    log_1.default("Connection obtained");
                    try {
                        var result = cb(c);
                        if (!result || !result.then) {
                            log_1.default("Error: callback did not return a promise, " +
                                "connection is immediately released.");
                            (release(false))();
                        }
                        else {
                            return result.then(release(true, result)).catch(release(false));
                        }
                    }
                    catch (e) {
                        (release(false))(e);
                        console.log(e);
                        console.dir(e);
                        log_1.default("Connection problem" + log_1.default(e));
                    }
                }
                else {
                    log_1.default("Error obtaining connection" + log_1.default(err));
                }
            });
        });
    }
    db.getConnection = getConnection;
    function go(cb) {
        getPool().getConnection(function (err, c) {
            if (!err) {
                log_1.default("Connection obtained");
                try {
                    cb(c);
                    c.release();
                    log_1.default("Connection released");
                }
                catch (e) {
                    log_1.default("Connection problem" + log_1.default(e));
                }
            }
            else {
                log_1.default("Error obtaining connection" + log_1.default(err));
            }
        });
    }
    db.go = go;
    function query(c, sql, params) {
        return new Promise(function (yes, no) {
            c.query(sql, params, function (err, rs) {
                if (err) {
                    log_1.default("Error : " + log_1.default(err));
                    no(err);
                }
                else {
                    log_1.default("Resolved : " + log_1.default(rs));
                    yes(rs);
                }
            });
        });
    }
    db.query = query;
    function queryOne(c, sql, params) {
        return new Promise(function (yes, no) {
            c.query(sql, params, function (err, rs) {
                if (err) {
                    no(err);
                }
                else if (rs.length != 1) {
                    no(new Error("Expected one result from " + sql + " with params [" + params.join(',') + "] but found " + rs.length));
                }
                else {
                    yes(rs[0]);
                }
            });
        });
    }
    db.queryOne = queryOne;
})(db || (db = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = db;
//# sourceMappingURL=db.js.map

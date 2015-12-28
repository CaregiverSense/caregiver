/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var Q = require("q");
var l = require("../util/log");
var mysql = require("mysql");
var db;
(function (db) {
    var settings = null;
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
    /**
     * Initialize the database with a path to the database settings file
     * relative to the root of the project.  Do not include the leading slash (/)
     *
     * e.g. path = "test/databaseSettings.json"
     *
     * @param path
     * @return this
     */
    function init(path) {
        if (settings == null) {
            if (!path) {
                path = "databaseSettings.json";
            }
            settings = require("../../" + path);
            l("Loaded database settings " + l(settings));
        }
        else {
            throw "Error: db.js is already initialized.  New attempt is ignored.";
        }
        return me;
    }
    db.init = init;
    function getPool() {
        if (me.pool == null) {
            me.pool = mysql.createPool(settings);
        }
        return me.pool;
    }
    db.getPool = getPool;
    function getConnection(cb) {
        var promise = Q.defer();
        getPool().getConnection(function (err, c) {
            var release = function (endedWell) {
                return function (err) {
                    if (err) {
                        l(err);
                    }
                    l("Connection released");
                    c.release();
                    if (endedWell) {
                        promise.resolve();
                    }
                    else {
                        promise.reject(err);
                    }
                };
            };
            if (!err) {
                l("Connection obtained");
                try {
                    var result = cb(c);
                    if (!result.then) {
                        l("Error: callback did not return a promise, " +
                            "connection is immediately released.");
                        (release(false))();
                    }
                    else {
                        return result.then(release(true)).fail(release(false));
                    }
                }
                catch (e) {
                    (release(false))(e);
                    l("Connection problem" + l(e));
                }
            }
            else {
                l("Error obtaining connection" + l(err));
            }
        });
        return promise.promise;
    }
    db.getConnection = getConnection;
    function go(cb) {
        getPool().getConnection(function (err, c) {
            if (!err) {
                l("Connection obtained");
                try {
                    cb(c);
                    c.release();
                    l("Connection released");
                }
                catch (e) {
                    l("Connection problem" + l(e));
                }
            }
            else {
                l("Error obtaining connection" + l(err));
            }
        });
    }
    db.go = go;
    function query(c, sql, params) {
        var q = Q.defer();
        c.query(sql, params, function (err, rs) {
            if (err) {
                l("Error : " + l(err));
                q.reject(err);
            }
            else {
                l("Resolved : " + l(rs));
                q.resolve(rs);
            }
        });
        return q.promise;
    }
    db.query = query;
    function queryOne(c, sql, params) {
        var q = Q.defer();
        c.query(sql, params, function (err, rs) {
            if (err) {
                q.reject(err);
            }
            else if (rs.length != 1) {
                q.reject("Expected one result from " + sql + " with params [" + params.join(',') + "] but found " + rs.length);
            }
            else {
                q.resolve(rs[0]);
            }
        });
        return q.promise;
    }
    db.queryOne = queryOne;
})(db || (db = {}));
exports.__esModule = true;
exports["default"] = db;
//# sourceMappingURL=db.js.map
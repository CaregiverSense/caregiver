/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import l from "../util/log";
import mysql = require("mysql");

module db {
    let settings = null;

    var me = {
        pool: null
    }

    export function wrap(cb) {
            return function (err, result) {
                if (err) throw err;
                cb(result);
            }
        }

        /**
         * Initialize the database with a path to the database settings file
         * relative to the root of the project.  Do not include the leading slash (/)
         *
         * e.g. path = "test/databaseSettings.json"
         *
         * Example databaseSettings.json:

            {
              "host" : "localhost",
              "connectionLimit" : 50,
              "database" : "someDatabaseName",
              "user" : "someUser",
              "password" : "somePassword"
            }

         * @param path
         * @return this
         */
    export function init(path) {
            if (settings == null) {
                if (!path) {
                    path = "databaseSettings.json";
                }
                settings = require("../../" + path);
                l("Loaded database settings "  + l(settings));
            } else {
                l("using db " + l(settings))
            }
            return me;
        }

    export function getPool() {
            if (me.pool == null) {
                me.pool = mysql.createPool(settings);
            }
            return me.pool;
        }


    export function getConnection(cb) {

        if (settings == null) {
            throw "init() was not called with database settings"
        }

        return new Promise((resolve, reject) => {
            getPool().getConnection(function (err, c) {

                var release = (endedWell : boolean, results ?: any) => {
                    return function(err? : any) {
                        if (err) {
                            l(err);
                        }
                        l("Connection released");
                        c.release();
                        if (endedWell) {
                            resolve(results);
                        } else {
                            reject(err);
                        }
                    }
                }

                if (!err) {
                    l("Connection obtained");

                    try {
                        var result = cb(c);

                        if (!result || !result.then) {
                            l("Error: callback did not return a promise, " +
                                "connection is immediately released.");
                            (release(false))()
                        } else {
                            return result.then(release(true, result)).catch(release(false));
                        }
                    } catch (e) {
                        (release(false))(e)
                        console.log(e)
                        console.dir(e)
                        l("Connection problem" + l(e));
                    }
                } else {
                    l("Error obtaining connection" + l(err));
                }
            })
        })
    }

    export function go(cb) {
            getPool().getConnection(function (err, c) {
                if (!err) {
                    l("Connection obtained");

                    try {
                        cb(c);

                        c.release();
                        l("Connection released");
                    } catch (e) {
                        l("Connection problem" + l(e));
                    }
                } else {
                    l("Error obtaining connection" + l(err));
                }
            });
        }

    export function query(c, sql:string, params?:any[]) : Promise<any> {

            return new Promise((yes, no) => {
                c.query(sql, params, (err, rs) => {
                    if (err) {
                        l("Error : " + l(err))
                        no(err)
                    } else {
                        l("Resolved : " + l(rs))
                        yes(rs)
                    }
                })
            })
        }

    export function queryOne(c, sql:string, params?:any[]) : Promise<any> {

            return new Promise((yes, no) => {
                c.query(sql, params, (err, rs) => {
                    if (err) {
                        no(err)
                    } else if (rs.length != 1) {
                        no(new Error("Expected one result from " + sql + " with params [" + params.join(',') + "] but found " + rs.length))
                    } else {
                        yes(rs[0])
                    }
                })
            })
        }
}

export default db;

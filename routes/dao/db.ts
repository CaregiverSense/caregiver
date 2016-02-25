/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import l from "../util/log";
import mysql = require("mysql");


module db {

    let settings = {
        host              : process.env.DB_HOST,
        port              : process.env.PORT,
        connectionLimit   : process.env.DB_POOL_SIZE,
        database          : process.env.DB_NAME,
        user              : process.env.DB_USER,
        password          : process.env.DB_PASSWORD
    }

    let s = settings
    if (!s.host || !s.connectionLimit || !s.database || !s.database || !s.user || !s.password) {
        l("The following environment variables need to be set, to connect to the database")
        l("\tDB_HOST            // e.g. localhost")
        l("\tDB_POOL_SIZE       // e.g. 20")
        l("\tDB_NAME            // e.g. memtag")
        l("\tDB_USER            // e.g. root")
        l("\tDB_PASSWORD        // e.g. XawzDZeKh9OwU4eyNVKA")
    }


    let me = {
        pool: null
    }

    export function wrap(cb) {
            return function (err, result) {
                if (err) throw err;
                cb(result);
            }
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

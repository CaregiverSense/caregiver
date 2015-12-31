/// <reference path="../../typings/tsd.d.ts" />
"use strict"
import log from "./log";

export function sendResults(res) {
    return function(results) {
        log("Sending: " + log(results))
        res.send(results)
    }
}

/**
 * Returns an error handler that logs the error
 * and sends back {error:true}
 *
 * @param res
 * @returns {function(any): undefined}
 */
export function error(res) {
    return function(err) {
        log("Error: " + log(err))
        res.send({error: true})
    }
}

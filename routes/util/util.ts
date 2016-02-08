/// <reference path="../../typings/tsd.d.ts" />
import {Router} from "express";
"use strict"
import express = require('express')
let router = express.Router()

import { User } from "../user/User";
import log from "./log";

export default function(router : Router) {

    /**
     * Creates a POST endpoint with the given OnRequestHandler
     * @param path
     * @param onRequest
     */
    this.endpoint = function(path : string, onRequest : OnRequestHandler) {
        router.post(path, (req, res) => {
            log(path + log(req.body));

            let response = onRequest(req["c"], req.body, new User(req.session['user']))

            if (typeof(response) === "undefined") {
                log("The " + path + " endpoint returned undefined instead of a promise")
            } else {
                response.then(sendResults(res)).catch(error(res))
            }
        })

    }
}

/**
 * An OnRequestHandler is a function that
 * is given a connection, a request body, the current User in the session.
 *
 * The handler must return a Promise to handle the request!
 *
 */
interface OnRequestHandler {
    (connection : any, body : any, user : User) : Promise<any>
}


export function sendResults(res) {
    return function(results) {
        log("sendResults: " + log(results))
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

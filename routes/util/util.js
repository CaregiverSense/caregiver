"use strict";
var express = require('express');
var router = express.Router();
var User_1 = require("../user/User");
var log_1 = require("./log");
function default_1(router) {
    /**
     * Creates a POST endpoint with the given OnRequestHandler
     * @param path
     * @param onRequest
     */
    this.endpoint = function (path, onRequest) {
        router.post(path, function (req, res) {
            log_1.default(path + log_1.default(req.body));
            onRequest(req["c"], req.body, new User_1.User(req.session['user'])).
                then(sendResults(res)).
                catch(error(res));
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function sendResults(res) {
    return function (results) {
        log_1.default("Sending: " + log_1.default(results));
        res.send(results);
    };
}
exports.sendResults = sendResults;
/**
 * Returns an error handler that logs the error
 * and sends back {error:true}
 *
 * @param res
 * @returns {function(any): undefined}
 */
function error(res) {
    return function (err) {
        log_1.default("Error: " + log_1.default(err));
        res.send({ error: true });
    };
}
exports.error = error;
//# sourceMappingURL=util.js.map
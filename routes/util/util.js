/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var log_1 = require("./log");
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
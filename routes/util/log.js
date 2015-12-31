/// <reference path="../../typings/tsd.d.ts" />
"use strict";
function log(item) {
    if (typeof (item) == 'string') {
        console.log(item);
    }
    else {
        return JSON.stringify(item);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = log;
//# sourceMappingURL=log.js.map
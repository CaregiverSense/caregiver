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
exports.__esModule = true;
exports["default"] = log;
//# sourceMappingURL=log.js.map
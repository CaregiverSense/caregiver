/// <reference path="../../typings/tsd.d.ts" />
"use strict"

export default function log(item) {

    if (typeof(item) == 'string') {
        console.log(item);
    } else {
        return JSON.stringify(item);
    }
}
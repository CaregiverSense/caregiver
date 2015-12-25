/* global define */

define(['jquery'], function ($) {
    return {
        success: function () {
            return function (result) {
                console.log('Success ')
                console.dir(result)
            }
        },

        failed: function () {
            return function (result) {
                console.log('Failed')
                console.dir(result)
            }
        }
    }
})

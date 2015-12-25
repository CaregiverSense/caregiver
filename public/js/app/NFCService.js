define([], function() {


    window.onNFC = function() {
        console.log("onNFC has " + window.tagId);
    };


    return function(module) {
        module.service('NFCService', function() {

            return {
                getTagId : function() {
                    return window.tagId;
                }
            }

        });
    }

})
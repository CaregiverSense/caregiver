define([], function() {

    return {
        getFacebookPlugin : function() {
            return window.facebook;
            //return window.parent.facebookConnectPlugin;
        },

        getLaunchNavigator : function() {
            return window.launchNavigator;
            //return window.parent.launchnavigator;
        },

        getNFC : function() {
            return window.nfc;
            //return window.parent.launchnavigator;
        },
        getLocalNotification : function() {
            return window.localNotification;
            // return window.parent.cordova.plugins.notification.local;
        }
    }

});
/* global define */

define(["app/phone"], function (phone) {
    return function (module) {
        module.controller('SelfCtrl', ['$scope', 'userInfo', function ($scope, userInfo) {
            var me = this;
            this.userInfo = userInfo;
            var fb = phone.getFacebookPlugin()

            fb && fb.api('/' + userInfo.getPatient().fbId + '/picture?redirect=false&width=9999', [], function (pic) {
                console.log('/picture gave' + JSON.stringify(pic))
                $scope.$apply(function() {
                    console.log("Setting profile pic to " + me.facebookPicURL);
                    me.facebookPicURL = pic.data.url
                });
            })

        }])
    }
})

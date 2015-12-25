/* global define */

define(['app/phone'], function (phone) {
    return function (module) {
        module.controller('CaregiverCtrl', ['userInfo', '$scope', function (userInfo, $scope) {
            var model = this

            this.patient = userInfo.getPatient()

            var fb = phone.getFacebookPlugin()

            fb && fb.api('/' + this.patient.fbId + '/picture?redirect=false&width=9999', [], function (pic) {
                console.log('/picture gave' + JSON.stringify(pic))
                $scope.$apply(function() {
                    model.facebookPicURL = pic.data.url
                });
            })

            this.call = function (number) {
                window.parent.location.href = 'tel:' + number;
            }
        }])
    }
})

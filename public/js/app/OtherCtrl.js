define(["angular"], function(angular) {
    return function(module) {
        module.controller("OtherCtrl", ["$scope", "$location", function ($scope, $location) {
            this.openFacebook = function () {
                $location.path($scope.fbLink)
            }
        }])
    }
});
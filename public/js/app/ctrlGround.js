define(['angular', 'jquery'],
    function (angular, $) {
        var module = angular.module('app', [
                "ngRoute",
                "ngAnimate",
            ])
            .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
                $locationProvider.html5Mode(true);
                $routeProvider.
                when('/dial', {
                    templateUrl: "/dial",
                    controller: "DialCtrl",
                    controllerAs: "dial",
                })
            }])

        module.controller('GroundCtrl', function ($scope) {


        })

    })
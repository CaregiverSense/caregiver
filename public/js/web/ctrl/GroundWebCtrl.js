define([
    'ctrl/AdminCtrl',
    'ctrl/LoginCtrl',
    'ctrl/WelcomeCaregiverCtrl',
    'ctrl/AdminPatientCtrl',
    'directives/PatientNotesDirective',
    'directives/UserLookupDirective',
    'directives/OnLastRowDirective',
    'directives/AdminQuickDialDirective',
    'directives/AdminQuickPlacesDirective',
    'svc/LoginService',
    'angular',
    'facebook',
    'angular-route'
], function(adminCtrl,
            loginCtrl,
            welcomeCaregiverCtrl,
            adminPatientCtrl,
            patientNotesDirective,
            userLookupDirective,
            onLastRowDirective,
            adminQuickDialDirective,
            adminQuickPlacesDirective,
            loginService,
            angular) {

    var module = angular.module("OpalWhale.Web", ['ui.bootstrap', 'ngRoute'])
        .config(["$httpProvider", "$routeProvider", "$locationProvider",
            function($httpProvider, $routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider.
                when('/view/adminPatient/:userId', {
                    templateUrl: '/view/adminPatient',
                    controller: 'AdminPatientCtrl',
                    controllerAs: 'ap'
                }).
                when('/view/adminCaregiver/:userId', {
                    templateUrl: '/view/adminCaregiver',
                    controller: 'AdminCaregiverCtrl',
                    controllerAs: 'ac'
                });

            $httpProvider.interceptors.push(["$q", function($q) {
                return {
                    'response' : function(response) {
                        //console.log("Response intercepted");
                        //console.dir(response)

                        if (response && response.data && response.data.needsLogin) {
                            // window.location = "/admin";     // TODO use routing instead.
                        }
                        return response;
                    }
                }
            }])
        }]).
        controller("GroundWebCtrl", ["$scope", "$location", function($scope, $location) {

            this.roles = 'caregivers,patients'; // Used in the user-lookup dropdown in the header bar

            $scope.load = function (path) {
                $location.path(path)
            }

            $scope.userLookupOnSelect = function($item) {
                console.group("Selected user")
                console.dir($item)
                console.groupEnd()

                if ($item.role == 'patient') {
                    $location.path("/view/adminPatient/" + $item.userId)
                } else if ($item.role == 'caregiver') {
                    $location.path("/view/adminCaregiver/" + $item.userId)
                }
            }

            $scope.$on("reapplyShadows", function() {
                console.log("reapplyShadows event caught")
                // TODO Is this really inefficient?? Will okshadow create multiple animation
                // TODO handlers for a single div element?
                $(".shadowed").okshadow({color:"#DDD", yMax:8, xMax:8, fuzzMin:4, fuzzMax:8});
            });

            console.log("In GroundWebCtrl")
        }]);


    // Services
    loginService(module);

    // Controllers
    adminCtrl(module);
    loginCtrl(module);
    welcomeCaregiverCtrl(module);
    adminPatientCtrl(module);
    patientNotesDirective(module);
    userLookupDirective(module);
    onLastRowDirective(module);
    adminQuickDialDirective(module);
    adminQuickPlacesDirective(module);

    console.log("Loaded OpalWhale.Web");

})
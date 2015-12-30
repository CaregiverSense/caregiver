define([
    'ctrl/AdminCtrl',
    'ctrl/LoginCtrl',
    'ctrl/WelcomeCaregiverCtrl',
    'directives/PatientNotesDirective',
    'svc/LoginService',
    'angular',
    'facebook'
], function(adminCtrl,
            loginCtrl,
            welcomeCaregiverCtrl,
            patientNotesDirective,
            loginService,
            angular) {

    var module = angular.module("OpalWhale.Web", ['ui.bootstrap'])
        .config(["$httpProvider", function($httpProvider) {
            $httpProvider.interceptors.push(["$q", function($q) {
                return {
                    'response' : function(response) {
                        console.log("Response intercepted");
                        console.dir(response)

                        if (response && response.data && response.data.needsLogin) {
                            // window.location = "/admin";     // TODO use routing instead.
                        }
                        return response;
                    }
                }
            }])
        }]).
        controller("GroundWebCtrl", [function($httpProvider) {

            console.log("In GroundWebCtrl")
        }]);




    // Services
    loginService(module);

    // Controllers
    adminCtrl(module);
    loginCtrl(module);
    welcomeCaregiverCtrl(module);
    patientNotesDirective(module);

    console.log("Loaded OpalWhale.Web");

})
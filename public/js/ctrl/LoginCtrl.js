define(["facebook"], function() {


    return function(module) {
        module.controller("LoginCtrl", ["$http", "$location", "$scope", "LoginService", function($http, $location, $scope, loginService) {

            var me = this;
            this.showFacebookButton = false;
            this.showUserNotRegistered = false;


            function login() {
                loginService.doLogin(
                    function onNotAuthorized() {
                        me.showFacebookButton = false;
                    },
                    function onNotRegistered() {
                        me.showUserNotRegistered = true;
                    },
                    function onSuccess(user) {
                        // Navigate to the user's homepage.
                        console.log("Navigating to /" + user.role);

                        // TODO route instead of hard redirect.
                        window.location = "/" + user.role;
                    }
                );
            }

            login();

            this.navigateToUserHome = function() {
                login();
            }
        }]);


    }
});
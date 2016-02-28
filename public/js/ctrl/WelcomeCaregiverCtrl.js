define(["facebook"], function() {


    return function(module) {
        module.controller("WelcomeCaregiver", ["$http", "$location", "$scope", function($http, $location, $scope) {

            var me = this;

            this.showLoginButton = false;
            this.showWelcomeBack = false;

            this.showPostRegistrationScreen = function() {
                me.showLoginButton = false;
                me.showWelcomeBack = true;
            }

            this.showPreRegistrationScreen = function() {
                me.showLoginButton = true;
                me.showWelcomeBack = false;
            };



            // TODO when a user has completed registration, send them to the app store to download the mobile client.

            $http.post("/login/fbId").then(function(rs) {
                FB.init({
                    appId: rs.data.id,
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.4'
                });
                FB.getLoginStatus(function(response) {
                    console.log("getLoginStatus");
                    console.dir(response);

                    if (response && response.status) {
                        $scope.$apply(function() {
                            if (response.status == "connected") {

                                console.log("User is connected");
                                me.showPostRegistrationScreen();

                            } else if (response.status == "not_authorized") {

                                console.log("User is not_authorized");
                                me.showPreRegistrationScreen();
                            }
                        });
                    }
                });


                FB.Event.subscribe('auth.authResponseChange', function (res) {

                    console.log("auth.authResponseChange:");
                    console.dir(res);
                    if (res.status === 'connected') {

                        $http.post("/register", {auth : res.authResponse, registrationId : me.registrationId}).then(function(rs) {
                            // TODO direct the user to download the mobile client.
                            if (rs.data.userStatus == "alreadyExists") {
                                console.log("User already exists");
                                me.showPostRegistrationScreen();        // TODO send them directly to their page
                            } else if (rs.data.userStatus == "registered") {
                                console.log("User has registered successfully!");
                                me.showPostRegistrationScreen();
                            } else {
                                // TODO
                            }
                        });
                    }
                });
            })

            this.openCaregiverPage = function() {
                window.location = "/admin";
            }
        }]);
    }
});
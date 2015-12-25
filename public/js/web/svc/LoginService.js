define(["facebook"], function() {

    return function(module) {

        FB.init({
            appId: '244016658689',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });

        /* May come in handy at some point
        FB.Event.subscribe('auth.authResponseChange', function (res) {
            console.log("auth.authResponseChange:");
            console.dir(res);
            if (onLoggedIn) onLoggedIn(res);
        });
        */

        module.factory('LoginService', ["$rootScope", "$http", function($rootScope, $http) {

            // isLogin
            var me = this;
            this.user = {};

            var api = {

                getUser : function() {
                    return me.user;
                },

                setUser : function(user) {
                    me.user = user;
                },

                /**
                 * Logs in a user, with three possible outcomes handled by
                 * the given
                 *
                 *
                 * @param onNotAuthorized
                 * @param onNotRegistered
                 * @param onSuccess
                 */
                doLogin : function(onNotAuthorized, onNotRegistered, onSuccess) {
                    // Notify the server that the user is logged in

                    var onLoggedIn = function(auth) {
                        $http.post("/login", auth).then(function(res) {
                            if (!res.data.accessTokenVerified) {
                                onNotAuthorized();
                            } else if (!res.data.userIsRegistered) {
                                onNotRegistered();
                            } else if (res.data.role) {
                                me.user = res.data;
                                onSuccess(me.user);
                            }
                        });
                    }

                    api.getLoginStatus(onLoggedIn, onNotAuthorized);
                },

                /**
                 * Retrieves the login status, and will call either 'onLoggedIn' or 'onNotAuthorized' when
                 * the login status is known.
                 *
                 * 'onLoggedIn' will be provided with an object that can be passed to the /login URL
                 * to authenticate the user with the server.
                 *
                 *
                 * @param onLoggedIn
                 * @param onNotAuthorized
                 */
                getLoginStatus : function (onLoggedIn, onNotAuthorized) {
                    FB.getLoginStatus(function (response) {
                        console.log("getLoginStatus");
                        console.dir(response);

                        if (response && response.status) {
                            setTimeout(function() {
                                $rootScope.$apply(function () {
                                    if (response.status == "connected") {
                                        console.log("Facebook authenticated.");
                                        if (onLoggedIn) {
                                            onLoggedIn(response.authResponse);
                                        }
                                    } else if (response.status == "not_authorized") {
                                        console.log("User is not_authorized");
                                        if (onNotAuthorized) {
                                            onNotAuthorized();
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            };
            return api;
        }])

    }

})
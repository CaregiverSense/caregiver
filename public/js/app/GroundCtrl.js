/* global define */

define([
        'angular',
        'jquery',
        '_',
        'app/CaregiverCtrl',
        'app/DialCtrl',
        'app/DirectionsCtrl',
        'app/NotesCtrl',
        'app/LaundryCtrl',
        'app/OtherCtrl',
        'app/SelfCtrl',
        'app/ScheduleCtrl',
        'app/DiagnosticsCtrl',
        'app/NFCService',
        'app/phone',
        'angular-animate'
    ],
    function (
        angular,
        $,
        lodash,
        CaregiverCtrl,
        DialCtrl,
        DirectionsCtrl,
        NotesCtrl,
        OtherCtrl,
        LaundryCtrl,
        SelfCtrl,
        ScheduleCtrl,
        DiagnosticsCtrl,
        NFCService,
        phone) {
        window.host = window.host = '';
        window.y = function() {
            console.log("success");
        };
        window.n = function() {
            console.log("failed");
        }


        var module = angular.module('OpalWhale', [ 'ngRoute', 'ngAnimate' ])
            .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
                $locationProvider.html5Mode(true);
                $routeProvider.when('/dial', {
                    templateUrl: '/dial',
                    controller: 'DialCtrl',
                    controllerAs: 'dial'
                }).when('/self', {
                    templateUrl: '/self',
                    controller: 'SelfCtrl',
                    controllerAs: 'self'
                }).when('/other', {
                    templateUrl: '/other',
                    controller: 'OtherCtrl',
                    controllerAs: 'other'
                }).when('/directions', {
                    templateUrl: '/directions',
                    controller: 'DirectionsCtrl',
                    controllerAs: 'directions'
                }).when('/notes', {
                    templateUrl: '/notes',
                    controller: 'NotesCtrl',
                    controllerAs: 'notes'
                }).when('/schedule', {
                    templateUrl: '/schedule',
                    controller: 'ScheduleCtrl',
                    controllerAs: 'ps'
                }).when('/caregiver', {
                    templateUrl: '/caregiver',
                    controller: 'CaregiverCtrl',
                    controllerAs: 'cg'
                }).when('/profile', {
                    templateUrl: '/profile',
                    controller: 'DiagnosticsCtrl',
                    controllerAs: 'diag'
                }).when('/laundry', {
                    templateUrl: '/laundry',
                    controller: 'LaundryCtrl',
                    controllerAs: 'laundry'
                })
            }])


        NFCService(module);
        SelfCtrl(module);
        ScheduleCtrl(module);
        OtherCtrl(module);
        DialCtrl(module);
        LaundryCtrl(module);
        DirectionsCtrl(module);
        NotesCtrl(module);
        CaregiverCtrl(module);
        DiagnosticsCtrl(module);

        module.service('userInfo', function () {
                return {
                    facebookPicURL: null,
                    facebookURL: null,
                    facebookProfile: null,

                    isPatient : false,

                    setPatient: function (patientUser) {
                        this.patient = patientUser
                        this.isPatient = true;
                    },
                    setUser: function (user) {
                        console.log("Setting user + " + JSON.stringify(user));
                        this.user = user
                    },
                    getPatient: function () {
                        return (this.patient) ? this.patient : this.user;
                    },
                    getUser: function () {
                        return this.user
                    },
                    isCaregiver: function () {
                        return this.user.role === 'caregiver'
                    }
                }
            })
            .controller('GroundCtrl', ['$scope', '$http', '$location', 'userInfo',
                function ($scope, $http, $location, userInfo) {
                    var me = this

                    $scope.load = function (path) {
                        $location.path(path)
                    }

                    $scope.$on('$locationChangeSuccess', function (next, current) {
                        var currentPath = _.capitalize(current.split('/').pop())
                        me.currentPath =
                            currentPath && currentPath !== 'Self'
                                ? ' - ' + currentPath
                                : ''
                    })


                    this.switchRole = function() {  // TODO remove this demo piece.
                        $http.post('/switchRole', {userId : userInfo.getUser().userId}).then(function(rs) {
                            if (rs.data.newRole == null) {
                                userInfo.setPatient(null);
                            }
                            $location.path(rs.data.view);
                        });
                    };

                    window.onNFC = function () {
                        console.log(window.nfc)

                        console.log('from ground ctrl ', window.tagId)

                        window.tagId &&
                        $http.post('/tap', { tagId: tagId })
                            .then(function (data) {
                                console.log("received data from '/tap': ", data)
                                data &&
                                data.data &&
                                data.data.tags &&
                                data.data.tags.type === 'laundry' &&
                                $location.path('/laundry')

                            })
                    }

                    var facebook = phone.getFacebookPlugin()

                    function tapIn (tagId) {
                        console.log('tapIn called for tag ' + tagId)
                        var tapPost = userInfo.facebookProfile
                        tapPost.tagId = tagId

                        // Tap in to find the route intended by the tag.
                        $http.post(window.host + '/tap', tapPost).then(function (link) {
                            console.log('/tap gave:' + JSON.stringify(link))

                            if (link.load) {
                                if (link.load === 'other') {
                                    console.log('Loading other')
                                    $scope.fbLink = link.fbLink
                                    $location.path('/other') // Integrate with the above branch.
                                } else if (link.load === 'laundry') {
                                    console.log('Loading laundry tag')
                                    $location.path('/laundry')
                                } else {
                                    facebook.api('/' + tapPost.id + '/picture?redirect=false&width=9999', [],
                                        function (pic) {
                                            console.log('/picture gave' + JSON.stringify(pic))
                                            userInfo.facebookPicURL = pic.data.url
                                            $scope.$apply(function () {
                                                console.log('Loading /self in $apply')
                                                $location.path('/self')
                                            })
                                        },

                                        function (err) {
                                            console.log('Error')
                                            console.dir(err)
                                        }
                                    )
                                }
                            }
                        })
                    }

                    if (!facebook) {
                        // testing new view
                        this.homePath = '/self'
                        $location.path('/other')

                        // TODO, request the facebook link, then go to other.
                        // $location.path('/other')
                    } else {
                        facebook.login(['public_profile'], function (r) {
                                console.dir(r);
                                if (r.status === 'connected') {
                                    console.log('facebook.login gave ' + JSON.stringify(r.authResponse))

                                    facebook.api('/me', [], function (me) {
                                        console.log('fb /me gave: ' + JSON.stringify(me))

                                        userInfo.facebookProfile = me
                                        console.log('/me results:')
                                        console.dir(me)

                                        $http.post(window.host + '/loginUser', { fbId: me.id })
                                            .then(function (data) {
                                                var u = data.data;
                                                console.log('/loginUser gave ');
                                                console.dir(u);
                                                console.log("Patient");
                                                console.dir(u.patient);
                                                console.log("User");
                                                console.dir(u.user);

                                                userInfo.setUser(u.user)

                                                if (userInfo.isCaregiver()) {
                                                    userInfo.setPatient(u.patient)
                                                }

                                                console.dir(userInfo.getUser())

                                                if (!window.tagId) {
                                                    if (userInfo.isCaregiver()) {
                                                        console.log('Caregiver path')
                                                        this.homePath = '/caregiver'
                                                        $location.path('/caregiver')
                                                    } else {
                                                        console.log('Self path')
                                                        this.homePath = '/self'
                                                        $location.path('/self')
                                                    }
                                                }
                                            });
                                    })
                                }
                            },
                            function (y) {
                                console.dir(y)
                            })
                    }
                }])
    })

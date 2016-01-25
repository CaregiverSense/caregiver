/* global define */

define(['angular', 'jquery', 'app/util', 'app/phone'],
    function (angular, $, util, phone) {
        return function (module) {
            module.controller('DirectionsCtrl', ['$scope', '$http', 'userInfo', function ($scope, $http, userInfo) {
                var self = this;
                this.locations = []

                $http.post("/places/load", {userId:userInfo.getPatient().userId}).then(
                    function(rs) {
                        console.dir(rs);
                        for (var i = 0; i < rs.data.length; i++) {
                            self.locations.push(rs.data[i]);
                        }
                    }
                )

                /*
                [
                    {
                        label: 'Home',
                        address: 'Square One Mall, Mississauga, ON'
                    },
                    {
                        label: 'Clinic',
                        address: 'Alzheimer Society of Toronto, Eglinton Avenue West, Toronto, ON'
                    },
                    {
                        label: 'Church',
                        address: 'Metropolitan United Church, Queen Street East, Toronto, ON'
                    },
                    {
                        label: 'The Legion',
                        address: 'Royal Canadian Legion Branch 344, Lake Shore Boulevard West, Toronto, ON'
                    }
                ]
                */

                this.navigate = function (loc) {
                    var launchNavigator = phone.getLaunchNavigator()
                    launchNavigator && launchNavigator.navigate(loc.place.address, null, util.success(), util.failed(), {
                        navigationMode: 'turn-by-turn',
                        transportMode: 'transit'
                    })
                }
            }])
        }
    })

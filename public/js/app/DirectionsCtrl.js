/* global define */

define(['angular', 'jquery', 'app/util', 'app/phone'],
    function (angular, $, util, phone) {
        return function (module) {
            module.controller('DirectionsCtrl', ['$scope', function ($scope) {
                this.locations = [
                    {
                        name: 'Home',
                        address: 'Square One Mall, Mississauga, ON'
                    },
                    {
                        name: 'Clinic',
                        address: 'Alzheimer Society of Toronto, Eglinton Avenue West, Toronto, ON'
                    },
                    {
                        name: 'Church',
                        address: 'Metropolitan United Church, Queen Street East, Toronto, ON'
                    },
                    {
                        name: 'The Legion',
                        address: 'Royal Canadian Legion Branch 344, Lake Shore Boulevard West, Toronto, ON'
                    }
                ]

                this.navigate = function (loc) {
                    var launchNavigator = phone.getLaunchNavigator()
                    launchNavigator && launchNavigator.navigate(loc.address, null, util.success(), util.failed(), {
                        navigationMode: 'turn-by-turn',
                        transportMode: 'transit'
                    })
                }
            }])
        }
    })

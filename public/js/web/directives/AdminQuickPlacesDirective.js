define(["jquery", ], function($) {

    return function(module) {

        module.directive('adminQuickPlaces', ["$http", "$timeout", "$uibModal", function($http, $timeout, $uibModal) {
            return {
                restrict: 'E',
                templateUrl : '/template/adminQuickPlaces',
                scope : {
                    userId: '@'
                },
                link: function(scope, element, attr, ctrl) {
                    var me = scope;
                    me.entries = []
                    me.newEntry = {
                        label : ""
                    };
                    me.modal = null;

                    me.openAddPlaceDialog = function() {
                        var instance = $uibModal.open({
                            animation   : true,
                            templateUrl : 'adminQuickPlacesModal.html',
                            controllerAs : 'qp',
                            controller  : 'QuickPlacesCtrl',
                            size    : "lg"
                        });
                        instance.result.then(function() {
                            console.log("Add Places Dialog closed");
                        })
                        instance.opened.then(function() {

                        })
                    }
                }
            };
        }]).
        directive("googleMap", [function() {
            return {
                restrict: 'E',
                controller : 'GoogleMapCtrl',
                scope : {
                },
                link : function(scope, element, attrs, googleMapCtrl) {
                    googleMapCtrl.init(element);
                }
            }
        }]).
        controller("GoogleMapCtrl", ["$timeout", function($timeout) {
            var self = this;

            this.init = function(element) {
                $timeout(function() {
                    var input = document.getElementById("autocompleteSearch")
                    var map = new google.maps.Map(element.get(0), {
                        center: {lat: -34.397, lng: 150.644},
                        zoom: 8
                    });
                    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
                    var autocomplete = new google.maps.places.Autocomplete(input);

                    autocomplete.addListener('place_changed', function(e) {
                        var place = autocomplete.getPlace();
                        if (place.geometry) {
                            map.panTo(place.geometry.location);
                            map.setZoom(15);
                        }
                    });
                }, 0);
            }
        }]).
        controller('QuickPlacesCtrl', ["$document", function($document) {

        }]);
    };
});
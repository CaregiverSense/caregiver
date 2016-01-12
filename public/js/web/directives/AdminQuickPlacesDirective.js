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
                    me.newPlace = {
                        label : "",
                        // lat,
                        // lng,
                        // address
                    };
                    me.modal = null;

                    me.openAddPlaceDialog = function() {
                        var instance = $uibModal.open({
                            animation   : true,
                            templateUrl : 'adminQuickPlacesModal.html',
                            scope : scope,
                            controllerAs : 'qpm',
                            controller  : 'QuickPlacesModalCtrl',
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
                    onPlaceSelected : '&'
                },
                link : function(scope, element, attrs, googleMapCtrl) {
                    googleMapCtrl.init(element);
                }
            }
        }]).
        controller("GoogleMapCtrl", ["$scope", "$timeout", function($scope, $timeout) {
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
                            var loc = place.geometry.location;

                            $scope.$apply(function() {
                                $scope.onPlaceSelected({
                                    latlong: {lat:loc.lat(), lng:loc.lng()},
                                    address: place.formatted_address
                                });
                            })

                            map.panTo(place.geometry.location);
                            map.setZoom(15);
                        }
                    });
                }, 0);
            }
        }]).
        controller('QuickPlacesModalCtrl', ["$document", "$scope", "$http", "$uibModalInstance",
            function($document, $scope, $http, $uibModalInstance) {

            var self = this;

            self.enableUseThisPlaceButton = false;
            self.showPlaceNameTextField = false;
            self.entry = null;
            self.originalPlaceName = null;
            self.newPlaceName = null;           // Only needs to be populated by the user for new additions
            self.isNewEntry = true;             // True, unless a call to /places/find shows the lat/lng was previously stored.

            self.close = function() {
                $uibModalInstance.close();
            }

            self.placeSelected = function(latlong, address) {
                console.log("Place selected");

                self.entry = {
                    lat : latlong.lat,
                    lng : latlong.lng,
                    address : address
                };

                console.dir(self.entry);

                // A place was selected using the map widget.
                // See if the server already knows about this place.  If so, use its label.
                // If not, then prompt the user to enter a name for the place and save it.

                // Here we check the server to see if the place is already known
                $http.post("/places/find", {lat : latlong.lat, lng : latlong.lng}).
                    then(function(results) {
                        if (results.found) {
                            self.originalPlaceName = self.newPlaceName = self.entry.placeName = results.placeName;
                            self.isNewEntry = false;
                        }
                        self.showPlaceNameTextField = true;
                    })

            }

            self.isEdited = function() {
                return self.originalPlaceName != self.newPlaceName;
            }

            self.useThisPlace = function() {
                self.entry.placeName = self.newPlaceName;

                function pushAndClose() {
                    $scope.entries.push(self.entry);
                    self.close();
                }

                if (self.isEdited()) {
                    $http.post("/places/save", self.entry).
                        then(() => {
                            pushAndClose();
                        })
                } else {
                    pushAndClose();
                }
            }
        }]);
    };
});
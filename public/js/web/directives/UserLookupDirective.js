define([], function() {

    return function(module) {

        module.directive('userLookup', ["$http", "$parse", function($http, $parse) {
            return {
                restrict: 'E',
                templateUrl : '/userLookup',
                scope : {
                    selectedUserId: '=',
                    roles: '@',
                    label: '@',
                    callback: '&'
                },
                bindToController: true,
                link : function link(scope, element, attrs, controller, transcludeFn) {
                    scope.label = attrs.label;


                    scope.onSelect = function($item, $model, $label) {
                        scope.$parent.userLookupOnSelect($item);
                    }
                },
                controllerAs : "lookup",
                controller : ["$scope", "$filter", "$location", function($scope, $filter, $location) {
                    var self = this;
                    self.loading = true;
                    self.users = [];
                    $scope.selectedUserId = null;

                    $http.post("/user/loadAll", {roles:$scope.roles}).then(function(rs) {
                        if (!rs.data.error) {
                            for (var i = 0; i < rs.data.length; i++) {
                                self.users.push(rs.data[i]);
                            }
                            self.loading = false;
                        }
                    });

                    self.getUsers = function($viewValue) {
                        return $filter('filter')(self.users, {name : $viewValue});
                    }

                }]
            };
        }]);
    };
});
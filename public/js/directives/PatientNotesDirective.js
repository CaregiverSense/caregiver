define([], function() {

    return function(module) {

        module.directive('patientNotes', ["$http", function($http) {
            return {
                restrict: 'E',
                templateUrl : '/notes/template',
                scope : {
                    patientId: '@'
                },
                bindToController: true,
                controllerAs : "notes",
                controller : function () {
                    $http.post("/notes/load", {patientId:this.patientId}).then(function(rs) {

                        console.log("Loaded " + JSON.stringify(rs.data));
                        /*
                        rs.data.forEach(function(e) {

                            getNotesForDay(e, true).push(e);
                        });
                        */
                    });

                }
            };
        }]);
    };
});
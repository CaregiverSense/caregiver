define(["angular"], function() {

    return function(module) {

        module.directive('adminQuickDial', ["$http", "$timeout", function($http, $timeout) {
            return {
                restrict: 'E',
                templateUrl : '/template/adminQuickDial',
                scope : {
                    userId: '@'
                },
                link: function(scope, element, attr, ctrl) {
                    var me = scope;
                    me.entries = []
                    me.newEntry = {
                        label : "",
                        phone : "",
                        userId : scope.userId
                    };

                    $http.post("/dial/load", {userId:me.userId}).then(function(rs) {
                        me.entries = me.entries.concat(rs.data);

                        console.group("/dial/load " + me.userId);
                        console.dir(JSON.stringify(rs.data))
                        console.groupEnd();
                    });

                    me.saveNewEntry = function() {
                        //  { label, phone, userId }
                        $http.post("/dial/add", me.newEntry).then(function(r) {
                            me.newEntry.dialId = r.data.dialId;
                            me.entries.unshift(me.newEntry);
                            me.newEntry = {}
                            $timeout(function () {
                                scope.$emit('reapplyShadows');
                            });
                        });
                    }

                    me.delete = function(entry) {
                        $http.post("/dial/delete", entry).then(function(r) {
                            for (var i = 0; i < me.entries.length; i++) {
                                if (me.entries[i].dialId == entry.dialId) {
                                    me.entries.splice(i,1);
                                    break;
                                }
                            }
                        })
                    }

                    // TODO Add support for rank
                }
            };
        }]);
    };
});
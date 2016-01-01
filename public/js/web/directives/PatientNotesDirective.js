define([], function() {

    return function(module) {
        module.directive('patientNotes', ["$http", "LoginService", "$timeout", function($http, loginService, $timeout) {
            return {
                restrict: 'E',
                templateUrl : '/template/patientNotes',
                scope : {
                    userId: '@'
                },
                link: function(scope, element, attr, ctrl) {
                    var me = scope;
                    me.notes = []
                    me.newNote = "";

                    $http.post("/notes/load", {patientId:me.userId}).then(function(rs) {
                        me.notes = me.notes.concat(rs.data);

                        console.log("Loaded for ", me.userId);
                        console.dir(JSON.stringify(rs.data))
                    });

                    me.addNote = function() {
                        var newNote = {
                            content: me.newNote,
                            patientId : me.userId,
                            patientVisible : me.sharedWithPatient       // TODO support sharedWithPatient
                        };

                        $http.post("/notes/add", newNote).then(function (r) {
                            newNote.noteId = r.data.noteId;
                            me.notes.unshift(newNote);
                            $timeout(function () {
                                scope.$emit('reapplyShadows');
                            });
                        });
                    }
                }
            };
        }]);
    };
});
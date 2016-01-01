define(["angular"], function() {


    return function(module) {
        module.controller("AdminPatientCtrl", ["$http", "$filter", "$routeParams", "$scope",
                function($http, $filter, $routeParams, $scope) {

            $scope.userLookupOnSelect = function($item) {
                alert("TODO - in AdminPatientCtrl.js \u2665")
            }
            this.addCaregiver = {
                role : 'caregiver',
                placeholder : 'Add Caregiver'
            }
            this.userId = $routeParams.userId
            this.displayedPatient = false;
            this.allCaregivers = null;

            var me = this;

            $http.post("/admin/api/getCaregivers", {}).then(function(rs) {
                me.allCaregivers = rs.data;
            });

            $http.post("/admin/api/loadUser", {userId: $routeParams.userId}).then(rs => {
                var user = rs.data;
                if (user) {
                    me.displayedPatient = user;
                    if (user.fbId) {
                        me.displayedPatient['pic'] = "//graph.facebook.com/" + user.fbId + "/picture?type=normal";
                    }
                    me.loadCaregiversForPatient();

                }
            });

            this.loadCaregiversForPatient = function() {
                var patient = me.displayedPatient;
                if (patient) {
                    $http.post("/admin/api/loadCaregiversForPatient", {
                        patientId: patient.userId
                    }).then(
                        function (res) {
                            if (patient.userId) {
                                patient.caregivers = res.data.caregivers;
                            }
                        }
                    )
                }
            }

            /**
             * Assigns a caregiver to a patient.
             */
                // Unused
            this.assignCaregiverToPatient = function() {
                var caregiver = me.displayedCaregiver;
                var patient = me.displayedPatient;

                if (caregiver && patient) {
                    $http.post("/admin/api/assignCaregiverToPatient", {
                        patientId   : patient.userId,
                        caregiverId : caregiver.userId
                    }).then(function () {
                        me.loadPatientsForCaregiver();
                        me.loadCaregiversForPatient();
                    });
                }
            }



            this.unassignCaregiver = function(caregiver) {
                var patient   = me.displayedPatient;
                if (patient) {
                    $http.post("/admin/api/unassignCaregiverFromPatient", {
                        patientId   : patient.userId,
                        caregiverId : caregiver.userId
                    }).then(function (res) {
                        patient.caregivers = res.data.caregivers;
                        me.loadPatientsForCaregiver();
                    });
                }
            }


            /**
             * True if the caregiver is assigned to the patient.
             */
                // Unused
            this.isCaregiverAssignedToPatient = function() {
                var cgs = me.displayedPatient.caregivers;
                var assigned = false;
                if (cgs) {
                    for (var i = 0; i < cgs.length; i++) {
                        if (cgs[i].userId == me.displayedCaregiver.userId) {
                            assigned = true;
                        }
                    }
                }
                return assigned;
            }
        }

        ])
    }


})
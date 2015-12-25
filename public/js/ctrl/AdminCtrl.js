define(["facebook"], function() {


    return function(module) {
        module.controller("AdminCtrl", ["$http", "$filter", "$uibModal", function($http, $filter, $uibModal) {

            this.selectedPatient    = null;
            this.selectedCaregiver  = null;

            this.loadingPatients    = true;
            this.loadingCaregivers  = true;

            this.displayedCaregiver   = false;
            this.displayedPatient     = false;

            var me = this;

            this.allPatients = null;
            this.allCaregivers = null;

            $http.post("/admin/api/getPatients", {}).then(function(rs) {
                me.loadingPatients = false;
                me.allPatients = rs.data;
            });
            $http.post("/admin/api/getCaregivers", {}).then(function(rs) {
                me.loadingCaregivers = false;
                me.allCaregivers = rs.data;
            });

            this.getPatients = function($viewValue) {
                return $filter('filter')(me.allPatients, {name : $viewValue});
            };

            this.getCaregivers = function($viewValue) {
                return $filter('filter')(me.allCaregivers, {name : $viewValue});
            };

            this.caregiverAndPatientSelected = function() {
                return me.displayedCaregiver && me.displayedPatient;

            }

            this.showPatient = function($item, $model, $label) {
                return $http.post("/admin/api/loadUser", {userId: $item.userId}).then(rs => {
                    var user = rs.data;
                    if (user) {
                        me.displayedPatient = user;
                        if (user.fbId) {
                            me.displayedPatient['pic'] = "//graph.facebook.com/" + user.fbId + "/picture?type=small";
                        }
                        me.loadPatientsForCaregiver();
                        me.loadCaregiversForPatient();

                    }
                });
            }

            this.showCaregiver = function($item) {
                $http.post("/admin/api/loadUser", {userId: $item.userId}).then(rs => {
                    var user = rs.data;
                    if (user) {
                        me.displayedCaregiver = user;
                        if (user.fbId) {
                            me.displayedCaregiver['pic'] = "//graph.facebook.com/" + user.fbId + "/picture?type=small";
                        }
                        me.loadPatientsForCaregiver();
                        me.loadCaregiversForPatient();
                    }
                });
            }

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

            this.loadPatientsForCaregiver = function() {
                var caregiver = me.displayedCaregiver;
                if (caregiver) {
                    $http.post("/admin/api/loadPatientsForCaregiver", {
                        caregiverId: caregiver.userId
                    }).then(
                        function (res) {
                            if (caregiver.userId) {
                                caregiver.patients = res.data.patients;
                            }
                        }
                    )
                }
            }

            /**
             * Assigns a caregiver to a patient.
             */
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

            this.unassignPatient = function(patient) {
                var caregiver = me.displayedCaregiver;
                var cgId = caregiver.userId;
                if (caregiver) {
                    $http.post("/admin/api/unassignPatientFromCaregiver", {
                        patientId   : patient.userId,
                        caregiverId : cgId
                    }).then(function (res) {
                        caregiver.patients = res.data.patients;
                        me.loadCaregiversForPatient();
                    });
                }
            }

            this.getAssignCaregiverButtonText = function() {
                return (me.isCaregiverAssignedToPatient()) ? "Assigned!" : "Assign to " + me.displayedPatient.name;
            }

            this.getAssignCaregiverButtonClass = function() {
                return (me.isCaregiverAssignedToPatient()) ? "btn-success disabled" : "btn-primary";
            }

            /**
             * True if the caregiver is assigned to the patient.
             */
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

            /*
               Add a caregiver

             */
            this.addCaregiver = function() {
                $uibModal.open({
                    animation : true,
                    templateUrl : 'addCaregiver.html',
                    controller : 'AddCaregiverModalCtrl as addcg',
                    size : 'md',
                    resolve : {
                        // Use this to pass locals into the modal ctrlr
                    }

                })
            }
        }

        ]).
        controller("AddCaregiverModalCtrl", ["$uibModalInstance", "$http", function($uibModalInstance, $http) {
                var me = this;
                this.name = "";
                this.email = "";
                this.phoneNumber = "";

                this.ok = function() {
                    // TODO confirm to the user that the caregiver has been contacted.
                    $http.post("/admin/api/addCaregiver", {name : me.name, email : me.email, phoneNumber : me.phoneNumber}).
                        then(function() {
                            $uibModalInstance.close(/*TODO return the user*/);
                        });
                }
                this.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                }

        }]);
    }


})
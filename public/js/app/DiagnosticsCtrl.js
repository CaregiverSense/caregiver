/**
 * Created by Tatiana on 11/8/2015.
 */
define(["angular", "jquery"], function(angular, $) {

    return function(module) {

        module.controller("DiagnosticsCtrl", ["$sce", "userInfo", "$http", function($sce, userInfo, $http) {

            console.log("Loaded DiagnosticsCtrl");
            var me = this;
            this.mocaScore = "";
            this.mmseScore = "";
            this.patient = userInfo.getPatient();
            this.allergies = [];


            // Get the MOCA results
            $http.post("/profile/moca", {userId:this.patient.userId}).then(function(results) {
                me.mocaScore = results.data.score;
            });

             //Get the MMSE results
            $http.post("/profile/mmse", {userId:this.patient.userId}).then(function(results) {
                me.mmseScore = results.data.score;
            });

            //Get the allergies results
            $http.post("/profile/allergies", {userId:this.patient.userId}).then(function(results) {
                me.allergies = results.data;
            });
        }]);

    };

});
/* global define */


define(['angular', 'app/phone', 'moment'], function (angular, phone, moment) {
    return function (module) {
        module.controller('NotesCtrl', ['$scope', '$http', 'userInfo', function ($scope, $http, userInfo) {

            var me = this;
            this.isCaregiver = userInfo.isCaregiver();
            this.notes = [];
            this.sharedWithPatient = false;

            /*
             phone.getNFC().addNdefListener(function(e) {
             console.dir(e)
             }, function() {console.log("Yes")}, function(){console.log("No")});

             {
                "dateYYYYMMDD" : [
                    {content, from, time}
                ]
            }
            */

            var notesByDate = {};
            this.lookupDates = [];
            this.newNote = "";

            function getNotesForDay(e, shift) {

                var baseDate = moment(new Date(e.lastUpdated)).startOf("day").toDate();
                // For each lookup date, have a list of notes from the day.
                // ng-repeat over the dates {date : baseDate, note : notes}

                var lookupDate = "date" + moment(new Date(e.lastUpdated)).format("YYYYMMDD");
                var day;
                if (notesByDate[lookupDate]) {
                    day = notesByDate[lookupDate];
                } else {
                    day = [];
                    notesByDate[lookupDate] = day;
                    if (shift) {
                        me.lookupDates.push(baseDate);
                    } else {
                        me.lookupDates.unshift(baseDate);
                    }
                }
                return day;
            }

            $http.post("/notes/load", {forUserId:userInfo.getPatient().userId}).then(function(rs) {

                console.log("Loaded " + JSON.stringify(rs.data));
                rs.data.forEach(function(e) {
                    getNotesForDay(e, true).push(e);
                });
                console.dir(notesByDate);
                console.log("Lookup dates");
                console.dir(me.lookupDates);
            });

            /*
            function sortNotes (notes) {
                notes.sort(function (a, b) {
                    return b.lastUpdated - a.lastUpdated
                })
            }
            */

            this.isNotSelfNote = function(note) {
                return note.forUserId != userInfo.getUser().userId;
            },

            this.getNotesForDate = function(lookupDate) {
                var dateKey = "date"+moment(lookupDate).format("YYYYMMDD");
                var notes = notesByDate[dateKey];
                console.log("Notes for " + dateKey);
                console.dir(notes);
                return notes;
            },

            this.addNote = function () {
                /*
                 *  content
                 *  lastUpdated
                 *  byUserId
                 *  forUserId
                 *  patientVisible

                 */
                var newNote = {
                    content: me.newNote,
                    lastUpdated: new Date(),
                    byUserId : userInfo.getUser().userId,
                    forUserId : userInfo.getPatient().userId,
                    patientVisible : me.sharedWithPatient
                };
                getNotesForDay(newNote, false).unshift(newNote);

                $http.post("/notes/add", newNote).then(function(r) {
                    var data = r.data;
                    console.log("Note added");
                });

            }

        }])
    }
})

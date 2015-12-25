/**
 * Created by Tatiana on 11/7/2015.
 */
define(["moment", "app/phone"], function(moment, phone) {

    return function(module) {

        module.controller("ScheduleCtrl", ["$http", "userInfo", function($http, userInfo) {
            var me = this;
            this.setDateDisplay = function () {
                var viewed = me.today;
                var current = moment(me.viewDate);

                if (viewed.isSame(current)) {
                    me.todayDateDisplay = "Today!";
                } else {
                    me.todayDateDisplay = viewed.to(current);
                }
            };

            this.viewDate =  moment(new Date()).startOf('day').toDate();
            this.today = moment(new Date()).startOf('day');
            this.setDateDisplay();

            if (userInfo.isCaregiver())
                this.isCaregiver = true;
            else
                this.isCaregiver = false;

            this.schedule= [];

            this.loadDate = function() {
                $http.post("/schedule/load", {
                    userId : userInfo.getPatient().userId,
                    loadDate : me.viewDate
                }).then(function(r) {
                    var data = r.data;

                    console.dir(data);
                    me.schedule.length = 0;
                    for (var d = 0; d < data.length; d++) {
                        var tempor = data[d];

                        me.schedule.push(data[d]);
                    }
                    console.log("Schedules is ");
                    console.dir(me.schedule)
                    /*
                     data has:
                     id
                     name,
                     description,
                     creator,
                     directions,
                     date,
                     time,
                     completed,
                     */
                });
            }
            this.loadDate();

            this.showDirections = function(item) {
                return item.directions;
            };


            this.isCompleted = function(item) {
                item.completed = !item.completed;
                $http.post("/schedule/completed", {
                    schedId :item.schedId,
                    userId : userInfo.getUser().userId,
                    completed: item.completed
                }).then(function(r) {
                    // Remove from page
                });

            }

            this.toggleDetails = function(item, $event) {
                    item.showDetails = !item.showDetails;
                console.log("oh");
                $event.preventDefault();
            };

            this.openYesterday = function() {
                var y = moment(this.viewDate).subtract(1, 'day');
                this.viewDate = y.toDate();
                me.setDateDisplay();
                me.loadDate();
            };

            this.openTomorrow = function() {
                var y = moment(this.viewDate).add(1, 'day');
                this.viewDate = y.toDate();
                me.setDateDisplay();
                me.loadDate();
            };

            this.delete = function(item) {
                this.schedule.splice(item.id);
                console.log(item.schedId);
                $http.post("/schedule/delete", {
                    schedId :item.schedId,
                    userId : userInfo.getUser().userId
                }).then(function(r) {
                    // Remove from page
                });
            }

            this.locate = function(item) {
                    var launchNavigator = phone.getLaunchNavigator()
                    launchNavigator && launchNavigator.navigate(item.directions, null, y, n, {
                        navigationMode: 'turn-by-turn',
                        transportMode: 'transit'
                    })
                }


            this.addTask = function (task) {
                // TODO: server
                console.log("Saving:")
                console.dir(task);

                // client

                if (task.name && task.description && task.date && task.time){
                    console.log("added");

                    var uploadThis = {
                        toUserId : userInfo.getPatient().userId,
                        fromUserId : userInfo.getUser().userId,
                        time: task.time,
                        date: task.date,
                        name: task.name,
                        description: task.description,
                        directions: task.directions
                    };
                    this.schedule.push(uploadThis);
                    $http.post("/schedule/save", uploadThis).then(function(rs) {
                        console.log("/schedule/save gave: ");
                        console.dir(rs.data);
                        me.addingTask = false;
                    });
                }
                me.loadDate();
           }
        }]);


    }

});

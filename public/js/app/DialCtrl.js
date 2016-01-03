/* global define */

define(['angular'], function (angular) {
    return function (module) {
        module.controller('DialCtrl', ['$scope', '$http', 'userInfo', function ($scope, $http, userInfo) {
            var me = this;

            var userId = userInfo.getUser().userId;
            this.numbers = [];

            $http.post("/dial/load", {userId : userId}).
                then(function(rs) {
                    me.numbers = rs.data;
                })



            /*
            this.numbers = [
                {
                    title: 'Home',
                    number: '+1-647-929-4949',
                    link : '/img/house.gif'
                },
                {
                    title: 'CCAC',
                    number: '+310-2222',
                    link : '/img/ccac.gif'
                },
                {
                    title: 'WheelTrans',
                    number: '+1-416-123-5678',
                    link : '/img/wheeltrans.gif'
                },
                {
                    title: 'Laura',
                    number: '+1-416-123-5678',
                    link : '/img/nurse.gif'
                }
            ]
            */

            this.call = function (number) {
                window.parent.location.href = 'tel:' + number.phone
            }

            this.addNumber = function (number) {
                // TODO: server

                // client

                if (number.label && number.phone) {
                    var newQuickDialEntry = {
                        label:  number.label,
                        phone:  number.phone,
                        userId: userId
                    };

                    $http.post("/dial/add", newQuickDialEntry).
                        then(function(rs) {
                            newQuickDialEntry.dialId = rs.data.dialId;
                            me.numbers.push(newQuickDialEntry);
                        })
                }

                me.addingNumber = false
            }

            this.editNumber = function (number) {
                // TODO: edit
            }

            this.removeNumber = function (number) {
                this.numbers = this.numbers.filter(function(x) {
                    return x.title !== number.title
                })
            }
        }])
    }
})

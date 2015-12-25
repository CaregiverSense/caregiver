/* global define */

define(['angular', 'jquery', 'moment', 'app/phone'], function (angular, $, moment, phone) {
    return function (module) {
        module.controller('LaundryCtrl', ['$scope', '$interval', function ($scope, $interval) {
            var me = this

            me.timerActive = false
            me.timeRemaining = 1
            me.timer = null
            me.timeDisplay = ''

            this.notify = function (mins, message, demo) {
                me.timerActive = true
                me.timeRemaining = demo ? 5 : mins * 60

                me.updateDisplay()
                me.timer = $interval(function () {
                    me.timeRemaining -= 1
                    console.log()
                    me.updateDisplay()
                    if (me.timeRemaining < 0) {
                        me.timeDisplay = ''
                        me.stopTimer()
                    }
                }, 1000)

                phone.getLocalNotification().schedule({
                    id: 10,
                    title: message,
                    // text: message + ".txt",
                    at: moment().add(me.timeRemaining, 'seconds').toDate()
                })
            }

            this.updateDisplay = function () {
                var mins = parseInt(me.timeRemaining / 60)
                var secs = me.timeRemaining % 60
                var s = secs < 10 ? '0' + secs : '' + secs
                me.timeDisplay = mins + ':' + s
            }

            this.stopTimer = function () {
                me.timeRemaining = 0
                me.timerActive = false
                $interval.cancel(me.timer)
            }

            $scope.$on('$destroy', function () {
                $interval.cancel(me.timer)
            })
        }])
    }
})

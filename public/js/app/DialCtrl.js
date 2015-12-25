/* global define */

define(['angular'], function (angular) {
    return function (module) {
        module.controller('DialCtrl', ['$scope', function ($scope) {
            var me = this;
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

            this.call = function (number) {
                window.parent.location.href = 'tel:' + number.number
            }

            this.addNumber = function (number) {
                // TODO: server

                // client

                if (number.title && number.number) {
                    me.numbers.push({
                        title: number.title,
                        number: number.number
                    })
                }

                me.addingNumber = false
            }

            this.editNumber = function (number) {
                // TODO: edit
            }

            this.removeNumber = function (number) {
                this.numbers = this.numbers.filter(function (x) {
                    return x.title !== number.title
                })
            }
        }])
    }
})

/* global requirejs */

console.log('main.js is loaded :)')

requirejs.config({
    baseUrl : '/js/web',
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'angular': '/bower_components/angular/angular.min',
        'moment': '/bower_components/moment/min/moment.min',
        'angular-route': '/bower_components/angular-route/angular-route.min',
        'angular-animate': '/bower_components/angular-animate/angular-animate.min',
        'facebook': '//connect.facebook.net/en_US/sdk',
        'ui.bootstrap' : '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min'

    },
    config: {
        moment: {
            noGlobal: true
        }
    },
    shim: {
        moment: {
            exports: 'moment'
        },
        jquery: {
            exports: '$'
        },
        angular: {
            exports: 'angular',
            deps: ['jquery']
        },
        'angular-route': ['angular'],
        'angular-animate': ['angular'],
        'ui.bootstrap': ['angular'],
        'facebook' : {
            exports : 'FB'
        }

    }


})

requirejs([
    'angular',
    'jquery',
    'ui.bootstrap',
    'ctrl/GroundWebCtrl',
    'fb'
], function (angular) {
    console.log('Have angular? ' + typeof (angular))

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['OpalWhale.Web'])
    })
})

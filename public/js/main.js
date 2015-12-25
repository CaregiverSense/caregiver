/* global requirejs */

console.log('main.js is loaded :)')

requirejs.config({
    paths: {
        'jquery': 'lib/jquery.min',
        '_': 'lib/lodash.min',
        'angular': 'lib/angular.min',
        'moment': 'lib/moment.min',
        'angular-route': 'lib/angular-route.min',
        'angular-animate': 'lib/angular-animate.min'
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
        'app/util': {
            exports: 'util'
        }
    }
})

requirejs(['app/GroundCtrl', 'angular', 'angular-route', 'angular-animate', 'app/util'], function (opalWhale, angular) {
    console.log('Have angular? ' + typeof (angular))

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['OpalWhale'])
    })
})

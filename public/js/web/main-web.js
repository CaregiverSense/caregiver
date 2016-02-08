/* global requirejs */

console.log('main.js is loaded :)')

requirejs.config({
    baseUrl : '/js/web',
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'jqueryui': '../lib/jquery.ui.min',
        'angular': '/bower_components/angular/angular.min',
        'moment': '/bower_components/moment/min/moment.min',
        'angular-route': '/bower_components/angular-route/angular-route.min',
        'angular-animate': '/bower_components/angular-animate/angular-animate.min',
        'angular-ui-sortable': '/bower_components/angular-ui-sortable/sortable.min',
        'okshadow' : '/js/lib/okshadow.min',
        'facebook': '//connect.facebook.net/en_US/sdk',
        'googleMaps' : '//maps.googleapis.com/maps/api/js?key=AIzaSyB-t3Vx0r6XYbDogrE5K7A3v6-RKiptZ7A&libraries=places',
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
        'jqueryui': ['jquery'],
        'okshadow' : ['jquery'],
        'angular-route': ['angular'],
        'angular-animate': ['angular'],
        'angular-ui-sortable': ['angular', 'jqueryui'],
        'ui.bootstrap': ['angular'],
        'facebook' : {
            exports : 'FB'
        }

    }


})

requirejs([
    'angular',
    'jquery',
    'jqueryui',
    'ui.bootstrap',
    'angular-ui-sortable',
    'ctrl/GroundWebCtrl',
    'fb',
    'okshadow',
    'googleMaps'
], function (angular, $) {
    console.log('Have angular? ' + typeof (angular))

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['OpalWhale.Web'])
    })
})

/**
 * Created by gthardy on 8/20/14.
 */
'use strict';

var app = angular.module('RescueMe', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        $routeProvider

            // Home Page
            .when('/', {
                templateUrl: '/views/main/index.html',
                controller: 'mainController'
            })

            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
}]);
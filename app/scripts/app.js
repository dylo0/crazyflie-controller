'use strict';

/**
 * @ngdoc overview
 * @name crazyfliePadApp
 * @description
 * # crazyfliePadApp
 *
 * Main module of the application.
 */
angular
  .module('crazyfliePadApp', [
    'ngResource',
    'ngRoute',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

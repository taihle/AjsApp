// ------------------------------------------------------------------------------
// Author: Tai H. Le <taihle@gmail.com>
//
// Application entry point and control
//
// ------------------------------------------------------------------------------
var ajsApp = angular.module('ajsApp', ['ui.router', 'ngSanitize', 'ngMaterial', 
    'LocalStorageModule', 'ajs-log', 'ajs-cache', 'ajs-util']);

ajsApp.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, 
    $httpProvider, localStorageServiceProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'mainCtrl'
        })
        .state('settings', {
            url: '/',
            templateUrl: 'views/settings.html',
            controller: 'settingsCtrl'
        })
        .state('profile', {
            url: '/',
            templateUrl: 'views/profile.html',
            controller: 'profileCtrl'
        });

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')

    $httpProvider.defaults.withCredentials = true;

    localStorageServiceProvider.setPrefix('ajsApp');
});

ajsApp.run(function (ajsLog) {
    if (ajsLog.isEnabledDebug()) ajsLog.debug("ajsApp.run():");
});
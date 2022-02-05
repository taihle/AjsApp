// ------------------------------------------------------------------------------
// Copyright (c) 2018 - All Rights Reserved.
// Author: Tai H. Le <taihle@gmail.com>
// ------------------------------------------------------------------------------
ajsApp.controller('mainCtrl', function ($rootScope, $scope, $state, $timeout, $mdSidenav, 
    ajsLog, myHelper, ajsApi) {

    $scope.$on('$viewContentLoaded', function (evt) {
        ajsLog.debug("mainCtrl.$viewContentLoaded(): ");
    	// if (!$rootScope.currentUser) {
		// 	ajsApi.relogin(function(user){
        //         $rootScope.currentUser = user;
        //         init();
        //         $rootScope.initLogService();
		// 	}, function(){
        //         $scope.login();
        //     });
        // }
        // else {
        //     init();
        // }
    });

    $scope.$on('$destroy', function () {
        ajsLog.debug("mainCtrl.$destroy():");
    });

    function init() {
        ajsLog.debug("mainCtrl.init(): ");
        ajsApi.getAvailableDevices(function(deviceIds) {
            $rootScope.populateDevicesList(deviceIds);
        });
    };

    $scope.gotoMain = function (ev) {
        $state.go('main');
    };

    $scope.viewProfile = function (ev) {
        $state.go('profile');
    };

    $scope.viewSettings = function (ev) {
        $state.go('settings');
    };

    $scope.login = function (ev) {
        ajsLog.debug("mainCtrl.login():");
        myHelper.showLoginDialog(ev, function (user) {
            if (user) {
                $rootScope.currentUser = user;
                $rootScope.$broadcast('login_changed');
                init();
            }
        });
    };

    $scope.logoff = function (ev) {
        ajsLog.debug("mainCtrl.logoff():");
        ajsApi.logout(function () {
            $rootScope.currentUser = undefined;
            $rootScope.$broadcast('login_changed');
            $rootScope.resetDevicesList();
        });
    };

    $scope.openUserMenu = function ($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

    $scope.toggleSidenav = buildToggler('sidenavleft');

    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

});

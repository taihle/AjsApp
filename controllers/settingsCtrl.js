// ------------------------------------------------------------------------------
// Copyright (c) 2018 - All Rights Reserved.
// Author: Tai H. Le <taihle@gmail.com>
// ------------------------------------------------------------------------------
ajsApp.controller('settingsCtrl', function ($scope, $state, ajsLog, ajsApi) {

    $scope.config = JSON.parse(JSON.stringify(ajsApi.Config));
    
    $scope.$on('$viewContentLoaded', function (evt) {
        ajsLog.debug("settingsCtrl.$viewContentLoaded(): ");
        $scope.config.Server = $scope.config.Server.replace("/api", "");
    });

    $scope.close = function () {
        $state.go('main');
    };

    $scope.save = function (ev) {
        ajsLog.debug("settingsCtrl.save(): ");
        ajsApi.updateConfig($scope.config);
        $scope.close();
    };

});

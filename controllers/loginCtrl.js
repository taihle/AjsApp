// ------------------------------------------------------------------------------
// Copyright (c) 2018 - All Rights Reserved.
// Author: Tai H. Le <taihle@gmail.com>
// ------------------------------------------------------------------------------
ajsApp.controller('loginCtrl', function ($scope, $mdDialog, ajsLog, ajsApi) {

    $scope.username;
    $scope.password;
    $scope.error = '';

    $scope.close = function () {
        $mdDialog.cancel();
    };

    $scope.login = function () {    
        ajsApi.login({ username: this.username, password: this.password },
            function (s) {
                ajsLog.debug("login(): ok - " + JSON.stringify(s));
                if (s && s.username) {
                    $mdDialog.hide(s);
                }
                else {
                    this.error = "Unknow Error!"
                }
            },
            function (f) {
                $scope.error = f.data;
            }
        );            
    };

    $scope.forgotPassword = function() {
        ajsApi.resetPassword({}, function(r){
            this.error = r;
        });
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
});

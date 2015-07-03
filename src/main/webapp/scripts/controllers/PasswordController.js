
bootstrapControllers.controller('PasswordController',['$scope', 'Password', function ($scope, Password) {
    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.different = null;
    $scope.changePassword = function () {
        if ($scope.ctrl.oldPassword == $scope.ctrl.password == $scope.confirmPassword || $scope.ctrl.oldPassword == $scope.ctrl.password ) {
            $scope.different = true;
        }
        if ($scope.ctrl.password != $scope.confirmPassword) {
            $scope.doNotMatch = "ERROR";
        } else {
            $scope.different = null;
            $scope.doNotMatch = null;
            Password.save($scope.ctrl.password,
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = 'OK';
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        }
    };
}]);

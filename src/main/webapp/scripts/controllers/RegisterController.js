

bootstrapControllers.controller('RegisterController',['$scope', '$translate', 'PublicRegister', '$location', 'Notification', function ($scope, $translate, PublicRegister, $location, Notification) {
    $scope.registerAccount = {
        gender: 'male'
    };
    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.errorUserExists = null;
    $scope.register = function () {
        if ($scope.registerAccount.password != $scope.confirmPassword) {
            $scope.doNotMatch = "ERROR";
        } else {
            $scope.registerAccount.langKey = $translate.use();
            $scope.doNotMatch = null;
            $scope.success = null;
            $scope.error = null;
            $scope.errorUserExists = null;
            $scope.errorEmailExists = null;
            PublicRegister.save($scope.registerAccount,
                function (value, responseHeaders) {
                    $scope.success = 'OK';
                    Notification.success('<strong>Registration saved!</strong> Please check your email for confirmation.');
                    $location.path('/');
                },
                function (httpResponse) {
                    if (httpResponse.status === 400 && httpResponse.data === "login already in use") {
                        $scope.error = null;
                        $scope.errorUserExists = "ERROR";
                    } else if (httpResponse.status === 400 && httpResponse.data === "e-mail address already in use") {
                        $scope.error = null;
                        $scope.errorEmailExists = "ERROR";
                    } else {
                        $scope.error = "ERROR";
                    }
                });
        }
    }
}]);
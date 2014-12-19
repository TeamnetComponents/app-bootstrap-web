
bootstrapControllers.controller('HealthController',['$scope', 'HealthCheckService', function ($scope, HealthCheckService) {
    $scope.updatingHealth = true;

    $scope.refresh = function () {
        $scope.updatingHealth = true;
        HealthCheckService.check().then(function (promise) {
            $scope.healthCheck = promise;
            $scope.updatingHealth = false;
        }, function (promise) {
            $scope.healthCheck = promise.data;
            $scope.updatingHealth = false;
        });
    };

    $scope.refresh();

    $scope.getLabelClass = function (statusState) {
        if (statusState == 'UP') {
            return "label-success";
        } else {
            return "label-danger";
        }
    }
}]);
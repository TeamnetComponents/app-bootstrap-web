
bootstrapControllers.controller('LogsController',['$scope', 'resolvedLogs', 'LogsService',
    function ($scope, resolvedLogs, LogsService) {
    $scope.loggers = resolvedLogs;

    $scope.changeLevel = function (name, level) {
        LogsService.changeLevel({name: name, level: level}, function () {
            $scope.loggers = LogsService.findAll();
        });
    }
}]);
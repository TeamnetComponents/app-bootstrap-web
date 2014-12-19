
bootstrapControllers.controller('ConfigurationController',['$scope', 'resolvedConfiguration',
    function ($scope, resolvedConfiguration) {
    $scope.configuration = resolvedConfiguration;
}]);
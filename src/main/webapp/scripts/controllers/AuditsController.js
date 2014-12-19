
bootstrapControllers.controller('AuditsController',['$scope', '$translate', '$filter', 'AuditsService',
    function ($scope, $translate, $filter, AuditsService) {
    $scope.onChangeDate = function () {
        AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function (data) {
            $scope.audits = data;
        });
    };

    // Date picker configuration
    $scope.today = function () {
        // Today + 1 day - needed if the current day must be included
        var today = new Date();
        var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // create new increased date

        $scope.toDate = $filter('date')(tomorrow, "yyyy-MM-dd");
    };

    $scope.previousMonth = function () {
        var fromDate = new Date();
        if (fromDate.getMonth() == 0) {
            fromDate = new Date(fromDate.getFullYear() - 1, 0, fromDate.getDate());
        } else {
            fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
        }

        $scope.fromDate = $filter('date')(fromDate, "yyyy-MM-dd");
    };

    $scope.today();
    $scope.previousMonth();

    AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function (data) {
        $scope.audits = data;
    });
}]);

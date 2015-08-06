bootstrapControllers
    .controller('NavController', ['$scope', 'Account', function ($scope, Account) {
        $scope.checkIfFunctionHaveRights = false;
        $scope.organizationIsEnable = false;
        $scope.organizationalUnitIsEnable = false;

        $scope.$on("event:getAccountInformation", function (event, args) {
            if (args.moduleRights.function_READ_ACCESS != null) {
                $scope.checkIfFunctionHaveRights = true;
            } else {
                $scope.checkIfFunctionHaveRights = false;
            }

            if (args.moduleRights.organization_READ_ACCESS != null) {
                $scope.organizationIsEnable = true;
            } else {
                $scope.organizationIsEnable = false;
            }

            if (args.moduleRights.organizationalUnit_READ_ACCESS != null) {
                $scope.organizationalUnitIsEnable = true;
            } else {
                $scope.organizationalUnitIsEnable = false;
            }
        });
    }]);
bootstrapControllers.controller('MainController', ['$scope', '$rootScope', '$http',  function ($scope, $rootScope, $http) {
    $http.get('ou/ou.json').then(
        function () {
            $rootScope.displayOUs = true;
        },
        function () {
            $rootScope.displayOUs = false;
        }
    );
}]);

bootstrapServices.factory('HealthCheckService',['$rootScope', '$http', function ($rootScope, $http) {
    return {
        check: function() {
            return $http.get('health').then(function (response) {
                return response.data;
            });
        }
    };
}]);

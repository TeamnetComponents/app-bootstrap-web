
bootstrapServices.factory('MetricsService',['$http',function ($http) {
    return {
        get: function() {
            return $http.get('metrics/metrics').then(function (response) {
                return response.data;
            });
        }
    };
}]);
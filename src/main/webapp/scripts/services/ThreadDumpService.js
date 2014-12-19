
bootstrapServices.factory('ThreadDumpService',['$http', function ($http) {
    return {
        dump: function() {
            return $http.get('dump').then(function (response) {
                return response.data;
            });
        }
    };
}]);
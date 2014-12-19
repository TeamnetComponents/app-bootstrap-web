
bootstrapServices.factory('AuditsService',['$http', function ($http) {
    return {
        findAll: function() {
            return $http.get('app/rest/audits/all').then(function (response) {
                return response.data;
            });
        },
        findByDates: function(fromDate, toDate) {
            return $http.get('app/rest/audits/byDates', {params: {fromDate: fromDate, toDate: toDate}}).then(function (response) {
                return response.data;
            });
        }
    }
}]);

bootstrapServices.factory('LogsService',['$resource', function ($resource) {
    return $resource('app/rest/logs', {}, {
        'findAll': { method: 'GET', isArray: true},
        'changeLevel':  { method: 'PUT'}
    });
}]);
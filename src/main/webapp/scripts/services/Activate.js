
bootstrapServices.factory('Activate',['$resource', function ($resource) {
    return $resource('app/rest/activate', {}, {
        'get': { method: 'GET', params: {}, isArray: false}
    });
}]);

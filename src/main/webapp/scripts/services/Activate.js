
bootstrapServices.factory('Activate',['$resource', function ($resource) {
    return $resource('app/rest/activateAccount/activate', {}, {
        'get': { method: 'GET', params: {}, isArray: false}
    });
}]);

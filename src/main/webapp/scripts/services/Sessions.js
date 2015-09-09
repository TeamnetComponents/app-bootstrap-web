
bootstrapServices.factory('Sessions',['$resource', function ($resource) {
    return $resource('app/rest/adminAccount/sessions/:series', {}, {
        'get': { method: 'GET', isArray: true}
    });
}]);
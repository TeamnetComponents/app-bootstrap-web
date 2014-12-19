
bootstrapServices.factory('Sessions',['$resource', function ($resource) {
    return $resource('app/rest/account/sessions/:series', {}, {
        'get': { method: 'GET', isArray: true}
    });
}]);
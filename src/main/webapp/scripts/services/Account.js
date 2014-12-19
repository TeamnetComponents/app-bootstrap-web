
bootstrapServices.factory('Account',['$resource', function ($resource) {
    return $resource('app/rest/account', {}, {
    });
}]);


bootstrapServices.factory('PublicRegister',['$resource', function ($resource) {
    return $resource('app/rest/publicAccount/register', {}, {
    });
}]);

bootstrapServices.factory('Register',['$resource', function ($resource) {
    return $resource('app/rest/register', {}, {
    });
}]);
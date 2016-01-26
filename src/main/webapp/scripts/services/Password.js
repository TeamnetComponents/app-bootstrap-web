
bootstrapServices.factory('Password',['$resource', function ($resource) {
    return $resource('app/rest/account/changePassword', {}, {
    });
}]);

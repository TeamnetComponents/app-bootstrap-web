bootstrapServices.factory('Module',['$resource', function ($resource) {
    return $resource('app/rest/module/:moduleId', {moduleId: '@id'}, {
    });
}]);

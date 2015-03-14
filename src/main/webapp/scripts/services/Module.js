bootstrapServices.factory('Module',['$resource', function ($resource) {
    return $resource('module/rest/modules/:moduleId', {moduleId: '@id'}, {
    });
}]);

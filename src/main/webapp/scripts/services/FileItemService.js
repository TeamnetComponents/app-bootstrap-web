bootstrapServices.factory('FileItem',['$resource', function ($resource) {
    return $resource('/app/rest/downloadFile/fileInfo/:fileMasterId', {}, {
        'get': { method: 'GET', params: {}, isArray: true}
    });
}]);
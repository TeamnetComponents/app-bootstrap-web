bootstrapServices.factory('Permission',['$resource', function ($resource) {
    return $resource('app/rest/module/:moduleId',{}, {
        'update': {method: 'POST'},
        'getAllModulesWithModuleRights': {
            url: 'app/rest/module/rights',
            method: 'GET',
            isArray: true
        },
        'getModuleRights': {
            url: '/app/rest/modulerights',
            method: 'GET',
            isArray: true
        },
        'getModuleRightCodes': {
            url: 'app/rest/modulerights/codes',
            method: 'GET',
            isArray: true
        }
    })
}]);

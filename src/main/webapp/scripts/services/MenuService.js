bootstrapServices.factory('MenuService',['$resource', function ($resource) {
    return {
        action: $resource('data/rest/menu', {}, {
            'save': { method: 'POST' },
            'delete': { method: 'DELETE' }
        }),
        simple: $resource('data/rest/menu-tree/:id', {}, {
            'findAll': { method: 'GET', isArray: true },
            'findOne': { method: 'GET', isArray: true }
        }),
        roles: $resource('data/rest/menu/authorities', {}, {
            'findAllRoles': { method: 'GET', isArray: true }
        }),
        bulk: $resource('data/rest/menu/bulk-update', {}, {
            'updateSortNo': { method: 'POST' }
        })
    };
}]);
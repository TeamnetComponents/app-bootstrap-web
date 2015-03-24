/**
 * Created by mihai.vaduva on 3/2/15.
 */
bootstrapServices.factory('Role',['$resource', function ($resource) {
    return $resource('role/rest/roles/:roleId', {}, {
        'update' : {method: 'PUT'}
    });
}]);
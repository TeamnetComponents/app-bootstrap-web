/**
 * Created by mihai.vaduva on 3/2/15.
 */
bootstrapServices.factory('Role',['$resource', function ($resource) {
    return $resource('app/rest/role/:roleId', {}, {
        'update' : {method: 'PUT'},
        'getAll' :{
            url:'app/rest/role',
            method:'GET',
            isArray: true
        }
    });
}]);
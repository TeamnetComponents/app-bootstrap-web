/**
 * Created by Florin.Cojocaru on 7/15/2015.
 */
bootstrapServices.factory('Function',['$resource', function ($resource) {
    return $resource('app/rest/function/:functionId', {}, {
        'update' : {method: 'PUT'},
        'getAll' :{
            url:'app/rest/function',
            method:'GET',
            isArray: true
        }
    });
}]);
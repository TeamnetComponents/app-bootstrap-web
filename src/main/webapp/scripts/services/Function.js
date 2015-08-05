/**
 * Created by Florin.Cojocaru on 7/15/2015.
 */
bootstrapServices.factory('Function',['$resource', function ($resource) {

       return $resource('app/rest/function/:functionId', {}, {

           'update' : {
               method: 'PUT'
           },
           'getAll' : {
               url:'app/rest/function/allWithModuleRights',
               method:'GET',
               isArray: true
           },
           'getById' : {
               url:'app/rest/function/:id',
               method:'GET'
           },
           'getByCode' : {
               url:'app/rest/function/functionByCode/:code',
               method:'GET'
           }
    });
}]);
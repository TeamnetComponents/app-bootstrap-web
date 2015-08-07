/**
 * Created by Florin.Cojocaru on 7/15/2015.
 */
bootstrapServices.factory('Function',['$resource', function ($resource) {

       return $resource('app/rest/function/:id', {}, {

           'update' : {
               method: 'PUT'
           },
           'getAll' : {
               url:'app/rest/function/allWithModuleRights',
               method:'GET',
               isArray: true
           },
           'getById' : {
               method:'GET'
           },
           'getByCode' : {
               url:'app/rest/function/functionByCode/:code',
               method:'GET'
           }
    });
}]);
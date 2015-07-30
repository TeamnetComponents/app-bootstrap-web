/**
 * Created by Florin.Cojocaru on 7/15/2015.
 */
bootstrapServices.factory('FunctionMock', function () {
    var mockFunctions = [
        {
            "id":1,
            "code":"Function_SYSTEM",
            "description":"System Function",
            "validFrom":"2012-07-08",
            "validTo":"2050-05-03",
            "active":true,
            "moduleRights": [
                {
                    "id":12,
                    "version":1,
                    "right":1,
                    "moduleRightCode": "READ_ACCESS"
                },
                {
                    "id":11,
                    "version":1,
                    "right":1,
                    "moduleRightCode":"READ_ACCESS"
                }]
        },
        {
            "id":2,
            "code":"Function_User",
            "description":"User Function",
            "validFrom":"2012-01-01",
            "validTo":"2050-12-08",
            "active":true,
            "moduleRights": [
                {
                    "id":23,
                    "version":1,
                    "right":1,
                    "moduleRightCode": "READ_ACCESS"
                },
                {
                    "id":1,
                    "version":1,
                    "right":1,
                    "moduleRightCode":"READ_ACCESS"
                }]
        }];
    var getFunction = function(query, callback) {
         mockFunctions.forEach(function(item) {
             if (angular.equals(item.id, query.functionId)){
                 callback(item);

             }
             //console.log('item with' + query.functionId + 'not in list!')

         })

    };
    var getAllFunctions = function(cfg, callback) {
        if(typeof(cfg) == 'function') {
            cfg(mockFunctions);
        }else{
            callback(mockFunctions);
        }

    };

    return {
        'update' : {method: 'PUT'},
        'getAll' : getAllFunctions,
        'get' : getFunction
    };
});
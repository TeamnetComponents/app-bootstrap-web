
bootstrapServices.factory('Account',['$resource', function ($resource) {
    return $resource('app/rest/account', {}, {
        'getByLogin': {
            url:'app/rest/account/:login',
            method: 'GET'
        },
        'getAllAccounts': {
            url: 'app/rest/accounts',
            method: 'GET'
        }
    });
}]);

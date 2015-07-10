
bootstrapServices.factory('Account',['$resource', function ($resource) {
    return $resource('app/rest/account/getCurrent', {}, {
        'getByLogin': {
            url:'app/rest/adminAccount/accountByLogin/:login',
            method: 'GET'
        },
        'getAllAccounts': {
            url: 'app/rest/adminAccount/allAccount',
            method: 'GET'
        },
        'updateAccount': {
            url: 'app/rest/adminAccount/updateAccount',
            method: 'POST'
        },'updateCurrentAccount':{
            url:'/app/rest/account/update',
            method:'PUT'
        }
    });
}]);

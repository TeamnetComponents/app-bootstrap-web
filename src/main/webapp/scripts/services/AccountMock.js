
bootstrapServices.factory('AccountMock',function () {

    var mockAccounts = [
        {
            "id":1,
            "login":"system",
            "firstName":"System",
            "lastName":"System",
            "email":"system@email.com",
            "activated":true,
            "langKey":"en",
            "activationKey":null,
            "gender":null,
            "roles":null,
            "moduleRights":null
        },
        {
            "id":2,
            "login":"admin",
            "firstName":"Admin",
            "lastName":"Admin",
            "email":"admin@email.com",
            "activated":true,
            "langKey":"en",
            "activationKey":null,
            "gender":null,
            "roles":null,
            "moduleRights":null,
            functions: [
                {
                    "id":1,
                    "code":"Function_Admin",
                    "description":"Admin Function",
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
                }
            ]
        }
    ];

    var getAllAccounts = function(cfg, callback) {
        if(typeof(cfg) == 'function') {
            cfg(mockAccounts);
        }else{
            callback(mockAccounts);
        }

    };


    return {
        'update' : {method: 'PUT'},
        'getAll' : getAllAccounts
    }
});

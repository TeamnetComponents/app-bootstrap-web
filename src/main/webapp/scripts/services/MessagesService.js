bootstrapServices.factory('MessagesService', ['$resource', function($resource){
    return $resource('json/messages.json', {}, {
        'findAll': { method: 'GET', isArray: true}
    })
}]);
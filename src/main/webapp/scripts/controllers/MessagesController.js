bootstrapConstants.controller('MessagesController', ['$scope', '$resource', 'MessagesService',
function($scope, $resource, MessagesService){
    $scope.messages = MessagesService.findAll();
    $scope.getMessageClass = function(labels) {
        var msgClass = "";
        for (var i=0; i<labels.length; i++) {
            msgClass += " msg-" + labels[i] + "-item";
        }
        return msgClass;
    };
}]);
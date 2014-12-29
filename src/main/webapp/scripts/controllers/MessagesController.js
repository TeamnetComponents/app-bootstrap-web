bootstrapControllers.controller('MessagesController', ['$scope', '$resource', 'MessagesService', 'MESSAGES',
function($scope, $resource, MessagesService, MESSAGES){
    $scope.msgs = [];
    $scope.msgCount = {};
    $scope.folders = MESSAGES.folders;
    for (var i=0; i<MESSAGES.folders.length; i++) {
        $scope.msgCount[MESSAGES.folders[i].name] = 0;
    }
    MessagesService.findAll({},  function(data) {
        $scope.msgs = data;
        for (var i=0; i<data.length; i++){
            for (var j=0; j<data[i].folders.length; j++) {
                $scope.msgCount[data[i].folders[j]] ++;
            }
        }
    });

    $scope.getMessageClass = function(message) {
        var msgClass = "";
        for (var i=0; i<message.folders.length; i++) {
            msgClass += " msg-" + message.folders[i] + "-item";
        }
        return msgClass;
    };
}]);
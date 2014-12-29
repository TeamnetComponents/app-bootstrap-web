bootstrapControllers.controller('MainController', ['$scope', 'MessagesService',  function ($scope, MessagesService) {
    $scope.msgCount = 0;
    MessagesService.findAll({},  function(data) {
        $scope.msgCount = data.length;
    });
}]);
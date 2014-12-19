
bootstrapControllers.controller('TrackerController',['$scope', function ($scope) {
    // This controller uses the Atmosphere framework to keep a Websocket connection opened, and receive
    // user activities in real-time.

    $scope.activities = [];
    $scope.trackerSocket = atmosphere;
    $scope.trackerSubSocket;
    $scope.trackerTransport = 'websocket';

    $scope.trackerRequest = { url: 'websocket/tracker',
        contentType: "application/json",
        transport: $scope.trackerTransport,
        trackMessageLength: true,
        reconnectInterval: 5000,
        enableXDR: true,
        timeout: 60000 };

    $scope.trackerRequest.onOpen = function (response) {
        $scope.trackerTransport = response.transport;
        $scope.trackerRequest.uuid = response.request.uuid;
    };

    $scope.trackerRequest.onMessage = function (response) {
        var message = response.responseBody;
        var activity = atmosphere.util.parseJSON(message);
        var existingActivity = false;
        for (var index = 0; index < $scope.activities.length; index++) {
            if ($scope.activities[index].uuid == activity.uuid) {
                existingActivity = true;
                if (activity.page == "logout") {
                    $scope.activities.splice(index, 1);
                } else {
                    $scope.activities[index] = activity;
                }
            }
        }
        if (!existingActivity) {
            $scope.activities.push(activity);
        }
        $scope.$apply();
    };

    $scope.trackerSubSocket = $scope.trackerSocket.subscribe($scope.trackerRequest);
}]);
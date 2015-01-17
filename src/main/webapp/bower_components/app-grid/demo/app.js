var demoAppGridApp = angular.module('demoAppGrid', ['angular-components.appGrid',
    'ngResource', 'ngRoute', 'ngCookies', 'tmh.dynamicLocale','controllers','services']);

demoAppGridApp
    .config(['$routeProvider', '$httpProvider',   'tmhDynamicLocaleProvider',
function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider) {
    $routeProvider
        .when('/demo', {
            templateUrl: 'views/demo.html',
            controller: 'DemoController'
        })
}]);
'use strict';

/* App Module */
function changeTheme(theme) {
    angular.element('.theme').attr("href", "styles/themes/" + theme + ".css");
    window.localStorage.setItem('theme', theme);
}

var bootstrapApp = angular.module('bootstrapApp', ['http-auth-interceptor', 'tmh.dynamicLocale',
    'ngResource', 'ngRoute', 'ngCookies', 'bootstrapAppUtils', 'pascalprecht.translate',
    'truncate', 'ngCacheBuster','bootstrapControllers','bootstrapServices','bootstrapDirectives','bootstrapConstants',
    'angular-component.app-grid', 'angular-components.app-menu', 'angular-components.app-menu-admin', 'ui.tree', 'ngMaterial',
    'ngDragDrop', 'ngDraggable']);

angular.element(document).ready(function () {
    angularCustomLoader.loadApp(bootstrapApp);
});

bootstrapApp
    .config(function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider, AUTH_BOOTSTRAP) {

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/], true);

        $routeProvider
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/activate', {
                templateUrl: 'views/activate.html',
                controller: 'ActivationController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/error', {
                templateUrl: 'views/error.html',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'SettingsController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.settings]
                }
            })
            .when('/password', {
                templateUrl: 'views/password.html',
                controller: 'PasswordController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.password]
                }
            })
            .when('/recoverPassword', {
                templateUrl: 'views/recoverPassword.html',
                controller: 'PasswordController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/resetPassword', {
                templateUrl: 'views/resetPassword.html',
                controller: 'PasswordController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/roles', {
                templateUrl: 'views/roles/role.html',
                controller: 'RolesController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/permissions', {
                templateUrl: 'views/permissions/permission.html',
                controller: 'PermissionsController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'TestController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/sessions', {
                templateUrl: 'views/sessions.html',
                controller: 'SessionsController',
                resolve: {
                    resolvedSessions: ['Sessions', function (Sessions) {
                        return Sessions.get();
                    }]
                },
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.sessions]
                }
            })
            .when('/tracker', {
                templateUrl: 'views/tracker.html',
                controller: 'TrackerController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.tracker]
                }
            })
            .when('/metrics', {
                templateUrl: 'views/metrics.html',
                controller: 'MetricsController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.metrics]
                }
            })
            .when('/health', {
                templateUrl: 'views/health.html',
                controller: 'HealthController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.health]
                }
            })
            .when('/configuration', {
                templateUrl: 'views/configuration.html',
                controller: 'ConfigurationController',
                resolve: {
                    resolvedConfiguration: ['ConfigurationService', function (ConfigurationService) {
                        return ConfigurationService.get();
                    }]
                },
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.configuration]
                }
            })
            .when('/logs', {
                templateUrl: 'views/logs.html',
                controller: 'LogsController',
                resolve: {
                    resolvedLogs: ['LogsService', function (LogsService) {
                        return LogsService.findAll();
                    }]
                },
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.logs]
                }
            })
            .when('/audits', {
                templateUrl: 'views/audits.html',
                controller: 'AuditsController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.audits]
                }
            })
            .when('/logout', {
                templateUrl: 'views/main.html',
                controller: 'LogoutController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            })
            .when('/docs', {
                templateUrl: 'views/docs.html',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.docs]
                }
            })
            .when('/menus', {
                templateUrl: 'views/menus.html',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.menus]
                }
            })
            .when('/ajax/:templateName', {
                templateUrl: function(params) { return 'ajax/'+params.templateName; },
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.ajax]
                }
            })
            .when('/messages', {
                templateUrl: 'views/messages.html',
                controller: 'MessagesController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.messages]
                }
            })
            .otherwise({
                templateUrl: 'views/main.html',
                controller: 'MainController',
                access: {
                    authorizedModules: [AUTH_BOOTSTRAP.all]
                }
            });

        // Initialize angular-translate
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');

        $translateProvider.useCookieStorage();

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
    })
    .run(function ($rootScope, $location, $http, AuthenticationSharedService, Session, AUTH_BOOTSTRAP) {
        $rootScope.authenticated = false;

        $rootScope.$on('$routeChangeStart', function (event, next) {
            $rootScope.isAuthorized = AuthenticationSharedService.isAuthorized;
            $rootScope.userModules = AUTH_BOOTSTRAP;
            AuthenticationSharedService.valid(next.access.authorizedModules);
        });

        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function (data) {
            $rootScope.authenticated = true;
            if ($location.path() === "/login") {
                var search = $location.search();
                if (search.redirect !== undefined) {
                    $location.path(search.redirect).search('redirect', null).replace();
                } else {
                    $location.path('/').replace();
                }
            }
        });

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function (rejection) {
            Session.invalidate();
            $rootScope.authenticated = false;
            if ($location.path() !== "/" && $location.path() !== "" && $location.path() !== "/register" &&
                $location.path() !== "/activate" && $location.path() !== "/login") {
                var redirect = $location.path();
                $location.path('/login').search('redirect', redirect).replace();
            }
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-notAuthorized', function (rejection) {
            $rootScope.errorMessage = 'errors.403';
            $location.path('/error').replace();
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function () {
            $location.path('');
        });

        console.log(angular.element('.auth-data-required'));
        angular.element('.auth-data-required').removeClass("auth-data-required");
    })
    .run(function ($rootScope, $route) {
        // This uses the Atmoshpere framework to do a Websocket connection with the server, in order to send
        // user activities each time a route changes.
        // The user activities can then be monitored by an administrator, see the views/tracker.html Angular view.

        $rootScope.websocketSocket = atmosphere;
        $rootScope.websocketSubSocket;
        $rootScope.websocketTransport = 'websocket';

        $rootScope.websocketRequest = { url: 'websocket/activity',
            contentType: "application/json",
            transport: $rootScope.websocketTransport,
            trackMessageLength: true,
            reconnectInterval: 5000,
            enableXDR: true,
            timeout: 60000 };

        $rootScope.websocketRequest.onOpen = function (response) {
            $rootScope.websocketTransport = response.transport;
            $rootScope.websocketRequest.sendMessage();
        };

        $rootScope.websocketRequest.onClientTimeout = function (r) {
            $rootScope.websocketRequest.sendMessage();
            setTimeout(function () {
                $rootScope.websocketSubSocket = $rootScope.websocketSocket.subscribe($rootScope.websocketRequest);
            }, $rootScope.websocketRequest.reconnectInterval);
        };

        $rootScope.websocketRequest.onClose = function (response) {
            if ($rootScope.websocketSubSocket) {
                $rootScope.websocketRequest.sendMessage();
            }
        };

        $rootScope.websocketRequest.sendMessage = function () {
            if ($rootScope.websocketSubSocket.request.isOpen) {
                if ($rootScope.account != null) {
                    $rootScope.websocketSubSocket.push(atmosphere.util.stringifyJSON({
                            userLogin: $rootScope.account.login,
                            page: $route.current.templateUrl})
                    );
                }
            }
        };

        $rootScope.websocketSubSocket = $rootScope.websocketSocket.subscribe($rootScope.websocketRequest);

        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            $rootScope.websocketRequest.sendMessage();
        });
    }
);

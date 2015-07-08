bootstrapServices.factory('authHttpResponseInterceptor', ['$q', '$location', 'httpBuffer','$rootScope', function ($q, $location, httpBuffer,$rootScope) {

    return {
        response: function (response) {
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function (response) {

            if (response.status === 401 && !response.config.ignoreAuthModule) {
                var deferred = $q.defer();
                httpBuffer.append(response.config, deferred);
                $rootScope.$broadcast('event:auth-loginRequired', response);
                return deferred.promise;
            } else if (response.status === 403 && !response.config.ignoreAuthModule) {
                $rootScope.$broadcast('event:auth-notAuthorized', response);
                return $q.reject(response);

            }else if(response.status==503){
               return response || $q.when(response);
            }
            // otherwise, default behaviour
            return $q.reject(response);
        }
    }
}]);
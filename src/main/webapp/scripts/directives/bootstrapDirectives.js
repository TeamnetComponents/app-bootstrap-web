var bootstrapDirectives=angular.module('bootstrapDirectives',[]);
bootstrapDirectives.directive('includeStatic', function($http, $templateCache, $compile) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope:false,
        link: function($scope, element, attrs, ctrl, transclude) {
            var templatePath = attrs.includeStatic;


            $http.get(templatePath, { cache: $templateCache })
                .success(function(response) {
                    var contents = element.html(response).contents();
                    $compile(contents)($scope);
                });
        }
    };
});
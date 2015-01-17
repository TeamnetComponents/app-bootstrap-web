myControllers.controller('DemoController',['$scope','DemoService',function($scope){
    $scope.appGrid={
        url:'json/app-grid.json',
        showRowNum:true,
        doPagination:true,
        autoHeight:true,
        showFilterToolbar:true/*,
        footerTemplate:'templates/gridFooterTemplate.html',
        headerRowTemplate:'templates/appGridHeaderTemplate.html'*/
    };


    /*$scope.$watch('myUser',function(newValue){
     if(newValue!=undefined&&newValue!=null){
     console.log(newValue);
     }
     },true);*/
}]);

myControllers.controller('LanguageController', ['$scope', '$translate',
    function ($scope, $translate) {
        $scope.changeLanguage = function (languageKey) {
            $scope.$root.locale.date=languageKey=='ro'?'dd-MM-yyyy':'yyyy-MM-dd';
            $translate.use(languageKey);
        };
    }]);
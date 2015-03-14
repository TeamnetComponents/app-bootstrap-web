bootstrapControllers
    .controller('PermissionsController',['$scope', '$http', 'Module', function($scope, $http, Module){
        $scope.selectedModuleRight = {};
        $scope.selectedModule = {};
        $scope.moduleRights = [];
        $scope.allModuleRights = [];
//        $scope.selectedModuleRights.moduleRights = [];
        $scope.modules = [];
        $scope.searchText = '';
        var baseTemplateUrl = 'views/permissions/template/';

        $scope.roleTpl = baseTemplateUrl + 'role.tpl.html';
        $scope.moduleTpl = baseTemplateUrl + 'module.tpl.html';
        $scope.moduleRightsTpl = baseTemplateUrl + 'moduleRights.tpl.html';
        $scope.permissionTpl = baseTemplateUrl + 'permission.tpl.html';
        $scope.permissionToADdTpl = baseTemplateUrl + 'permissionsToAdd.tpl.html';


        //todo resource
        $http.get('app/rest/module/rights').then(function (res){
            $scope.modules = angular.copy(res.data);
            if(!_.isEmpty($scope.modules)){
                $scope.moduleSelect($scope.modules[0]);
            }
        });

        //todo resource
        $http.get('app/rest/modulerights/codes').then(function (res){
            $scope.allModuleRights = angular.copy(res.data);
        });

        $scope.moduleSelect = function(module){
/*            if(!module.isSelected){
                Module.get({moduleId: module.id}, function(res){
                    $scope.selectedModule.isSelected=false;
                    $scope.selectedModule = res;
                    $scope.selectedModule.isSelected=true;

                    console.log('module Selected',$scope.selectedModule);
                });
            }*/


            if($scope.selectedModule != module){
                $scope.selectedModule.isSelected=false;
                $scope.selectedModule = module;
                $scope.selectedModule.isSelected=true;
                if($scope.selectedModule.moduleRights === null
                    || $scope.selectedModule.moduleRights === undefined){
                    $scope.selectedModule.moduleRights = [];
                }
            }

            $scope.moduleRights = [];
            if(_.isEmpty($scope.selectedModule.moduleRights)){
                $scope.moduleRights = angular.copy($scope.allModuleRights);
            } else {
                $scope.allModuleRights.forEach(function (selectedItem){
                    var auxBool = true;
                    $scope.selectedModule.moduleRights.forEach(function (notSelectedItem){
                        if(angular.equals(selectedItem.right, notSelectedItem.right)){
                            auxBool = false;
                        }
                    });
                    if(auxBool){
                        $scope.moduleRights.push(selectedItem);
                    }
                });
            }
        };


        $scope.editModule = function(){
            $scope.view = 'edit';
            $scope.addView = !$scope.addView ;
            if($scope.addView){
                $scope.permissionClass = 'col-anim';
            }
            else{
                $scope.permissionClass = '';
            }
        };

        $scope.createModule = function(){
            clearSelection($scope.selectedModule);
            $scope.view = 'create';
            $scope.addView = !$scope.addView ;
            if($scope.addView){
                $scope.permissionClass = 'col-anim';
            }
            else{
                $scope.permissionClass = '';
            }
        };

        var clearSelection = function(selection){
            selection.isSelected = false;
            selection = {};
        };

        $scope.saveModule = function(){
            console.log($scope.selectedModule);
            Module.save($scope.selectedModule, function (value, responseHeaders) {
                console.log('Module saved');
            });
        };


    }]);


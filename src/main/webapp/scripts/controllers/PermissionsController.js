bootstrapControllers
    .controller('PermissionsController',['$scope', '$rootScope', '$http', 'Notification', '$animate', 'Permission','Permissions',
        function($scope, $rootScope, $http, Notification, $animate, Permission, Permissions){

        var baseTemplateUrl = 'views/permissions/template/';
        $scope.moduleRightsTpl = baseTemplateUrl + 'moduleRights.tpl.html';

        $scope.selectedModule = {};
        $scope.selectedModule.moduleRights = [];
        $scope.moduleRights = [];
        $scope.allModuleRights = [];
        $scope.modules = [];

        $scope.moduleCodeOptions = [
            {value : '1',  description : 'MENU'  },
            {value : '2',  description : 'ENTITY'  },
            {value : '3',  description : 'FIELD'  },
            {value : '4',  description : 'OTHER'  }
        ];

        $scope.isView = true;
        $scope.isAdd = false;
        $scope.isEdit = false;

        $scope.isSelected = function(module){
            return module.id == $scope.selectedModule.id;
        };

        var functionIndexOf = function(array, func){
            for (var x = 0; x < array.length; x++) {
                if (func(array[x]))
                    return x;
            }
            return -1;
        };

        $scope.selectModule = function(module){
            var idx;
            Permission.get({moduleId: module.id}, function(res){
                $scope.selectedModule = res;
                $scope.moduleRights = [];
                if(_.isEmpty($scope.selectedModule.moduleRights)){
                    $scope.moduleRights = angular.copy($scope.allModuleRights);
                } else {
                    $scope.allModuleRights.forEach(function (selectedItem){
                        idx = functionIndexOf($scope.selectedModule.moduleRights,
                            function(el) {return selectedItem.right == el.right});
                        if(idx < 0){
                            $scope.moduleRights.push(selectedItem);
                        }
                    });
                }
            });
        };


        $scope.editModule = function(){
            clearState();
            $scope.isEdit = true;
        };

        $scope.backModule = function(){
            clearState();
            $scope.isView = true;

            if($scope.selectedModule.id != undefined){
                $scope.selectModule($scope.selectedModule);
            } else if(!_.isEmpty($scope.modules)){
                $scope.selectModule($scope.modules[0]);
            } else {
                $scope.moduleRights = angular.copy($scope.allModuleRights);
            }
        };

        $scope.createModule = function(){
            clearState();
            $scope.isAdd = true;
            $scope.selectedModule = {};
            $scope.selectedModule.moduleRights = [];
            $scope.moduleRights = angular.copy($scope.allModuleRights);
        };


        $scope.saveModule = function(){
            if($scope.selectedModule.id != undefined){
                Permission.save({moduleId: $scope.selectedModule.id}, $scope.selectedModule, function(data){
                    var status = "";
                    for(var i=0;i<2;i++){
                        status += data[i];
                    };
                    if(status!="OK"){
                        Notification.error('Forbidden operation! Module assigned to Roles or Accounts.');
                    }else{
                        Permissions.refreshAdminModules();
                        Notification.success('Module updated');
                    }
                    $scope.backModule();
                })
            } else {
                Permission.save($scope.selectedModule, function (value, responseHeaders) {
                 Notification.success('Module saved');
                 $scope.selectedModule = value;
                 Permission.getAllModulesWithModuleRights({}, function(res){
                 $scope.modules = angular.copy(res);
                 $scope.selectedModule = value;
                 $scope.backModule();
                 });
                 });
            }
        };

        $scope.deleteModule = function(){
            // todo fix in java
            Permission.delete({moduleId: $scope.selectedModule.id}, function(){
                Notification.success('Module deleted');
                init();
            }, function (httpResponse) {
                Notification.error('Forbidden operation! Module assigned to Roles or Accounts.');
            });
            $scope.closeConfirm();
        };

        $scope.showConfirm = function(ev) {
//            if(confirm('Are you sure you want to delete ' + $scope.selectedModule.description + ' ?')) {
//                $scope.deleteModule();
//            }
            $('#confirmDelete').modal('show');
        };

        $scope.closeConfirm = function(ev) {
            $('#confirmDelete').modal('toggle');
        };

        var init = function(){
            $scope.isView = true;
            $scope.isAdd = false;
            $scope.isEdit = false;

            $scope.modules = angular.copy(window.localStorage.getObj('modules'));
            if(!_.isEmpty($scope.modules)){
                $scope.selectModule($scope.modules[0]);
            }

            Permission.getModuleRightCodes({}, function(res){
                $scope.allModuleRights = angular.copy(res);
            });
        };

        var clearState = function(){
            $scope.isView = false;
            $scope.isAdd = false;
            $scope.isEdit = false;
        };

        init();
    }]);


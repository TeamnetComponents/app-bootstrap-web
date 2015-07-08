bootstrapControllers
    .controller('PermissionsController',['$scope', '$http','$mdDialog', '$mdToast', '$animate', 'Permission', function($scope, $http, $mdDialog, $mdToast, $animate, Permission){
        var baseTemplateUrl = 'views/permissions/template/';
        $scope.moduleRightsTpl = baseTemplateUrl + 'moduleRights.tpl.html';

        $scope.selectedModule = {};
        $scope.selectedModule.moduleRights = [];
        $scope.moduleRights = [];
        $scope.allModuleRights = [];
        $scope.modules = [];

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
                        showSimpleToast('Forbidden operation! Module assigned to Roles or Accounts.');
                    }else{
                        showSimpleToast('Module updated');
                    }
                    $scope.backModule();
                })
            } else {
                // todo fix in java
                showSimpleToast('todo:Fix save module');
                $scope.backModule();
                /*Permission.save($scope.selectedModule, function (value, responseHeaders) {
                 showSimpleToast('Module saved');
                 $scope.selectedModule = value;
                 Permission.getAllModulesWithModuleRights({}, function(res){
                 $scope.modules = angular.copy(res);
                 $scope.selectedModule = value;
                 $scope.backModule();
                 });
                 });*/
            }
        };

        $scope.deleteModule = function(){
            // todo fix in java
            Permission.delete({moduleId: $scope.selectedModule.id}, function(){
                showSimpleToast('Module deleted');
                init();
            });
        };

        $scope.showConfirm = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete ' + $scope.selectedModule.description + ' ?')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(
                $scope.deleteModule,
                function() {
                    console.log('Canceled')
                });
        };

        var init = function(){
            $scope.isView = true;
            $scope.isAdd = false;
            $scope.isEdit = false;

            Permission.getAllModulesWithModuleRights({}, function(res){
                $scope.modules = angular.copy(res);
                if(!_.isEmpty($scope.modules)){
                    $scope.selectModule($scope.modules[0]);
                }
            });

            Permission.getModuleRightCodes({}, function(res){
                $scope.allModuleRights = angular.copy(res);
            });
        };

        var showSimpleToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position('top right')
                    .parent(angular.element('#permissionToastr'))
                    .hideDelay(1500)
            );
        };

        var clearState = function(){
            $scope.isView = false;
            $scope.isAdd = false;
            $scope.isEdit = false;
        };

        init();
    }]);


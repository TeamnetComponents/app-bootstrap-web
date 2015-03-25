/**
 * Created by mihai.vaduva on 1/30/15.
 */
bootstrapControllers
    .controller('RolesController',['$scope', '$http', '$q', '$mdDialog','$mdToast', '$animate','Role', 'Permission',
        function($scope, $http, $q, $mdDialog, $mdToast, $animate, Role, Permission){

            var baseTemplateUrl = 'views/roles/template/';
            $scope.permissionTpl = baseTemplateUrl + 'permission.tpl.html';

            $scope.selectedRole = {};
            $scope.roles = [];

            $scope.modules = [];
            $scope.selectedModules = [];
            $scope.selectedModules.type = 'add';
            $scope.moduleRights = [];
            $scope.selectedModuleRights = [];

            $scope.search = '';
            $scope.selectedSearch = '';

            $scope.isView = true;
            $scope.isAdd = false;
            $scope.isEdit = false;

            $scope.loading = false;

            $scope.isSelected = function (role){
                return role.id == $scope.selectedRole.id;
            };

            $scope.selectRole = function(role){
                $scope.loading = true;
                Role.get({roleId: role.id}, function(res){
                    $scope.selectedRole = res;
                    $scope.selectedRole.validFrom = new Date($scope.selectedRole.validFrom);
                    $scope.selectedRole.validTo = new Date($scope.selectedRole.validTo);
                    clearSelectedModuleRights();
                    getAllModuleRights().then(function(){
                        $scope.selectedRole.moduleRights.forEach(function (item){
                            //todo: de modificat in java sa nu am moduleRight cu module null pe role
                            if(item.module !== null){
                                if($scope.selectedModuleRights[item.module.code] == undefined){
                                    $scope.selectedModules.push(item.module);
                                    $scope.selectedModuleRights[item.module.code] = [];
                                }
                                $scope.selectedModuleRights[item.module.code].push(item);

                                var idx = angularIndexOf($scope.moduleRights[item.module.code], item);
                                if(idx > -1){
                                    $scope.moduleRights[item.module.code].splice(idx, 1);
                                }
                            }
                        });
                        $scope.loading = false;
                    });
                });
            };

            $scope.createRole = function(){
                clearState();
                $scope.isAdd = true;

                $scope.selectedRole = {};
                clearSelectedModuleRights();
                getAllModuleRights();
            };

            $scope.editRole = function(){
                clearState();
                $scope.isEdit = true;
            };

            $scope.saveRole = function(){
                var moduleRights = [];
                // todo: edit saveRole in java
                $scope.selectedModules.forEach(function(module){
                    $scope.selectedModuleRights[module.code].forEach(function(moduleRight){
                        moduleRight.module.moduleRights = undefined;
                        moduleRights.push(moduleRight);
                    })
                });

                $scope.selectedRole.moduleRights = moduleRights;
                if($scope.selectedRole.id !== undefined){
                    Role.update($scope.selectedRole, function (value) {
                        showSimpleToast('Role updated');
                        $scope.selectedRole.id = value.id;
                        $scope.backRole();
                    });
                }else{
                    Role.save($scope.selectedRole, function (value) {
                        showSimpleToast('Role saved');
                        $scope.selectedRole.id = value.id;
                        getRoles().then($scope.backRole);
                    });
                }
            };

            $scope.deleteRole = function(){
                Role.delete({roleId: $scope.selectedRole.id}, function(){
                    showSimpleToast('Role deleted');
                    init();
                });
            };

            $scope.backRole = function(){
                clearState();
                $scope.isView = true;

                if($scope.selectedRole.id != undefined){
                    $scope.selectRole($scope.selectedRole);
                } else if(!_.isEmpty($scope.roles)){
                    $scope.selectRole($scope.roles[0]);
                } else {
                    refreshModuleAndModuleRights();
                }
            };

            $scope.addFunction = function(item, list){
                if(_.isArray(item)){
                    item.forEach(function (elem){
                        var moduleAux = undefined;
                        list.forEach(function (module){
                            if(angular.equals(module.code, elem.module.code )){
                                moduleAux = module;
                            }
                        });

                        if(moduleAux == undefined){
                            list.push(elem.module);
                        }

                        if(list.type == 'add'){
                            if($scope.selectedModuleRights[elem.module.code] == undefined){
                                $scope.selectedModuleRights[elem.module.code] = [];
                            }
                            $scope.selectedModuleRights[elem.module.code].push(elem);
                        } else {
                            if($scope.moduleRights[elem.module.code] == undefined){
                                $scope.moduleRights[elem.module.code] = [];
                            }
                            $scope.moduleRights[elem.module.code].push(elem);
                        }
                    })

                } else {
                    if($scope.selectedModuleRights[item.module.code] == undefined){
                        $scope.selectedModuleRights[item.module.code] = [];
                    }

                    if($scope.moduleRights[item.module.code] == undefined){
                        $scope.moduleRights[item.module.code] = [];
                    }


                    var moduleAux = undefined;
                    list.forEach(function (module){
                        if(angular.equals(module.code, item.module.code )){
                            moduleAux = module;
                        }
                    });

                    if(moduleAux == undefined){
                        list.push(item.module);
                    }


                    if(list.type == 'add'){
                        if($scope.selectedModuleRights[item.module.code].indexOf(item) < 0){
                            $scope.selectedModuleRights[item.module.code].push(item);
                        }
                    } else {
                        if($scope.moduleRights[item.module.code].indexOf(item) < 0){
                            $scope.moduleRights[item.module.code].push(item);
                        }
                    }
                }
            };

            $scope.startFnc = function(){
                arguments[0].target.style.visibility = 'hidden';
            };

            $scope.stopFnc = function(){
                arguments[0].target.style.visibility = '';
            };

            $scope.showConfirm = function(ev) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete ' + $scope.selectedRole.description + ' ?')
                    .ok('Delete')
                    .cancel('Cancel')
                    .targetEvent(ev);
                $mdDialog.show(confirm).then(
                    $scope.deleteRole,
                    function() {
                        console.log('Canceled')
                    });
            };

            var showSimpleToast = function(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('top right')
                        .parent(angular.element('#roleToastr'))
                        .hideDelay(1500)
                );
            };

            var clearSelectedModuleRights = function(){
                $scope.selectedModules = [];
                $scope.selectedModules.type = 'add';
                $scope.selectedModuleRights = [];
            };

            var clearState = function(){
                $scope.isView = false;
                $scope.isAdd = false;
                $scope.isEdit = false;
            };

            var getRoles = function(){
                var deferred = $q.defer();
                Role.get({}, function (res){
                        $scope.roles = res.content;
                        deferred.resolve();
                    },
                    function(){
                        console.log('Get roles failed');
                        deferred.reject();
                    });
                return deferred.promise;
            };

            var getAllModuleRights = function(){
                var deferred = $q.defer();
                if($scope.allModuleRights != undefined && $scope.allModules != undefined){
                    $scope.moduleRights = angular.copy($scope.allModuleRights);
                    $scope.modules = angular.copy($scope.allModules);
                    deferred.resolve();
                } else {
                    Permission.getModuleRights({},
                        function (res){
                            $scope.allModuleRights = {};
                            $scope.allModules = [];
                            res.forEach(function (item){
                                if(item.module !== null){
                                    if($scope.allModuleRights[item.module.code] == undefined){
                                        $scope.allModules.push(item.module);
                                        $scope.allModuleRights[item.module.code] = [];
                                    }
                                    $scope.allModuleRights[item.module.code].push(item);
                                }
                            });
                            $scope.moduleRights = angular.copy($scope.allModuleRights);
                            $scope.modules = angular.copy($scope.allModules);
                            deferred.resolve();
                        },
                        function (){
                            console.log('Get all module rights failed');
                            deferred.reject();
                        }
                    );
                }
                return deferred.promise;
            };

            var angularIndexOf = function(array, elem){
                for (var x = 0; x < array.length; x++) {
                    if (angular.equals(array[x], elem))
                        return x;
                }
                return -1;
            };

            var init = function(){
                clearState();
                $scope.isView = true;

                getRoles().then(function(){
                    if(!_.isEmpty($scope.roles)){
                        $scope.selectRole($scope.roles[0]);
                    }
                })
            };

            init();
        }]);
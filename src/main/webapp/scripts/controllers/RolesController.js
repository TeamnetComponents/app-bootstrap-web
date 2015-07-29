/**
 * Created by mihai.vaduva on 1/30/15.
 */
bootstrapControllers
    .controller('RolesController',['$scope', '$http', '$q','Notification', '$animate','Role',
        function($scope, $http, $q, Notification, $animate, Role){

            var baseTemplateUrl = 'views/roles/template/';
            $scope.permissionTpl = baseTemplateUrl + 'permission.tpl.html';

            $scope.selectedRole = {};
            $scope.roles = [];

            $scope.modules = [];
            $scope.selectedModules = [];
            $scope.selectedModules.type = 'add';
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
                    clearSelectedModuleRights();

                    var mrs = window.localStorage.getObj('moduleRights');
                    res.moduleRights.forEach(function(moduleRight) {
                        var module = mrs[moduleRight.id].module;
                        moduleRight.module = module;

                        $scope.pushModuleRight($scope.selectedModules, moduleRight);
                    });


                    $scope.selectedRole = res;
                    $scope.selectedRole.validFrom = new Date($scope.selectedRole.validFrom);
                    $scope.selectedRole.validTo = new Date($scope.selectedRole.validTo);
                    getAllModuleRights().then(function(){
                        $scope.selectedRole.moduleRights.forEach(function (item){
                            var module = $scope.findByProperty($scope.modules, 'code', item.module.code);
                            var idx = angularIndexOf(module.moduleRights, item);
                            if(idx > -1){
                                module.moduleRights.splice(idx, 1);
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

            $scope.saveRole = function() {
                var moduleRights = [];
                $scope.selectedModules.forEach(function(module) {
                    module.moduleRights.forEach(function(moduleRight) {
                        moduleRight.module.moduleRights = undefined;
                        //moduleRights[module.code+'-'+moduleRight.moduleRightCode] = moduleRight;
                        moduleRights.push(moduleRight);
                    })
                });
                if($scope.selectedRole.active == undefined || $scope.selectedRole.active == null){
                    $scope.selectedRole.active = false;
                }
                $scope.selectedRole.moduleRights = moduleRights;
                if($scope.selectedRole.id !== undefined){
                    Role.update({roleId: $scope.selectedRole.id},$scope.selectedRole, function (value) {
                        Notification.success('Role updated');
                        $scope.selectedRole.id = value.id;
                        $scope.backRole();
                    });
                }else{
                    Role.save($scope.selectedRole, function (value) {
                        Notification.success('Role saved');
                        $scope.selectedRole.id = value.id;
                        getRoles().then($scope.backRole);
                    });
                }
            };

            $scope.deleteRole = function(){
                Role.delete({roleId: $scope.selectedRole.id}, function(){
                    Notification.success('Role deleted');
                    init();
                }, function (httpResponse) {
                    Notification.error('Forbidden operation!');
                });
                $scope.closeConfirm();
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

                        var target = list.type == 'add' ? $scope.selectedModules : $scope.modules;
                        $scope.pushModuleRight(target, elem);
                    })

                } else {
                    var moduleAux = undefined;
                    list.forEach(function (module){
                        if(angular.equals(module.code, item.module.code )){
                            moduleAux = module;
                        }
                    });

                    if(moduleAux == undefined){
                        list.push(item.module);
                    }


                    var target = list.type == 'add' ? $scope.selectedModules : $scope.modules;
                    $scope.pushModuleRight(target, item);
                }
            };

            $scope.startFnc = function(){
                arguments[0].target.style.visibility = 'hidden';
            };

            $scope.stopFnc = function(){
                arguments[0].target.style.visibility = '';
            };

            $scope.showConfirm = function(ev) {
//                if (confirm('Are you sure you want to delete ' + $scope.selectedRole.description + '?') ) {
//                    $scope.deleteRole();
//                }
                $('#confirmDelete').modal('show');
            };

            $scope.closeConfirm = function(ev) {
                $('#confirmDelete').modal('toggle');
            };

            var clearSelectedModuleRights = function(){
                $scope.selectedModules = [];
                $scope.selectedModules.type = 'add';
            };

            var clearState = function(){
                $scope.isView = false;
                $scope.isAdd = false;
                $scope.isEdit = false;
            };

            var getRoles = function(){
                var deferred = $q.defer();
                Role.getAll({}, function (res){
                        $scope.roles = res
                        deferred.resolve();
                    },
                    function(){
                        console.log('Get roles failed');
                        deferred.reject();
                    });
                return deferred.promise;
            };

            var getAllModuleRights = function() {
                var deferred = $q.defer();

                $scope.modules = window.localStorage.getObj('modules');

                deferred.resolve();
                return deferred.promise;
            };

            $scope.findByProperty = function(array, key, val) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] === val) {
                        return array[i];
                    }
                }

                return false;
            };

            $scope.pushModuleRight = function(targetList, moduleRight, module) {
                if(!module) {
                    module = moduleRight.module;
                }

                var selectedModule = $scope.findByProperty(targetList, 'code', module.code);
                if(!selectedModule) {
                    // make a copy
                    selectedModule = {};
                    for(var prop in module) {
                        selectedModule[prop] = module[prop];
                    }

                    targetList.push(selectedModule);
                }

                if(!selectedModule.moduleRights) {
                    selectedModule.moduleRights = [];
                }

                selectedModule.moduleRights.push(moduleRight);
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
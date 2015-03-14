/**
 * Created by mihai.vaduva on 1/30/15.
 */
bootstrapControllers
    .controller('RolesController',['$scope', '$http', 'Role', function($scope, $http, Role){
        var baseTemplateUrl = 'views/roles/template/';
        $scope.roles = [];
        $scope.permissions = [];
        $scope.selectedPermissions = [];
        $scope.selectedModules = [];
        $scope.selectedModules.type = 'left';
        $scope.modules = [];
        $scope.selectedModuleRights = [];

        $scope.search = '';
        $scope.selectedSearch = '';
        $scope.clickBool = false;

        $scope.selectedRole = {};
        $scope.listView = true;
        $scope.addView = false;
        $scope.permissionClass = '';
        $scope.colSpan = '2';

        $scope.roleTpl = baseTemplateUrl + 'role.tpl.html';
        $scope.permissionTpl = baseTemplateUrl + 'permission.tpl.html';
        $scope.permissionToADdTpl = baseTemplateUrl + 'permissionsToAdd.tpl.html';


        $scope.tabs = [
            { title:'Roles', content: baseTemplateUrl + 'role.tpl.html' },
            { title:'Permissions', content: baseTemplateUrl + 'permission.tpl.html' }
        ];

        $scope.roleSelect = function(role){
            if($scope.selectedRole != role){
                $scope.selectedRole.isSelected=false;
                $scope.selectedRole = role;
                $scope.selectedRole.isSelected=true;

                $scope.selectedPermissions = $scope.selectedRole.moduleRights;

                $scope.permissions = [];
                $scope.allModuleRights.forEach(function(item){
                    var auxBool = true;
                    $scope.selectedPermissions.forEach(function(item2){
                        if(angular.equals(item, item2)){
                            auxBool = false;
                        }
                    });
                    if(auxBool){
                        $scope.permissions.push(item);
                    }
                });
            }
        };

        $scope.addElement = function(item, action){
            if(!$scope.clickBool){
                return;
            }

            var listRemove, listAdd;
            if(action === 'add'){
                listRemove = $scope.permissions;
                listAdd = $scope.selectedPermissions;
            } else {
                listRemove = $scope.selectedPermissions;
                listAdd = $scope.permissions;
            }
            var index = listRemove.indexOf(item);
            if(index > -1){
                listRemove.splice(index,1);
                listAdd.push(item);
            }
        };

        $scope.back = function(){
            moveToTab(0);
        };

        $scope.createRole = function(){
            $scope.view = 'create';
        };

        $scope.editRole = function(){
            $scope.view = 'edit';
            $scope.addView = !$scope.addView ;
            if($scope.addView){
                $scope.permissionClass = 'col-anim';
            }
            else{
                $scope.permissionClass = '';
            }
        };

        $scope.saveRole = function(){
            var moduleRights = [];
            console.log('selected role:',$scope.selectedRole);
            console.log('selected permissions',$scope.selectedModules);
            console.log('selected moduleRights',$scope.selectedModuleRights);
            $scope.selectedModules.forEach(function(module){
               $scope.selectedModuleRights[module.code].forEach(function(moduleRight){
                   moduleRight.module.moduleRights = undefined;
                   moduleRights.push(moduleRight);
                })
            });

            $scope.selectedRole.moduleRights = moduleRights;
            Role.save($scope.selectedRole, function (value, responseHeaders) {
                console.log('Role saved');
            });
        };

        $scope.deleteRole = function(){
            // todo delete role
            console.log("Delete role");
        };


        function init(){
            //todo de mutat codu de initializare aici
        }

        $http.get('role/rest/roles').then(function (res){
            $scope.roles = res.data.content;
            console.log('roles',res);
        });

        $http.get('moduleright/rest/modulerights').then(function (res){
            $scope.allModuleRights = res.data.content;
            $scope.permissions = $scope.allModuleRights;
            console.log('module rights',res);
        });

        $scope.moduleRights = [];

        $http.get('module/rest/modulesWithModuleRights').then(function (res) {
            $scope.modules = res.data;
            $scope.modules.forEach(function (module) {
                module.moduleRights.forEach(function (item){
                    item.module = module;
                });
                $scope.moduleRights[module.code] = module.moduleRights;
                if ($scope.moduleRights[module.code] === undefined) {
                    $scope.moduleRights[module.code] = [];
                }
            });
        });

        $scope.addFunction = function(item, list){

            if(_.isArray(item)){
                item.forEach(function (elem){
                    var moduleAux = undefined;
                    list.forEach(function (module){
                        if(angular.equals(module.code, elem.module.code )){
                            moduleAux = module;
                        }
                    });

                    if(moduleAux === undefined){
                        list.push(elem.module);
                    }

                    if($scope.selectedModuleRights[elem.module.code] === undefined){
                        $scope.selectedModuleRights[elem.module.code] = [];
                    }
                    $scope.selectedModuleRights[elem.module.code].push(elem);
                })

            }
            else {

                if($scope.selectedModuleRights[item.module.code] === undefined){
                    $scope.selectedModuleRights[item.module.code] = [];
                }

                if($scope.moduleRights[item.module.code] === undefined){
                    $scope.moduleRights[item.module.code] = [];
                }


                var moduleAux = undefined;
                list.forEach(function (module){
                    if(angular.equals(module.code, item.module.code )){
                        moduleAux = module;
                    }
                });

                if(moduleAux === undefined){
                    list.push(item.module);
                }


                if(list.type === 'left'){
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

        $scope.addPermission = function(moduleRight, action){
            console.log(moduleRight);
        };

        $scope.clickStyle = '\'visible\'';
        $scope.addElement = function(){
//            $scope.clickStyle = 'display: none';
        };

        $scope.startFnc = function(){
            arguments[0].target.style.visibility = 'hidden';
        };

        $scope.stopFnc = function(){
            arguments[0].target.style.visibility = '';
        };

    }]);
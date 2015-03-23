/**
 * Created by mihai.vaduva on 3/17/15.
 */
bootstrapControllers
    .controller('AccountController',['$scope', '$http', '$q', '$mdToast', '$animate', 'Role', 'Permission', 'Account', function($scope, $http, $q, $mdToast, $animate, Role,Permission, Account){
        $scope.roles = [];
        $scope.accounts = [];
        $scope.selectedAccount = {};

        $scope.modules = [];
        $scope.selectedModules = [];
        $scope.selectedModules.type = 'add';
        $scope.moduleRights = [];
        $scope.selectedModuleRights = [];

        $scope.search = '';
        $scope.selectedSearch = '';

        $scope.isView = true;
        $scope.isEdit = false;

        $scope.loading = false;

        var baseTemplateUrl = 'views/account/template/';
        $scope.roleTpl = baseTemplateUrl + 'roles.tpl.html';
        $scope.permissionTpl = baseTemplateUrl + 'permissions.tpl.html';

        $scope.isSelected = function(account){
            return account.id === $scope.selectedAccount.id;
        };

        $scope.selectAccount = function(account){
            $scope.loading = true;
            Account.getByLogin({login: account.login}, function(res){
                $scope.selectedAccount = res;
                $scope.roles = angular.copy($scope.allRoles);
                $scope.selectedAccount.roles.forEach(function(item){
                    var idx = angularIndexOf($scope.roles, item);
                    if(idx > -1){
                        $scope.roles.splice(idx, 1);
                    }
                });

                clearSelectedModuleRights();
                getAllModuleRights().then(function(){
                    $scope.selectedAccount.moduleRights.forEach(function (item){
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


        $scope.editAccount = function(){
            $scope.isView = false;
            $scope.isEdit = true;
        };

        $scope.saveAccount = function(){
            var moduleRights = [];
            $scope.selectedModules.forEach(function(module){
                $scope.selectedModuleRights[module.code].forEach(function(moduleRight){
                    moduleRight.module.moduleRights = undefined;
                    moduleRights.push(moduleRight);
                })
            });

            $scope.selectedAccount.moduleRights = moduleRights;
            Account.save($scope.selectedAccount, function(){
                showSimpleToast('Account updated');
                $scope.backAccount();
            })
        };

        $scope.backAccount = function(){
            $scope.isView = true;
            $scope.isEdit = false;

            if($scope.selectedAccount.id != undefined){
                $scope.selectAccount($scope.selectedAccount);
            } else if(!_.isEmpty($scope.account)){
                $scope.selectAccount($scope.accounts[0]);
            }
        };


        $scope.startFnc = function(){
            arguments[0].target.style.visibility = 'hidden';
        };

        $scope.stopFnc = function(){
            arguments[0].target.style.visibility = '';
        };

        $scope.addFunction = function(item, list){
            console.log('add function');
            console.log(arguments);

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

                    if(list.type == 'add'){
                        if($scope.selectedModuleRights[elem.module.code] === undefined){
                            $scope.selectedModuleRights[elem.module.code] = [];
                        }
                        $scope.selectedModuleRights[elem.module.code].push(elem);
                    } else {
                        if($scope.moduleRights[elem.module.code] === undefined){
                            $scope.moduleRights[elem.module.code] = [];
                        }
                        $scope.moduleRights[elem.module.code].push(elem);
                    }
                })

            } else {
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


                if(list.type === 'add'){
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

        var clearSelectedModuleRights = function(){
            $scope.selectedModules = [];
            $scope.selectedModules.type = 'add';
            $scope.selectedModuleRights = [];
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

        var showSimpleToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position('top right')
                    .parent(angular.element('#accountToastr'))
                    .hideDelay(1500)
            );
        };

        var init = function(){
            Account.getAllAccounts({}, function(res){
                console.log('Account getAllAccounts',res);
                $scope.accounts = res.content;
                Role.get(function(res){
                    $scope.allRoles = res.content;
                    if(!_.isEmpty($scope.accounts)){
                        $scope.selectAccount($scope.accounts[0]);
                    }
                });
            });
        };

        init();
    }]);
/**
 * Created by mihai.vaduva on 3/17/15.
 */
bootstrapControllers
    .controller('AccountController', ['$scope', '$rootScope', '$http', '$q', 'Notification', '$animate', 'utils', 'Role', 'Permission', 'Account', function ($scope, $rootScope, $http, $q, Notification, $animate, utils, Role, Permission, Account) {

        $scope.accounts = [];
        $scope.roles = [];
        $scope.selectedAccount = {};

        $scope.search = '';
        $scope.selectedSearch = '';

        $scope.isView = true;
        $scope.isEdit = false;

        $scope.loading = false;

        $scope.modules = window.localStorage.getObj('modules');
        $scope.mrs = window.localStorage.getObj('moduleRights');

        $scope.selectedModules = [];
        $scope.selectedModules.type = 'add';

        var baseTemplateUrl = 'views/account/template/';
        $scope.roleTpl = baseTemplateUrl + 'roles.tpl.html';
        $scope.permissionTpl = baseTemplateUrl + 'permissions.tpl.html';

        $scope.isSelected = function (account) {
            return account.id === $scope.selectedAccount.id;
        };

        $scope.findByProperty = function (array, key, val) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] === val) {
                    return array[i];
                }
            }

            return false;
        };

        $scope.pushModuleRight = function (targetList, moduleRight, module) {
            if (!module) {
                module = moduleRight.module;
            }

            var selectedModule = $scope.findByProperty(targetList, 'code', module.code);
            if (!selectedModule) {
                // make a copy
                selectedModule = {};
                for (var prop in module) {
                    selectedModule[prop] = module[prop];
                }

                targetList.push(selectedModule);
            }

            if (!selectedModule.moduleRights) {
                selectedModule.moduleRights = [];
            }

            selectedModule.moduleRights.push(moduleRight);
        };

        $scope.selectAccount = function (account) {
            $scope.loading = true;
            Account.getByLogin({login: account.login}, function (res) {
                $scope.$broadcast('onSelectAccount', res.id);

                clearSelectedModuleRights();

                var mrs = window.localStorage.getObj('moduleRights');
                res.moduleRights.forEach(function (moduleRight) {
                    var module = mrs[moduleRight.id].module;
                    moduleRight.module = module;

                    $scope.pushModuleRight($scope.selectedModules, moduleRight);
                });

                $scope.selectedAccount = res;

                $scope.roles = angular.copy($scope.allRoles);

                $scope.selectedAccount.roles.forEach(function (item) {
                    item.moduleRights.forEach(function (moduleRight) {
                        var module = mrs[moduleRight.id].module;
                    });

                    var itemModuleRights = angular.copy(item.moduleRights);
                    item.moduleRights = null;

                    var idx = angularIndexOf($scope.roles, item);
                    if (idx > -1) {
                        $scope.roles.splice(idx, 1);
                    }

                    item.moduleRights = itemModuleRights;
                });

                getAllModuleRights().then(function () {
                    $scope.selectedAccount.moduleRights.forEach(function (item) {
                        var module = $scope.findByProperty($scope.modules, 'code', item.module.code);
                        var idx = angularIndexOf(module.moduleRights, item);
                        if (idx > -1) {
                            module.moduleRights.splice(idx, 1);
                        }
                    });

                    $scope.loading = false;
                });
            });
        };

        $scope.editAccount = function () {
            $scope.isView = false;
            $scope.isEdit = true;
        };

        $scope.saveAccount = function () {
            var moduleRights = {};
            $scope.selectedModules.forEach(function (module) {
                module.moduleRights.forEach(function (moduleRight) {
                    moduleRight.module.moduleRights = undefined;
                    moduleRights[module.code + '-' + moduleRight.moduleRightCode] = moduleRight;
                })
            });

            $scope.selectedAccount.moduleRights = moduleRights;

            Account.updateAccount($scope.selectedAccount, function (data) {
                $scope.$broadcast('onSaveAccount', data.id);
                Notification.success('Account updated');
                $scope.backAccount();
            }, function (error) {
                Notification.error(error.data.errMsg);
            });
        };

        $scope.backAccount = function () {
            $scope.isView = true;
            $scope.isEdit = false;

            if ($scope.selectedAccount.id != undefined) {
                $scope.selectAccount($scope.selectedAccount);
            } else if (!_.isEmpty($scope.account)) {
                $scope.selectAccount($scope.accounts[0]);
            }
        };

        $scope.startFnc = function () {
            arguments[0].target.style.visibility = 'hidden';
        };

        $scope.stopFnc = function () {
            arguments[0].target.style.visibility = '';
        };

        $scope.addFunction = function (item, list) {
            if (_.isArray(item)) {
                item.forEach(function (elem) {
                    var moduleAux = undefined;
                    list.forEach(function (module) {
                        if (angular.equals(module.code, elem.module.code)) {
                            moduleAux = module;
                        }
                    });

                    if (moduleAux === undefined) {
                        list.push(elem.module);
                    }

                    var target = list.type == 'add' ? $scope.selectedModules : $scope.modules;
                    $scope.pushModuleRight(target, elem);
                })

            } else {
                var moduleAux = undefined;
                list.forEach(function (module) {
                    if (angular.equals(module.code, item.module.code)) {
                        moduleAux = module;
                    }
                });

                if (moduleAux === undefined) {
                    list.push(item.module);
                }


                var target = list.type == 'add' ? $scope.selectedModules : $scope.modules;
                $scope.pushModuleRight(target, item);
            }
        };

        var clearSelectedModuleRights = function () {
            $scope.selectedModules = [];
            $scope.selectedModules.type = 'add';
            $scope.selectedModuleRights = [];
        };

        var getAllModuleRights = function () {
            var deferred = $q.defer();

            $scope.modules = window.localStorage.getObj('modules');

            deferred.resolve();
            return deferred.promise;
        };


        var angularIndexOf = function (array, elem) {
            for (var x = 0; x < array.length; x++) {
                if (angular.equals(array[x], elem))
                    return x;
            }
            return -1;
        };

        var init = function () {
            Account.getAllAccounts(function (res) {
                $scope.accounts = res.sort(function (acc1, acc2) {
                    return utils.alphanumericSortingFn(acc1.login, acc2.login);
                });
                Role.getAll(function (res) {
                    $scope.allRoles = res;
                    if (!_.isEmpty($scope.accounts)) {
                        $scope.selectAccount($scope.accounts[0]);
                    }
                });
            });
        };

        init();
    }]);
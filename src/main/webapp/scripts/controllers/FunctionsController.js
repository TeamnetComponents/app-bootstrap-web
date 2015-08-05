/**
 * Created by Florin.Cojocaru on 7/15/2015.
 */
bootstrapControllers
    .controller('FunctionsController', ['$scope', '$http', '$q', 'Notification', '$animate', 'FunctionMock', 'Function',
        function ($scope, $http, $q, Notification, $animate, FunctionMock, Function) {

            var baseTemplateUrl = 'views/functions/template/';
            $scope.functionTpl = baseTemplateUrl + 'functions.tpl.html';
            $scope.selectedFunction = {};
            $scope.functions = [];
            $scope.allFunctions = [];


            $scope.modules = [];
            $scope.selectedModules = [];
            $scope.selectedModules.type = 'add';

            $scope.search = '';
            $scope.selectedSearch = '';

            $scope.isView = true;
            $scope.isAdd = false;
            $scope.isEdit = false;

            $scope.loading = false;

            $scope.isSelected = function (functionn) {
                return functionn.id == $scope.selectedFunction.id;
            };

            $scope.selectFunction = function (functionn) {
                $scope.loading = true;

                Function.getById({id : functionn.id}, function(res) {
                    clearSelectedModuleRights();

                        var mrs = window.localStorage.getObj('moduleRights');
                        res.moduleRights.forEach(function (moduleRight) {
                            moduleRight.module = mrs[moduleRight.id].module;
                            $scope.pushModuleRight($scope.selectedModules, moduleRight);
                        });
                        $scope.selectedFunction = res;
                        $scope.selectedFunction.validFrom = new Date($scope.selectedFunction.validFrom);
                        $scope.selectedFunction.validTo = new Date($scope.selectedFunction.validTo)
                        getAllModuleRights().then(function () {
                            $scope.selectedFunction.moduleRights.forEach(function (item) {
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

            $scope.createFunction = function () {
                clearState();
                $scope.isAdd = true;

                $scope.selectedFunction = {};
                clearSelectedModuleRights();
                getAllModuleRights();

            };

            $scope.editFunction = function () {
                clearState();
                $scope.isEdit = true;
            };

            $scope.saveFunction = function () {
                var moduleRights = [];
                $scope.selectedModules.forEach(function(module) {
                    module.moduleRights.forEach(function(moduleRight) {
                        moduleRight.module.moduleRights = undefined;
                        //moduleRights[module.code+'-'+moduleRight.moduleRightCode] = moduleRight;
                        moduleRights.push(moduleRight);
                    })
                });
                $scope.selectedFunction.moduleRights = $scope.functions.moduleRights;
                if($scope.selectedFunction.id !== undefined) {
                    Function.update({functionId: $scope.selectedFunction.id}, $scope.selectedFunction, function(value) {
                        Notification.success('Function updated');
                        $scope.selectedFunction.id = value.id;
                        $scope.backFunction();
                    });
                }else{
                    Function.save($scope.selectedFunction, function (value) {
                        Notification.success('Function saved');
                        $scope.selectedFunction.id = value.id;
                        getFunctions().then($scope.backFunction);
                    });
                }
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

                        if (moduleAux == undefined) {
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

                    if (moduleAux == undefined) {
                        list.push(item.module);
                    }


                    var target = list.type == 'add' ? $scope.selectedModules : $scope.modules;
                    $scope.pushModuleRight(target, item);
                }
            };

            var clearState = function () {
                $scope.isView = false;
                $scope.isAdd = false;
                $scope.isEdit = false;
            };


            $scope.backFunction = function () {
                clearState();
                $scope.isView = true;

                if ($scope.selectedFunction.id != undefined) {
                    $scope.selectFunction($scope.selectedFunction);
                } else if (!_.isEmpty($scope.functions)) {
                    $scope.selectFunction($scope.functions[0]);
                } else {
                    refreshModuleAndModuleRights();
                }
            };

            var getFunctions = function () {
                var deferred = $q.defer();
                Function.getAll({}, function (data) {
                        $scope.functions = data;
                        deferred.resolve();
                    },
                    function () {
                        console.log('Get functions failed');
                        deferred.reject();
                    });
                return deferred.promise;

            };

            $scope.startFnc = function () {
                arguments[0].target.style.visibility = 'hidden';
            };

            $scope.stopFnc = function () {
                arguments[0].target.style.visibility = '';
            };

            $scope.deleteFunction = function () {
                Function.delete({functionId: $scope.selectedFunction.id}, function () {
                    Notification.success('Function deleted');
                    init();
                });
            };

            $scope.showConfirm = function (ev) {
                if (confirm('Are you sure you want to delete ' + $scope.selectedFunction.description + ' ?')) {
                    $scope.deleteFunction();
                }
            };

            var clearSelectedModuleRights = function () {
                $scope.selectedModules = [];
                $scope.selectedModules.type = 'add';
            };

            $scope.findByProperty = function (array, key, val) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] === val) {
                        return array[i];
                    }
                }

                return false;
            };

            var getAllModuleRights = function () {
                var deferred = $q.defer();

                $scope.modules = window.localStorage.getObj('modules');

                deferred.resolve();
                return deferred.promise;
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

            var angularIndexOf = function (array, elem) {
                for (var x = 0; x < array.length; x++) {
                    if (angular.equals(array[x], elem))
                        return x;
                }
                return -1;
            };

            var init = function () {
                clearState();
                $scope.isView = true;

                getFunctions().then(function () {
                    if (!_.isEmpty($scope.functions)) {
                        $scope.selectFunction($scope.functions[0]);
                    }
                });
            };

            init();
        }]);
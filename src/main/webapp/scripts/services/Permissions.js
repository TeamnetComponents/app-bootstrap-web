bootstrapServices.factory('Permissions',['$rootScope', 'Session', 'Account', 'Permission',
    function ($rootScope, Session, Account, Permission) {

        return{

            refreshAdminModules:function(){
                if($rootScope.isInRoles(['ROLE_ADMIN'])){
                    Permission.getAllModulesWithModuleRights({}, function(res){
                        var modules = angular.copy(res);
                        var moduleRights = {};
                        for(var i=0; i<modules.length; i++) {
                            var thisModule = modules[i];
                            var thisModuleRights = thisModule.moduleRights;

                            for(var j=0; j<thisModuleRights.length; j++) {
                                var moduleRight = thisModuleRights[j];

                                var module = {};
                                for(var prop in thisModule) {
                                    if(prop == 'moduleRights') {
                                        continue;
                                    }

                                    module[prop] = thisModule[prop];
                                }

                                moduleRight['module'] = module;
                                moduleRights[moduleRight.id] = moduleRight;
                            }
                        }
                        $rootScope.modules=modules;
                        window.localStorage.setObj('modules', modules);
                        window.localStorage.setObj('moduleRights', moduleRights);
                    });
                }
            }

        }

    }]);
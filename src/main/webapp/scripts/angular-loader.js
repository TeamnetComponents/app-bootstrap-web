var angularCustomLoader = {
    // Override this to specify your application configuration path.
    // Default you must define an app.json in your application root
    appPath: 'cfg/app.json',

    //use this function to load your custom angular application
    loadApp: function (bootstrapApp) {
        //getting angular injector
        var initInjector = angular.injector(['ng']);
        var internal = {
            $http: initInjector.get('$http'),
            $q: initInjector.get('$q'),
            //application configuration promise

            //modules promises
            mPromises: [],
            appConfigSuccess: function () {
            },
            appConfigMisses: function () {
            },
            resolveScripts: function () {
            },
            angularBootstrap: function () {
                angular.bootstrap(document, ['bootstrapApp']);
            },
            modulesLoaded: false,
            scriptsLoaded: false,
            scripts: [],
            mConfigSuccess: function () {
            },
            mConfigMisses: function () {
            },

            appName:null,
            commands:[],
            loadedModules:0
        };


        internal.resolveScripts = function () {
            var mResCnt = internal.scripts.length;
            if (internal.scripts.length > 0) {
                angular.forEach(internal.scripts, function (script) {
                    head.js(script, function () {
                        mResCnt--;
                        if (mResCnt == 0) {
                            internal.scriptsLoaded = true;
                            if (internal.modulesLoaded) {
                                angular.forEach(internal.commands,function(command){
                                    eval(command);
                                });

                                internal.angularBootstrap();
                            }
                        }
                    });
                });

            } else {
                internal.scriptsLoaded = true;
            }
        };


        internal.appConfigSuccess = function (appDataCfg) {
            bootstrapApp.requires.push(appDataCfg.data.name);

            //setting appName
            internal.appName=appDataCfg.data.name;

            //if there are specified resources in application configuration then there must be loaded
            if (appDataCfg.data.resources != undefined && appDataCfg.data.resources != null) {
                //loading scripts from application level
                angular.forEach(appDataCfg.data.resources, function (script) {
                    internal.scripts.push(script)
                });
            }
            //if there are modules specified in application configuration then there must be loaded
            if (appDataCfg.data.modules != undefined && appDataCfg.data.modules != null) {
                angular.forEach(appDataCfg.data.modules, function (module) {
                    if(module.path!=undefined){
                        var modulePromise = internal.$http.get(module.path);
                        modulePromise.then(internal.mConfigSuccess, internal.mConfigMisses);
                        internal.mPromises.push(modulePromise);
                    }
                });
                return internal.$q.all(internal.mPromises);
            } else {
                internal.angularBootstrap();
            }
        };

        internal.appConfigMisses = function () {
            internal.angularBootstrap();
            console.warn('Missing application configuration! Starting application bootstrap!')
        };

        internal.mConfigSuccess = function (mDataConfig) {
            internal.commands.push(internal.appName+".requires.push('"+mDataConfig.data.moduleName+"Module')");

            //if there resources specified in application configuration then there must be loaded
            if (mDataConfig.data.resources != undefined && mDataConfig.data.resources != null) {
                angular.forEach(mDataConfig.data.resources, function (script) {

                    internal.scripts.push(script);
                });


            }
            internal.loadedModules++;
            internal.modulesLoaded = internal.loadedModules==internal.mPromises.length;
            internal.resolveScripts();
        };

        internal.mConfigMisses = function (reason) {
            internal.loadedModules++;
            internal.modulesLoaded = internal.loadedModules==internal.mPromises.length;
            console.warn('Module with path "' + reason.config.url + '" not loaded. Please check your "cfg/app.json", or ' +
                ' check if the file ' + reason.config.url + ' exists in your webapp files paths.');

        };


        internal.appPromises=internal.$http.get(this.appPath);
        internal.modulePromises= internal.appPromises.then(internal.appConfigSuccess, internal.appConfigMisses);






    }
};

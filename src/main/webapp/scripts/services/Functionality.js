bootstrapServices.factory('Functionality', function () {
    return{
        init: function (scope, entity) {
            scope.refreshEvent = "refreshEvent";
            scope.appGrid = {
                url: 'app/rest/'+entity+'/list',
                id: entity
            };
            scope.functionality=entity;
            scope.selected = function(){};
            scope.refresh = function(){
                scope.$broadcast(scope.refreshEvent);
            };
            scope.redrawGrid = function(grid) {
            };
            scope.$root.$on(entity+'GridSelection',function(data){
                scope[entity].actions.onRowSelect();
            });
            scope.clear=function(){
                scope[entity].data={};
            };
            scope.customOptions = {
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                noUnselect: true,
                enableSorting: true,
                rowTemplate: "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
            };
            scope[entity] = {
                data:{},
                components: {
                    create: false,
                    delete: false,
                    view: false,
                    update: false,
                    list: true,
                    details:false
                },
                buttons: {
                    add: true,
                    edit: false,
                    delete: false,
                    view: false
                },
                event: {
                    list: entity + 'Grid'
                },
                actions:{
                    showList: function () {
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: false,
                            update: false,
                            list: true,
                            details:false
                        };
                        scope[entity].
                            buttons = {
                            add: true,
                            edit: false,
                            delete: false,
                            view: false
                        };
                        scope.refresh();
                        scope.clear();
                        $('#delete_'+entity+'_Confirmation').modal('hide');
                    },
                    back: function () {
                        if(scope[entity].components.create&&(!_.isEmpty(scope.selected()))){
                            scope[entity].actions.onRowSelect();
                        }else if(scope[entity].components.create&& (_.isEmpty(scope.selected()))){
                            scope[entity].
                                buttons = {
                                add: true,
                                edit: false,
                                delete: false,
                                view: false
                            };
                        }else if(scope[entity].components.update){
                            scope[entity].actions.onRowSelect();
                        }else if(scope[entity].components.delete){
                            scope[entity].actions.onRowSelect();
                        }else if(scope[entity].components.view){
                            scope[entity].actions.onRowSelect();
                        }
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: false,
                            update: false,
                            list: true,
                            details:false
                        };
                        scope.clear();
                        $('#delete_'+entity+'_Confirmation').modal('hide');
                    },
                    onRowSelect:function(){
                        scope[entity].
                            buttons = {
                            add: true,
                            edit: true,
                            delete: true,
                            view: true
                        }
                    },
                    showAdd: function () {
                        scope[entity]
                            .components = {
                            create: true,
                            delete: false,
                            view: false,
                            update: false,
                            list: false,
                            details:true
                        };
                        scope[entity].
                            buttons = {
                            add: true,
                            edit: false,
                            delete: false,
                            view: false
                        };

                        scope.clear();

                    },
                    showDelete: function () {
                        scope.clear();
                        scope[entity]
                            .components = {
                            create: false,
                            delete: true,
                            view: false,
                            update: false,
                            list: true,
                            details:false
                        };
                        scope[entity].
                            buttons = {
                            add: false,
                            edit: false,
                            delete:false,
                            view: false
                        };

                        if(!_.isEmpty(scope.selected())){
                            $('#delete_'+entity+'_Confirmation').modal('show');
                        }
                    },
                    showEdit:function(callback){
                        scope.clear();
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: false,
                            update: true,
                            list: false,
                            details:true
                        };
                        scope[entity].
                            buttons = {
                            add: false,
                            edit: false,
                            delete: false,
                            view: false
                        };
                        if(typeof (callback)=="function"){
                            callback();
                        }
                    },
                    showView:function(callback){
                        scope.clear();
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: true,
                            update: false,
                            list: false,
                            details:true
                        };
                        scope[entity].
                            buttons = {
                            add: false,
                            edit: false,
                            delete: false,
                            view: false
                        };
                    }
                }
            };
        }
    }
});
bootstrapServices.factory('Functionality', ['FileItem','AppGridMetadataBuilder', function (FileItem,AppGridMetadataBuilder) {

    return{
        init: function (scope, entity, Service) {

            scope.setTitle = function (title) {
                scope.functionality = title;
            };

            scope.$root.$on(entity + 'GridSelection', function (data) {
                scope[entity].actions.onRowSelect();
            });

            scope[entity] = {
                grid:{
                    url: 'app/rest/' + entity + '/list',
                    id: entity,
                    customOptions : {
                        enableRowSelection: true,
                        enableRowHeaderSelection: false,
                        multiSelect: false,
                        noUnselect: true,
                        enableSorting: true,
                        rowTemplate: "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
                    },
                    setUrl:function(url){this.url=url},
                    init:function(){this.metadataBuilder=new AppGridMetadataBuilder(this.id);},
                    reset:function(){this.metadataBuilder.resetGridMetadata()},
                    addColumn:function(col){
                        this.metadataBuilder.addColumn(col)
                    },
                    setColumnLabelKey:function(col,key){
                        this.metadataBuilder.setColumnLabelKey(col,key);
                    },
                    addColumnFilter:function(col,type){
                        this.metadataBuilder.addColumnFilter(col,type);
                    },
                    formatColumn:function(col,formatType){

                    },
                    build:function(){
                        this.columnMetadata=this.metadataBuilder.getColumnMetadata();
                    }
                },
                data: {},
                components: {
                    create: false,
                    delete: false,
                    view: false,
                    update: false,
                    list: true,
                    details: false
                },
                buttons: {
                    add: true,
                    edit: false,
                    delete: false,
                    view: false
                },
                event: {
                    list: entity + 'Grid',
                    refresh:'refreshEvent'
                },
                actions: {
                    showList: function () {
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: false,
                            update: false,
                            list: true,
                            details: false
                        };
                        scope[entity].
                            buttons = {
                            add: true,
                            edit: false,
                            delete: false,
                            view: false
                        };
                        this.refresh();
                        this.clear();
                        $('#delete_' + entity + '_Confirmation').modal('hide');
                    },
                    back: function () {
                        if (scope[entity].components.create && (!_.isEmpty(this.selected()))) {
                            this.onRowSelect();
                        } else if (scope[entity].components.create && (_.isEmpty(this.selected()))) {
                            scope[entity].
                                buttons = {
                                add: true,
                                edit: false,
                                delete: false,
                                view: false
                            };
                        } else if (scope[entity].components.update) {
                            this.onRowSelect();
                        } else if (scope[entity].components.delete) {
                            this.onRowSelect();
                        } else if (scope[entity].components.view) {
                            this.onRowSelect();
                        }
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: false,
                            update: false,
                            list: true,
                            details: false
                        };
                        this.clear();
                        $('#delete_' + entity + '_Confirmation').modal('hide');
                    },
                    onRowSelect: function () {
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
                            details: true
                        };
                        scope[entity].
                            buttons = {
                            add: true,
                            edit: false,
                            delete: false,
                            view: false
                        };

                        this.clear();

                    },
                    showDelete: function () {
                        this.clear();
                        scope[entity]
                            .components = {
                            create: false,
                            delete: true,
                            view: false,
                            update: false,
                            list: true,
                            details: false
                        };
                        scope[entity].
                            buttons = {
                            add: false,
                            edit: false,
                            delete: false,
                            view: false
                        };

                        if (!_.isEmpty(this.selected())) {
                            $('#delete_' + entity + '_Confirmation').modal('show');
                        }
                    },
                    showEdit: function () {
                        this.clear();
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: false,
                            update: true,
                            list: false,
                            details: true
                        };
                        scope[entity].
                            buttons = {
                            add: false,
                            edit: false,
                            delete: false,
                            view: false
                        };
                        this.selectRow();
                    },
                    showView: function (callback) {
                        this.clear();
                        scope[entity]
                            .components = {
                            create: false,
                            delete: false,
                            view: true,
                            update: false,
                            list: false,
                            details: true
                        };
                        scope[entity].
                            buttons = {
                            add: false,
                            edit: false,
                            delete: false,
                            view: false
                        };
                    },
                    selectRow: function () {
                        if ((!_.isEmpty(this.selected()))) {
                            var id = parseInt(this.selected()[0].id);
                            Service.get({id: id}, function (data) {
                                scope[entity].data = data;
                                if (scope[entity].data.fileMaster != undefined && scope[entity].data.fileMaster.id != undefined) {
                                    FileItem.get({fileMasterId: scope[entity].data.fileMaster.id}, function (fileItemData) {
                                        scope[entity].data.fileMaster.fileItem = fileItemData;
                                    })
                                }
                            });
                        }
                    },
                    createOrUpdate: function () {
                        if (scope[entity].components.create) {
                            this.create();
                        } else if (scope[entity].components.update) {
                            this.update();
                        } else {
                            throw "Function CreateOrUpdate was called from other page than showAdd or showUpdate!! Security alert!!!"
                        }
                    },
                    create: function () {
                        var data = scope[entity].data;
                        this.showList();
                        var refreshGrid=this.refresh;
                        Service.save(data,
                            function () {
                                refreshGrid();

                            });
                    },
                    update: function () {
                        var data = scope[entity].data;
                        this.showList();
                        var refreshGrid=this.refresh;
                        Service.update(data,
                            function () {
                                refreshGrid();
                            });
                    },
                    confirmDelete: function (id) {
                        this.showList();
                        var refreshGrid=this.refresh;
                        Service.delete({id: this.selected()[0].id},
                            function () {
                                refreshGrid();
                                $('#delete_' + entity + '_Confirmation').modal('hide');
                            });
                    },
                    selected: function () {
                    },
                    refresh: function () {
                        scope.$broadcast(scope[entity].event.refresh);
                    },
                    redrawGrid: function (grid) {
                    },
                    clear: function () {
                        scope[entity].data = {};
                    }
                }
            };
        }
    }
}]);
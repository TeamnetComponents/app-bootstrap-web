'use strict';


function widgetEffects(element) {
    $(element)
        .draggable({
            revert: true,
            zIndex: 2000,
            cursor: "crosshair",
            handle: '.box-name',
            opacity: 0.8
        })
        .droppable({
            tolerance: 'pointer',
            drop: function (event, ui) {
                var draggable = ui.draggable;
                var droppable = $(this);
                var dragPos = draggable.position();
                var dropPos = droppable.position();
                draggable.swap(droppable);
            }
        }).on('click', '.collapse-link', function (e) {
            e.preventDefault();
            var box = $(this).closest('div.box');
            var button = $(this).find('i');
            var content = box.find('div.box-content');
            content.slideToggle('fast');
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            setTimeout(function () {
                box.resize();
                box.find('[id^=map-]').resize();
            }, 50);
        })
        .on('click', '.close-link', function (e) {
            e.preventDefault();
            var content = $(this).closest('div.box');
            content.remove();
        }).on('click', '.expand-link', function (e) {
            var body = $('body');
            e.preventDefault();
            var box = $(this).closest('div.box');
            var button = $(this).find('i');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            box.toggleClass('expanded');
            body.toggleClass('body-expanded');
            var timeout = 0;
            if (body.hasClass('body-expanded')) {
                timeout = 100;
            }
            setTimeout(function () {
                box.toggleClass('expanded-padding');
            }, timeout);
            setTimeout(function () {
                box.resize();
                box.find('[id^=map-]').resize();
            }, timeout + 50);
        });
}

angular.module('angular-components.appGrid', ['ngGrid','angular-loading-bar', 'pascalprecht.translate'])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = false;
        cfpLoadingBarProvider.includeSpinner = true;
    }])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('gridTemplate.html',
                "<div class=\"ngTopPanel\" ng-class=\"{'ui-widget-header':jqueryUITheme, 'ui-corner-top': jqueryUITheme}\" ng-style=\"topPanelStyle()\">\r" +
                "\n" +
                "    <div class=\"ngGroupPanel\" ng-show=\"showGroupPanel()\" ng-style=\"groupPanelStyle()\">\r" +
                "\n" +
                "        <div class=\"ngGroupPanelDescription\" ng-show=\"configGroups.length == 0\">{{i18n.ngGroupPanelDescription}}</div>\r" +
                "\n" +
                "        <ul ng-show=\"configGroups.length > 0\" class=\"ngGroupList\">\r" +
                "\n" +
                "            <li class=\"ngGroupItem\" ng-repeat=\"group in configGroups\">\r" +
                "\n" +
                "                <span class=\"ngGroupElement\">\r" +
                "\n" +
                "                    <span class=\"ngGroupName\">{{group.displayName}}\r" +
                "\n" +
                "                        <span ng-click=\"removeGroup($index)\" class=\"ngRemoveGroup\">x</span>\r" +
                "\n" +
                "                    </span>\r" +
                "\n" +
                "                    <span ng-hide=\"$last\" class=\"ngGroupArrow\"></span>\r" +
                "\n" +
                "                </span>\r" +
                "\n" +
                "            </li>\r" +
                "\n" +
                "        </ul>\r" +
                "\n" +
                "    </div>\r" +
                "\n" +
                "    <div class=\"ngHeaderContainer\" ng-style=\"headerStyle()\">\r" +
                "\n" +
                "        <div ng-header-row class=\"ngHeaderScroller\" ng-style=\"headerScrollerStyle()\"></div>\r" +
                "\n" +
                "    </div>\r" +
                "\n" +
                "    <div ng-grid-menu></div>\r" +
                //                "---------------\n"+
                " <div class=\"ngHeaderContainer\" ng-style=\"appFilterStyle()\" ng-show=\"showFilterToolbar=='true'\">\r" +
                "\n" +
                "        <div app-filter-grid class=\"ngHeaderScroller\" ng-style=\"appFilterStyle()\"></div>\r" +
                "\n" +
                "    </div>\r" +
//                "---------------\n"+


                "\n" +
                "</div>\r" +
                "\n" +
                "<div class=\"ngViewport\" unselectable=\"on\" ng-viewport ng-class=\"{'ui-widget-content': jqueryUITheme}\" ng-style=\"viewportStyle()\">\r" +
                "\n" +
                "    <div class=\"ngCanvas\" ng-style=\"canvasStyle()\">\r" +
                "\n" +
                "        <div ng-style=\"rowStyle(row)\" ng-repeat=\"row in renderedRows\" ng-click=\"row.toggleSelected($event)\" ng-class=\"row.alternatingRowClass()\" ng-row></div>\r" +
                "\n" +
                "    </div>\r" +
                "\n" +
                "</div>\r" +
                "\n" +
                "<div ng-grid-footer></div>\r" +
                "\n"
        );

        $templateCache.put('app-grid-template.html',
            "<div class=\"box ui-draggable ui-droppable\">"+
            "   <div class=\"box-header\">"+
            "       <div class=\"box-name\">"+
            "           <i class=\"fa fa-list-alt\"></i>"+
            "           <span>{{title}}</span>"+
            "       </div>"+
            "       <div class=\"box-icons\">"+
            "           <toolbar-icon class=\"xls\" ng-click=\"excelExport()\" title-key=\"excel.download\">"+
            "           </toolbar-icon>"+
            "           <a class=\"collapse-link\">"+
            "               <i class=\"fa fa-chevron-up\"></i>"+
            "           </a>"+
            "           <a class=\"expand-link\">"+
            "               <i class=\"fa fa-expand\"></i>"+
            "           </a>"+
            "           <a class=\"close-link\">"+
            "               <i class=\"fa fa-times\"></i>"+
            "           </a>"+
            "       </div>"+
            "       <div class=\"no-move\"></div>"+
            "   </div>"+
            "   <div class=\"box-content\">"+
            "       <div class=\"gridStyle\" ng-grid=\"options\" ng-style=\"gridStyle\"></div>"+
            "   </div>"+
            "</div>"
        );

        $templateCache.put('footerTemplate.html',
            "<div ng-show=\"showFooter\" class=\"ngFooterPanel\" ng-class=\"{'ui-widget-content': jqueryUITheme, 'ui-corner-bottom': jqueryUITheme}\" ng-style=\"footerStyle()\">"+
        "<div class=\"ngTotalSelectContainer\" >"+
        "<div class=\"ngFooterTotalItems\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\" >"+
        "<span class=\"ngLabel\">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show=\"filterText.length > 0\" class=\"ngLabel\">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span>"+
        "</div>"+
        "<div class=\"ngFooterSelectedItems\" ng-show=\"multiSelect\">"+
        "<span class=\"ngLabel\">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>"+
        "</div>"+
        "</div>"+
        "<div class=\"ngPagerContainer\" style=\"float: right; margin-top: 10px;\" ng-show=\"enablePaging\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\">"+
        "<div style=\"float:left; margin-right: 10px;\" class=\"ngRowCountPicker\">"+
        "<span style=\"float: left; margin-top: 3px;\" class=\"ngLabel\">{{i18n.ngPageSizeLabel}}</span>"+
        "<select ui-select2 style=\"float: left;height: 27px; width: 60px\" ng-model=\"pagingOptions.pageSize\">"+
        "<option value=\"\"></option>"+
        "<option ng-repeat=\"size in pagingOptions.pageSizes\">{{size}}</option>"+
        "</select>"+
        "</div>"+
        "<div style=\"float:left; margin-right: 10px; line-height:25px;\" class=\"ngPagerControl\" style=\"float: left; min-width: 135px;\">"+
        "<button type=\"button\" class=\"btn btn-default\" ng-click=\"pageToFirst()\" ng-disabled=\"cantPageBackward()\" title=\"{{i18n.ngPagerFirstTitle}}\"><span class=\"fa fa-fast-backward\"></span></button>"+
        "<button type=\"button\" class=\"btn btn-default\" ng-click=\"pageBackward()\" ng-disabled=\"cantPageBackward()\" title=\"{{i18n.ngPagerPrevTitle}}\"><span class=\"fa fa-step-backward\"></span></button>"+
        "<input class=\"ngPagerCurrent form-control\" min=\"1\" max=\"{{currentMaxPages}}\" type=\"number\" style=\"width:50px; height: 24px; margin-top: 1px; padding: 0 4px; display: inline;\" ng-model=\"pagingOptions.currentPage\"/>"+
        "<span class=\"ngGridMaxPagesNumber\" ng-show=\"maxPages() > 0\">/ {{maxPages()}}</span>"+
        "<button type=\"button\" class=\"btn btn-default\" ng-click=\"pageForward()\" ng-disabled=\"cantPageForward()\" title=\"{{i18n.ngPagerNextTitle}}\"><span class=\"fa fa-step-forward\"></span></button>"+
        "<button type=\"button\" class=\"btn btn-default\" ng-click=\"pageToLast()\" ng-disabled=\"cantPageToLast()\" title=\"{{i18n.ngPagerLastTitle}}\"><span class=\"fa fa-fast-forward\"></span></button>"+
        "</div>"+
        "</div>"+
        "</div>"
        );
        
        $templateCache.put('headerRowTemplate.html',
        "<div ng-style=\"{ height: col.headerRowHeight }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngHeaderCell\">"+
            "<div class=\"ngVerticalBar\" ng-style=\"{height: col.headerRowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div>"+
            "<div ng-header-cell></div>"+
        "</div>");
    }])
    .factory('GridTranslateService', ['$cookieStore', '$translate', function ($cookieStore, $translate) {
        return {
            translate: function (columnDefinitions, primaryKeyMeta,locale) {
                if (columnDefinitions == undefined || columnDefinitions == null || columnDefinitions.length == undefined || columnDefinitions.length < 1)
                    return;

                for (var p = 0; p < columnDefinitions.length; p++) {

                    if (primaryKeyMeta != undefined &&
                        columnDefinitions[p].field.toLowerCase() == primaryKeyMeta.columnName.toLowerCase()) {
                        columnDefinitions[p].visible = primaryKeyMeta.visible;
                    }

                    if (columnDefinitions[p].displayName.indexOf("ROW_NUM") > 0) {
                        columnDefinitions[p].displayName = $translate.instant("grid.rownum.label");
                        columnDefinitions[p].sortable = false;
                    } else {
                        columnDefinitions[p].displayName = $translate.instant(columnDefinitions[p].displayName);
                    }


                    if(columnDefinitions[p].fieldType=="java.util.Date"){
                        columnDefinitions[p].cellFilter= "date:'"+locale.date+"'";
                    }
                }
                return columnDefinitions;
            }
        }
    }])
    .directive('toolbarIcon', ['$translate', function ($translate) {
        return {
            restrict: 'EA',
            scope: {
                class: "@",
                titleKey: "@"
            },

            link: function ($scope, $element) {

                $($element).html(
                        "<a class='" + $scope.class + "'  title='" + $translate.instant($scope.titleKey) + "'><i class='" + $scope.class + "'></i></a>"
                );
            }
        }
    }])
    .directive('appGrid', ['$compile',  '$templateCache','$http', '$resource', '$translate', 'GridTranslateService', '$timeout',
        function ($compile, $templateCache, $http, $resource, $translate, GridTranslateService) {

        return {
            restrict: 'E',
            scope: {
                url: '=',
                downloadUrl: "=",
                customOptions: '=',
                filter: '=',
                refreshFunction: '=',
                onSelectItem:'=',
                autoHeight: '=',
                doPagination: '=',
                doGrouping: '=',
                groupCols: '=',
                key: '=',
                showRowNum: '=',
                showFilterToolbar:'=',
                resizeFunction:'=',
                footerTemplate:'=',
                headerRowTemplate:'='


            }, controller: function ($scope, $attrs, $http, $resource, $translate) {
                $scope.showFilter=false;
                $scope.pagingOptions={};
                $scope.selectedItem={};
                $scope.excelExport = function () {
                    var p = {
                        page: 1,
                        size: 1000000000,
                        filters: $scope.filter,
                        sort: [
                            {}
                        ]
                    };

                    for (var g = 0; g < $scope.sortOptions.fields.length; g++) {
                        var fields_ = $scope.sortOptions.fields[g].split('.');
                        if (fields_.length == 1) {
                            p.sort[g][$scope.sortOptions.fields[g]] = $scope.sortOptions.directions[g];
                        } else {
                            for (var f_ = 0; f_ < fields_.length; f_++) {
                                if (f_ + 1 < fields_.length) {
                                    p.sort[g][fields_[f_]] = {};
                                } else {
                                    p.sort[g][$scope.sortOptions.fields[g]] = $scope.sortOptions.directions[g];
                                }
                            }
                        }
                    }
                };

                $scope.displayedData = [];
                $scope.totalServerItems = 0;
                $scope.dummy = function () {};
                $scope.sortOptions = {
                    fields: [],
                    directions: []
                };

                $scope.gridStyle = {};
                // sort
                $scope.initSort = function () {
                    if ($scope.columnDefs != undefined && Object.keys($scope.columnDefs).length > 0) {
                        $scope.sortOptions.fields[0] = $scope.columnDefs[1].field;
                    }
                    $scope.sortOptions.directions[0] = 'desc';
                    return $scope.sortOptions;
                };

                $scope.afterSelection = function (ngRow) {
                    if (ngRow.selected == true&&angular.isFunction($scope.onSelectItem)) {
                        if (ngRow.entity.hasOwnProperty($scope.primaryKeyName.toLowerCase())
                            ||ngRow.entity.hasOwnProperty($scope.primaryKeyName)) {
                            if(ngRow.entity.hasOwnProperty($scope.primaryKeyName)){
                                $scope.onSelectItem(ngRow.entity[$scope.primaryKeyName],ngRow.entity);

                            }else if(ngRow.entity.hasOwnProperty($scope.primaryKeyName.toLowerCase())){
                                $scope.onSelectItem(ngRow.entity[$scope.primaryKeyName.toLowerCase()],ngRow.entity);
                            }
                        }
                    }
                };
                $scope.getList = function (pageNo) {
                    var p = {
                        page: pageNo,
                        size: $scope.pagingOptions.pageSize,
                        filters: $scope.filter,
                        sort: [
                            {}
                        ]
                    };
                    for (var g = 0; g < $scope.sortOptions.fields.length; g++) {
                        var fields_ = $scope.sortOptions.fields[g].split('.');
                        if (fields_.length == 1) {
                            p.sort[g][$scope.sortOptions.fields[g]] = $scope.sortOptions.directions[g];
                        } else {
                            for (var f_ = 0; f_ < fields_.length; f_++) {
                                if (f_ + 1 < fields_.length) {
                                    p.sort[g][fields_[f_]] = {};
                                } else {
                                    p.sort[g][$scope.sortOptions.fields[g]] = $scope.sortOptions.directions[g];
                                }
                            }
                        }
                    }
                    $http({
                        url: $scope.url,
                        method: "GET",
                        params: p,
                        //todo de vazut care-i forma finala!!!
                        data: {
                            "key": $scope.key,
                            "typeConfiguration": "grid"
                        }
                    }).success(function (content) {
                        if (content.hasOwnProperty("configuration.notfound")) {
                            var configurationNotFoundedMess =
                                $translate.instant("errors.configuration.notfound") + $scope.key;
                            console.error(configurationNotFoundedMess);
                            $scope.title = configurationNotFoundedMess;
                            return;

                        }

                        $scope.totalServerItems = content.data.totalElements;
                        $scope.displayedData = content.data;
                        if ($scope.columnDefs == undefined) {
                            var primaryKeyMeta = undefined;
                            if (content.meta!=null&&content.meta.properties != null && content.meta.properties.primaryKey != undefined &&
                                content.meta.properties.primaryKey != "" && content.meta.properties.primaryKey != null) {
                                primaryKeyMeta = content.meta.properties.primaryKey;
                                $scope.primaryKeyName = content.meta.properties.primaryKey.columnName;
                            }
                            $scope.columnDefs = GridTranslateService.translate(content.meta.properties, primaryKeyMeta,$scope.$root.locale);
                        }
                        $scope.columnDefs[0].visible = $scope.showRowNum === true;

                        if($scope.columnDefs[0].displayName.indexOf("ROW_NUM") > 0)
                            $scope.columnDefs[0].width = 40;

                        $scope.title = $translate.instant(content.meta.title);



                    });
                };

                $scope.resizeGrid = function (gridId) {
                    var gridScope = angular.element("." + gridId).scope();
                    var headerRowHeight = (gridScope.topPanelHeight() == undefined) ? 32 : gridScope.topPanelHeight();
                    var footerRowHeight = (gridScope.showFooter == true) ?
                        ((gridScope.footerRowHeight == undefined) ? 55 : gridScope.footerRowHeight) :
                        0;
                    var rowHeight = (gridScope.rowHeight == undefined) ? 30 : gridScope.rowHeight;
                    var pageSize = (gridScope.renderedRows.length == undefined) ? 0 : gridScope.renderedRows.length;
                    var gridHeight = headerRowHeight + footerRowHeight + (rowHeight * pageSize) + 5;
                    gridHeight = pageSize == 0 ? gridHeight + 20 : gridHeight;
                    var gridWidth = $("." + gridId).width();
                    $scope.gridStyle.height = gridHeight + 'px';
                    if ($scope.doGrouping) {
                        $.each($scope.columnDefs, function (key) {
                            $scope.columnDefs[key].width = (gridWidth - 25) / $scope.columnDefs.length;
                        });
                    }
                    gridScope.adjustScrollLeft();
                    gridScope.adjustScrollTop();
                    $scope.$$postDigest($scope.layoutPlugin.updateGridLayout);
                };

                $scope.refreshGrid = function (currentPage) {
                    if (currentPage == undefined) currentPage = 1;
                    $scope.selectedItem = {};
                    $scope.options.selectedItems = [];
                    $scope.getList(currentPage);
                    $scope.pagingOptions.currentPage = currentPage;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                };

                window.ngGrid.i18n['ro'] = {
                    ngTotalItemsLabel: 'Total: ',
                    ngPageSizeLabel: ''
                };

                var customOptions = $scope.customOptions;

                var fixedOptions = {
                    columnDefs: 'columnDefs',
                    data: 'displayedData.content'
                };

                $scope.pagingOptions = {
                    pageSizes: [5, 10, 20, 30],
                    pageSize: 10,
                    totalServerItems: 0,
                    currentPage: 1
                };

                var defaultOptions = {
                    selectedItems: $scope.selectedItems,
                    enablePaging: ($scope.doPagination != false),
                    multiSelect: false,
                    showFooter: true,
                    pagingOptions: $scope.pagingOptions,
                    sortInfo: $scope.sortOptions,
                    totalServerItems: 'totalServerItems',
                    useExternalSorting: true,
                    enableColumnResize: true,
                    i18n: 'ro',
                    jqueryUITheme: true,
                    showFilter: $scope.showFilter,
                    afterSelectionChange: $scope.afterSelection,
                    footerTemplate: $scope.footerTemplate,
                    headerRowTemplate: $scope.headerRowTemplate,
                    resizable: true

                };

                var groupingOptions = {
                    groups: $scope.groupCols,
                    groupsCollapsedByDefault: false
                };

                //noinspection JSPotentiallyInvalidConstructorUsage
                $scope.layoutPlugin = new ngGridLayoutPlugin();

                $scope.$watch('pagingOptions', function (newVal, oldVal) {
                    if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
                        $scope.refreshGrid(newVal.currentPage);
                    }
                }, true);

                $scope.$watch('sortOptions', function (newVal, oldVal) {
                    if (newVal !== oldVal && oldVal.fields.length > 0) {
                        $scope.refreshGrid($scope.pagingOptions.currentPage);
                    }
                }, true);

                $scope.$watch('filter', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.refreshGrid($scope.pagingOptions.currentPage);
                    }
                }, true);

                $scope.$watch('key', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.refreshGrid($scope.pagingOptions.currentPage);
                    }
                }, true);


                $scope.$watch('columnDefs', function () {
                    $scope.initSort();
                });

                $scope.$on('ngGridEventSorted', function (event, sortInfo) {
                    if (!angular.equals(sortInfo, $scope.options.sortInfo)) {
                        $scope.sortOptions = angular.copy(sortInfo);
                        $scope.options.sortInfo = angular.copy(sortInfo);
                    }
                });

                $scope.options = {
                    plugins: [
                        $scope.layoutPlugin
                    ]
                };

                angular.extend($scope.options, defaultOptions);
                angular.extend($scope.options, customOptions);
                angular.extend($scope.options, fixedOptions);
                if ($scope.doGrouping) {
                    angular.extend($scope.options, groupingOptions);
                }

                $scope.refreshGrid($scope.pagingOptions.currentPage);


            }, link: function ($scope, $element) {
                widgetEffects($($element));

                $scope.resizeFunction=function(){
                    var box = $($element).closest('div.box');
                    box.resize();
                };

                $($element).resize(function () {
                    console.log('resize grid');
                });
                $(window).resize(function () {
                    console.log('resize grid');
                });

                $('.show-sidebar').on('click',function() {

                    window.setTimeout(function () {
                        var box = $($($element)).find('.ngTopPanel');
//                        $scope.options.plugins[0].updateGridLayout();
                        box.resize();
                    }, 100);

                });
                window.setTimeout(function () {
                    $scope.options.plugins[0].updateGridLayout();
                }, 200);
            },
            compile: function () {
                return {
                    pre: function ($scope, iElement) {
                        if (iElement.children().length === 0) {
                            iElement.append($compile($templateCache.get('app-grid-template.html'))($scope));
                        }
                    }
                };
            },
            replace: true,
            transclude: false
        }
    }]);

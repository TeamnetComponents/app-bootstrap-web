bootstrapControllers.controller('MenuController', ['$scope', '$http', '$timeout', 'MenuService', function ($scope, $http, $timeout, MenuService) {
    $scope.toggledAllLabel = 'Expand All';
    $scope.toggledAll = 'down';

    $scope.toggledAllFct = function() {
        if($scope.toggledAll == 'down') {
            $scope.toggledAll = 'up';
            $scope.toggledAllLabel = 'Collapse All';
            $scope.expandAll();
        } else {
            $scope.toggledAll = 'down';
            $scope.toggledAllLabel = 'Expand All';
            $scope.collapseAll();
        }
    };

    MenuService.roles.findAllRoles(params, function(responseData)  {
        $scope.roles = responseData;
    });

    var params = { id: 0 };
    MenuService.simple.findAll(params, function(responseData)  {
        $scope.menus = responseData;
    });

    $scope.reorder = function(tree, parentId) {
        var updates = [];
        for(var i=0; i < tree.length; i++) {
            var prefix = "";
            if(parentId != 0) {
                prefix += parentId+ (parseInt(i) < 9 ? "0" : "");
            }
            var newSortNo = prefix + "" + parseInt(i+1);
            var oldSortNo = tree[i].sortNo;

            if(tree[i].items.length > 0) {
                var children = $scope.reorder(tree[i].items, tree[i].id);
                for(var j = 0; j < children.length; j++) {
                    updates.push(children[j]);    // TODO - concat() won't work - find out why
                }
            }

            if(newSortNo != oldSortNo) {
                var update = {
                    id: tree[i].id,
                    parentId: parentId,
                    property: 'SORT_NO',
                    oldSortNo: oldSortNo,
                    newSortNo: newSortNo
                };

                tree[i].parentId = parentId;
                tree[i].sortNo = newSortNo;

                updates.push(update);
            }
        }

        return updates;
    }

    $scope.treeOptions = {
        dropped: function(event) {
            console.log(event.source);
            console.log(event.dest);
            var tree = $scope.menus;
            var updates = $scope.reorder(tree, 0);

            var url = "data/rest/menu/bulk-update";
            if(updates.length > 0) {
                var params = { update: updates[0] };
                MenuService.bulk.updateSortNo(updates, function(responseData)  {
                    console.log(responseData);
                });
            }
            console.log(updates);
        }
    };

    $scope.selectedItem = {};

    $scope.hasRole = function(selectedMenu, role) {
        var roles = selectedMenu.roles;
        if(!roles) {
            return false;
        }

        for(var i=0; i<roles.length; i++) {
            if(role.name == roles[i].name) {
                return true;
            }
        }

        return false;
    }

    $scope.updateRole = function(event, selectedMenu, role, scope) {
        var el = event.target;

        var roles = selectedMenu.roles;
        if(el.checked) {
            roles.push(role);
        } else {
            var index = 0;
            for(var i=0; i<roles.length; i++) {
                if(role.name == roles[i].name) {
                    index = i;
                    break;
                }
            }

            roles.splice(index, 1);
        }

        var form = scope.menuForm;
        form.$dirty = true;

        selectedMenu.roles = roles;
    }

    $scope.highlightMenu = function(menuId) {
        $('.selected-admin-menu').removeClass('selected-admin-menu');
        $('#menu-handle-'+menuId).addClass('selected-admin-menu');
    };

    $scope.viewMenu = function(scope) {
        $scope.selectedMenu = scope.$modelValue;
        $scope.selectedMenuOffset = $(scope.$element).offset().top - 65;

        $scope.highlightMenu(scope.$modelValue.id);
    };

    $scope.updateSelectedMenuItem = function(scope) {
        var form = scope.menuForm;
        if(form.$dirty) {
            MenuService.action.save($scope.selectedMenu, function(responseData)  {
                alert('Save completed!');
            });
        } else {
            alert('No changes detected!');
        }
    };

    $scope.options = {
    };

    $scope.removeMenu = function(scope) {
        var nodeData = scope.$modelValue;
        if(nodeData.items && nodeData.items.length > 0) {
            var errorMsg = "You can not delete a parent menu. Remove all menu children first!";
            alert(errorMsg);
            return;
        }

        var msg = "Are you sure you want to delete this menu?";
        if(confirm(msg)) {
            if(nodeData.id == $scope.selectedMenu.id) {
                $scope.selectedMenu = null;
            }

            MenuService.action.delete(nodeData, function(responseData)  {
                scope.remove();
            });
        }
    };

    var getRootNodesScope = function() {
        return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
        var scope = getRootNodesScope();
        scope.collapseAll();
    };

    $scope.expandAll = function() {
        var scope = getRootNodesScope();
        scope.expandAll();
    };

    $scope.toggleMenu = function(scope) {
        scope.toggle();
    };

    $scope.newSubItem = function(scope) {
        var msg = "Are you sure you want to add new item?";
        if(!confirm(msg)) {
            return;
        }

        var nodeData = scope.$modelValue;

        var index = nodeData.items.length;
        var parentId = nodeData.id;
        var prefix = "";
        if(parentId != 0) {
            prefix += parentId+ (parseInt(index) < 9 ? "0" : "");
        }
        var sortNo = prefix + "" + parseInt(index+1);

        var newItem = {
            parentId: nodeData.id,
            name: nodeData.name + '.' + (index + 1),
            sortNo: sortNo,
            items: []
        };

        MenuService.action.save(newItem, function(responseData)  {
            nodeData.items.push(responseData);
            scope.expand();

            $scope.selectedMenu = responseData;
            $timeout(function() {
                $scope.highlightMenu(responseData.id);
            }, 100);
        });
    };

    $scope.addRoot = function() {
        var msg = "Are you sure you want to add new root item?";
        if(!confirm(msg)) {
            return;
        }

        var index = $scope.menus.length;
        var sortNo = parseInt(index + 1);

        var newItem = {
            parentId: 0,
            name: 'ROOT.' + (index + 1),
            sortNo: sortNo,
            items: []
        };

        $scope.menus.push(newItem);

        MenuService.action.save(newItem, function(responseData)  {
            $scope.selectedMenu = responseData;
        });
    }
}]);
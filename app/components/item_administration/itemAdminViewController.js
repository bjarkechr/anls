(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('ItemAdminViewController', ItemAdminViewController);

    function ItemAdminViewController($log, dataFormatService, utilityService, itemFactory, blizzardItemFactory, instanceFactory) {
        var vm = this;

        // Properties
        vm.errorMsg = "";

        vm.items = [];
        vm.instances = [];

        vm.addItem_name = "";
        vm.addItem_id = "";
        vm.addItem_instance = "";
        vm.addItem_slot = "";
        vm.addItem_wowHeadLink = "";
        vm.addItem_wowHeadLinkName = "";
        vm.onItemIdOrNameChanged = onItemIdOrNameChanged;

        vm.working = false;

        vm.addItem = addItem;
        vm.clearAddItem = clearAddItem;
        vm.fetchItemData = fetchItemData;

        vm.deleteItem = deleteItem;

        vm.refresh = refresh;


        // Query Rest services
        loadItems();
        loadInstances();

        // Functions

        function refresh() {
            loadItems();
            loadInstances();
        }

        function loadItems() {
            vm.items.length = 0;

            itemFactory.query(null).$promise
                .then(function (items) {
                        vm.items = items;

                        var len = items.length;

                        for (var i = 0; i < len; i++) {
                            vm.items[i].wowHeadLink = utilityService.getWowHeadLink(vm.items[i].id);
                            vm.items[i].wowHeadLinkHeroic = utilityService.getWowHeadLink(vm.items[i].id, "Heroic");
                            vm.items[i].wowHeadLinkMythic = utilityService.getWowHeadLink(vm.items[i].id, "Mythic");
                        }
                    },
                    function (errorMsg) {
                        vm.errorMsg = "Error loading items. Status " + errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details."
                        $log.error(errorMsg);
                    });
        }

        function loadInstances() {
            instanceFactory.query(null).$promise
                .then(function (data) {
                    vm.instances = data;

                    vm.selectedInstance = vm.instances[0];

                    // For now hard code Hellfire Citadel as default instance
                    for (var i = 0; i < vm.instances.length; i++) {
                        if (vm.instances[i].name == "Hellfire Citadel") {
                            vm.addItem_instance = vm.instances[i];
                        }
                    }
                });
        }

        function onItemIdOrNameChanged() {
            if (vm.addItem_id != null && vm.addItem_id != '') {
                vm.addItem_wowHeadLink = utilityService.getWowHeadLink(vm.addItem_id);

                if (vm.addItem_name != null && vm.addItem_name != "") {
                    vm.addItem_wowHeadLinkName = vm.addItem_name;
                } else {
                    vm.addItem_wowHeadLinkName = "Unknown (" + vm.addItem_id + ")";
                }
            } else {
                vm.addItem_wowHeadLink = "";
                vm.addItem_wowHeadLinkName = "";
            }
        }

        function fetchItemData() {
            vm.errorMsg = "";

            if (!vm.addItem_id)
                return;

            vm.working = true;

            var promise = blizzardItemFactory.get({
                itemId: vm.addItem_id,
                context: 'raid-heroic'
            }).$promise;

            promise.then(function (result) {
                        vm.addItem_name = result.name;
                        vm.addItem_slot = utilityService.getSlotNameFromIndex(result.inventoryType);
                    },
                    function (error) {
                        if (error.status == 404) {
                            vm.errorMsg = "Item with item id " + vm.addItem_id + " not found in blizzard API."
                        } else {
                            vm.errorMsg = "Error loading items. Status " + errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details."
                            $log.error(errorMsg);
                        }
                    })
                .finally(
                    function () {
                        vm.working = false;

                        onItemIdOrNameChanged();
                    });
        }

        function addItem(form) {
            vm.working = true;

            var newItem = new itemFactory();

            newItem.id = vm.addItem_id;
            newItem.instance = vm.addItem_instance;
            newItem.name = vm.addItem_name;
            newItem.slot = vm.addItem_slot;

            newItem.$save()
                .then(function () {
                        setTimeout(function () {
                            loadItems();
                            clearAddItem(form);
                        }, 100);
                    },
                    function (error) {
                        if (error.data != null || error.data != "") {
                            vm.errorMsg = error.data;
                        } else {
                            vm.errorMsg = "Error occured while adding new item to server. Check development log for details."
                            $log.error(error);
                        }
                    })
                .finally(function () {
                    vm.working = false;
                });
        }

        function clearAddItem(form) {
            vm.addItem_name = "";
            vm.addItem_id = "";
            vm.addItem_slot = "";

            onItemIdOrNameChanged();

            form.$setPristine();
        }

        function deleteItem(item) {
            item.$delete({
                    itemId: item.id
                })
                .then(function () {
                        setTimeout(function () {
                            loadItems();
                        }, 100);
                    },
                    function (error) {
                        if (error.data != null || error.data != "") {
                            vm.errorMsg = error.data;
                        } else {
                            vm.errorMsg = "Error occured while adding new item to server. Check development log for details."
                            $log.error(error);
                        }
                    });
        }
    }

})();
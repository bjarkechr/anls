(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('ItemAdminViewController', ItemAdminViewController);

    function ItemAdminViewController($log, dataFormatService, itemFactory) {
        var vm = this;

        // Properties
        vm.errorMsg = "";

        vm.items = [];

        vm.addItem_Name = "";
        vm.addItem_id = "";
        vm.addItem_isntance = "";
        vm.addItem_slot = "";

        vm.addItem = addItem;



        // Query Rest services
        loadItems();

        // Functions

        function loadItems() {

            vm.items.length = 0;

            var promise = itemFactory.query(null).$promise;

            promise.then(function (items) {
                    vm.items = items;
                },
                function (errorMsg) {
                    vm.errorMsg = "Error loading items. Status " + errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details."
                    $log.error(errorMsg);
                });
        }

        function addItem() {

        }
    }

})();
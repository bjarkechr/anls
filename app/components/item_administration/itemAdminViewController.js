(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('ItemAdminViewController', ItemAdminViewController);

    function ItemAdminViewController($log, dataFormatService) {
        var vm = this;

        // Properties
        vm.errorMsg = "";

        vm.items = [];

        vm.addItem_ItemName = "";

        vm.addItem = addItem;



        // Query Rest services


        // Functions


        function addItem() {

        }
    }

})();
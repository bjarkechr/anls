(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('AddLootModalViewController', AddLootModalViewController);

    function AddLootModalViewController($log, $modalInstance, players, items, selectedPlayer, buyTypes) {
        var vm = this;

        vm.players = players;
        vm.items = items;
        vm.buyTypes = buyTypes;
        vm.itemQualities = getItemQualities();
        vm.selectedPlayer = selectedPlayer;
        vm.selectedBuyType = "Undefined";
        vm.selectedItemQuality = "Normal";
        vm.selectedItem = "";
        vm.comment = "";


        vm.ok = function () {
            $modalInstance.close({
                player: vm.selectedPlayer,
                item: vm.selectedItem,
                buyType: vm.selectedBuyType,
                itemQuality: vm.selectedItemQuality,
                comment: vm.comment
            });
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };



        // Functions



        function getItemQualities() {
            return ["Normal", "Heroic", "Mythic"];
        }
    }

})();
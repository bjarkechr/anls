(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidDetailAdminAddLootController', RaidDetailAdminAddLootController);

    function RaidDetailAdminAddLootController($log, $modalInstance) {
        var vm = this;

        vm.greeting = "Hello from controller";

        vm.ok = function () {
            $modalInstance.close('OKAY!');
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

})();
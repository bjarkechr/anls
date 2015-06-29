(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidDetailAdminController', RaidDetailAdminController);

    function RaidDetailAdminController($log, $stateParams) {
        var vm = this;
        
        vm.raidId = $stateParams.raidId;

    }

})();
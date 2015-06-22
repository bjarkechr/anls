(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidAdminController', RaidAdminController);

    function RaidAdminController(raidFactory, instanceFactory, $log) {
        var vm = this;

        vm.raids = [];
        vm.instances = [];

        vm.addRaidStartDate = new Date();
        vm.addRaidStartTime = '';

        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            
            vm.datePickerOpened = true;
            
            $log.log(vm.datePickerOpened);
        };

        raidFactory.query(null, raidQueryResult);

        instanceFactory.query(null, instanceQueryResult);

        function raidQueryResult(data) {
            vm.raids = data;
        }

        function instanceQueryResult(data) {
            vm.instances = data;
        }
    }

})();
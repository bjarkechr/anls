(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidDetailAdminController', RaidDetailAdminController);

    function RaidDetailAdminController($log, $stateParams, raidFactory, eventFactory) {
        var vm = this;

        vm.instance = "";
        vm.start = "";
        vm.events = [];

        vm.raidId = $stateParams.raidId;

        var raid = raidFactory.get({
            raidId: vm.raidId
        }).$promise.then(function (raid) {
            vm.instance = raid.instance;
            vm.start = raid.start;
        });

        loadEvents();

        //Functions
        function loadEvents() {
            eventFactory.query({
                raidId: vm.raidId
            }, eventQueryResult);


            function eventQueryResult(data) {
                vm.events = data;
                
                $log.log(vm.events);
            }
        }
    }

})();
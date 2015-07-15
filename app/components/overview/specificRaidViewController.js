(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('SpecificRaidViewController', SpecificRaidViewController);

    function SpecificRaidViewController($log, $stateParams, filterFilter, raidDataFactory, dataFormatService) {
        var vm = this;

        vm.raidId = $stateParams.raidId;

        vm.startDisplayDateStr;
        vm.status = "";
        vm.instance = "";

        vm.events = [];
        vm.activePlayers = [];
        vm.afkPlayers = [];
        vm.queuedPlayers = [];
        vm.inactivePlayers = [];

        vm.isInactivePlayersCollapsed = true;

        loadRaidData();

        // Functions

        function loadRaidData() {
            raidDataFactory.getRaidData(vm.raidId)
                .then(function (result) {
                        vm.instance = result.instance;
                        vm.status = result.status;
                        vm.startDisplayDateStr = result.startDisplayDateStr;

                        vm.activePlayers = result.activePlayers;
                        vm.afkPlayers = result.afkPlayers;
                        vm.queuedPlayers = result.queuedPlayers;
                        vm.inactivePlayers = result.inactivePlayers;

                        vm.events = result.events;
                    },
                    function (errorMsg) {
                        vm.errorMsg = errorMsg;
                    });
        }
    }

})();
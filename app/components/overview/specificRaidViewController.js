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

        vm.orderBy = {
            "activePlayers": {
                column: "ep",
                desc: true
            },
            "afkPlayers": {
                column: "player",
                desc: false
            },
            "queuedPlayers": {
                column: "qp",
                desc: true
            }
        };
        vm.setOrderBy = setOrderBy;

        vm.events = [];
        vm.activePlayers = [];
        vm.afkPlayers = [];
        vm.queuedPlayers = [];
        vm.inactivePlayers = [];

        vm.isInactivePlayersCollapsed = true;
        
        vm.refresh = refresh;

        loadRaidData();

        // Functions
        
        function refresh() {
            loadRaidData();
        }

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

        function setOrderBy(group, column) {
            if (vm.orderBy[group].column == column) {
                vm.orderBy[group].desc = !vm.orderBy[group].desc;
            } else {
                vm.orderBy[group].column = column;
                vm.orderBy[group].desc = false;
            }
        }
    }

})();
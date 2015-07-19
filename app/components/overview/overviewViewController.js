(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('OverviewViewController', OverviewViewController);

    function OverviewViewController($log, $q, playerPointsFactory, playerFactory, raidFactory, dataFormatService, utilityService) {
        var vm = this;

        vm.activeRaids = [];
        vm.plannedRaids = [];
        vm.finishedRaids = [];
        vm.playerPoints = [];
        vm.errorMsg = "";

        vm.orderBy = {
            "players": {
                column: "ep",
                desc: true
            }
        };
        vm.setOrderBy = setOrderBy;

        loadPlayerPoints();
        loadRaids();

        // Functions
        function loadPlayerPoints() {
            vm.playerPoints.length = 0;

            $q.all([playerPointsFactory.query(null).$promise, playerFactory.query(null).$promise])
                .then(function (results) {
                        var playerPoints = results[0];
                        var players = results[1];
                        utilityService.mergePlayerAndPlayerPoints(players, playerPoints);

                        vm.playerPoints = playerPoints;

                        $log.log(vm.playerPoints);
                    },
                    function (errorMsg) {
                        $log.log(errorMsg);
                        vm.errorMsg = errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details.";
                        $log.error(errorMsg);
                    });
        }

        function loadRaids() {
            vm.activeRaids.length = 0;
            vm.plannedRaids.length = 0;
            vm.finishedRaids.length = 0;

            raidFactory.query(null, raidQueryResult);

            function raidQueryResult(data) {
                var raids = data;

                var len = raids.length;
                for (var i = 0; i < len; i++) {

                    raids[i].startDisplayDateStr = dataFormatService.dateToDisplayString(dataFormatService.stringToDate(raids[i].start));

                    if (raids[i].status == "Planned") {
                        vm.plannedRaids.push(raids[i]);
                    }
                    if (raids[i].status == "Active") {
                        vm.activeRaids.push(raids[i]);
                    }
                    if (raids[i].status == "Finished") {
                        vm.finishedRaids.push(raids[i]);
                    }
                }
            }
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
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('OverviewViewController', OverviewViewController);

    function OverviewViewController($log, playerPointsFactory, raidFactory, dataFormatService) {
        var vm = this;

        vm.activeRaids = [];
        vm.plannedRaids = [];
        vm.finishedRaids = [];
        vm.playerPoints = [];


        loadPlayerPoints();
        loadRaids();

        // Functions
        function loadPlayerPoints() {
            vm.playerPoints.length = 0;

            playerPointsFactory.query(null, onLoaded);

            function onLoaded(data) {
                vm.playerPoints = data;
            }
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



    }

})();
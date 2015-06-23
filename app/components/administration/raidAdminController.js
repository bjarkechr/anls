(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidAdminController', RaidAdminController);

    function RaidAdminController(raidFactory, instanceFactory, $log) {
        var vm = this;

        vm.activeRaids = [];
        vm.plannedRaids = [];
        vm.finishedRaids = [];
        vm.instances = [];

        vm.addRaidStartDate = new Date();
        vm.addRaidStartTime = '';
        vm.hours = [];
        vm.minutes = [];
        vm.addRaid = addRaid;
        vm.open = openDatePicker;

        for (var i = 0; i < 24; i++) {
            vm.hours.push({
                value: i,
                text: (i < 10) ? '0' + i.toString() : i.toString()
            });
        }

        for (var i = 0; i < 60; i++) {
            vm.minutes.push({
                value: i,
                text: (i < 10) ? '0' + i.toString() : i.toString()
            });
        }
        vm.startHour = vm.hours[20];
        vm.startMinute = vm.minutes[0];

        raidFactory.query(null, raidQueryResult);
        instanceFactory.query(null, instanceQueryResult);

        function raidQueryResult(data) {
            var raids = data;
            var len = raids.length;
            for (var i = 0; i < len; i++) {
                
                 $log.log(raids[i].status);
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

        function instanceQueryResult(data) {
            vm.instances = data;
        }

        function addRaid() {
            $log.log("submit!");

            var newRaid = new raidFactory();
            newRaid.id = "100";
            newRaid.start = "2015-06-24 20:00:00";
            newRaid.instance = "Blackrock Foundry";
            newRaid.$save();
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.datePickerOpened = true;
        };
    }

})();
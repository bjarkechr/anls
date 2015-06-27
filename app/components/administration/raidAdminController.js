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
        vm.selectedInstance;
        vm.addRaidStartDate = new Date();
        vm.hours = generateHourMinuteArray(24);
        vm.minutes = generateHourMinuteArray(60);
        vm.startHour = vm.hours[20];
        vm.startMinute = vm.minutes[0];
        vm.addRaid = addRaid;
        vm.open = openDatePicker;

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
            
            vm.selectedInstance = vm.instances[0];
        }

        function addRaid() {

            var newRaid = new raidFactory();

            var day = vm.addRaidStartDate.getDate();
            day = (day < 10) ? '0' + day.toString() : day.toString();
            var month = vm.addRaidStartDate.getMonth() + 1;
            month = (month < 10) ? '0' + month.toString() : month.toString();

            var dateString = vm.addRaidStartDate.getFullYear() + "-" + month + "-" + day;
            dateString = dateString + " " + vm.startHour + ":" + vm.startMinute + ":00";

            newRaid.start = dateString;            
            newRaid.instance = vm.selectedInstance.id;
            
            newRaid.$save();
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.datePickerOpened = true;
        };

        function generateHourMinuteArray(max) {
            var result = [];
            for (var i = 0; i < max; i++) {
                result.push(
                    (i < 10) ? '0' + i.toString() : i.toString()
                );
            }
            return result;
        }
    }

})();
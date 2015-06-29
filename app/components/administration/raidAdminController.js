(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidAdminController', RaidAdminController);

    function RaidAdminController(raidFactory, instanceFactory, $log) {
        var vm = this;

        // Properties
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
        vm.deleteRaid = deleteRaid;

        // Query Rest services
        loadRaids();
        loadInstances();

        // Functions
        function loadRaids() {
            vm.activeRaids = [];
            vm.plannedRaids = [];
            vm.finishedRaids = [];

            raidFactory.query(null, raidQueryResult);

            function raidQueryResult(data) {
                $log.log("Raids loaded");
                
                $log.log(data);
                
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
        }

        function loadInstances() {
            instanceFactory.query(null, instanceQueryResult);

            function instanceQueryResult(data) {
                vm.instances = data;

                vm.selectedInstance = vm.instances[0];
            }
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
            newRaid.instance = vm.selectedInstance.name;

            $log.log(newRaid);
            
            newRaid.$save(onSuccess, onError);

            function onSuccess() {
                loadRaids();
            }

            function onError() {
                $log.log("Error adding raid.")
            }
        }

        function deleteRaid(raid) {
            raid.$delete(onSuccess, onError);

            function onSuccess(value, status) {
                $log.log("success! ");
                $log.log(value);
                $log.log(status);

            }

            function onError(data, status) {
                $log.log("Error! ");
                $log.log(value);
                $log.log(status);
            };
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
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidAdminViewController', RaidAdminViewController);

    function RaidAdminViewController(raidFactory, instanceFactory, $log, $window, dataFormatService) {
        var vm = this;

        // Properties
        vm.activeRaids = [];
        vm.plannedRaids = [];
        vm.finishedRaids = [];
        vm.instances = [];
        vm.selectedInstance;
        vm.addRaidStartDate = new Date();
        vm.hours = dataFormatService.generateHourMinuteArray(24);
        vm.minutes = dataFormatService.generateHourMinuteArray(60);
        vm.startHour = vm.hours[20];
        vm.startMinute = vm.minutes[0];
        vm.addRaid = addRaid;
        vm.openDatePicker = openDatePicker;
        vm.deleteRaid = deleteRaid;
        vm.loadRaids = loadRaids;
        vm.addRaidErrorOccured = false;
        vm.addRaidSuccess = false;
        vm.deleteRaidErrorOccured = false;
        vm.datePickerOpened = false;

        // Query Rest services
        loadRaids();
        loadInstances();

        // Functions
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

        function loadInstances() {
            instanceFactory.query(null, instanceQueryResult);

            function instanceQueryResult(data) {
                vm.instances = data;

                vm.selectedInstance = vm.instances[0];

                // For now hard code Hellfire Citadel as default instance
                for (var i = 0; i < vm.instances.length; i++) {
                    if (vm.instances[i].name == "Hellfire Citadel") {
                        vm.selectedInstance = vm.instances[i];
                    }
                }
            }
        }

        function addRaid() {

            var newRaid = new raidFactory();

            var startDate = vm.addRaidStartDate;
            startDate.setHours(parseInt(vm.startHour), parseInt(vm.startMinute), 0);

            newRaid.start = dataFormatService.dateToString(startDate);

            newRaid.instance = vm.selectedInstance.name;

            newRaid.$save(onSuccess, onError);

            function onSuccess() {

                vm.addRaidSuccess = true;

                setTimeout(function () {
                    loadRaids();
                }, 1000);
            }

            function onError() {
                vm.addRaidErrorOccured = true;
            }
        }

        function deleteRaid(raid) {
            raid.$deleteRaid(onSuccess, onError);

            function onSuccess(value, status) {
                setTimeout(function () {
                    loadRaids();
                }, 1000);

            }

            function onError(data, status) {
                vm.deleteRaidErrorOccured = true;
            };
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.datePickerOpened = true;
        };
    }

})();
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('SetNewEventTimestampModelController', SetNewEventTimestampModelController);

    function SetNewEventTimestampModelController($log, $modalInstance, eventDate, dataFormatService) {
        var vm = this;

        vm.eventDate = eventDate;
        $log.log(vm.eventDate);

        vm.hours = dataFormatService.generateHourMinuteArray(24);
        vm.minutes = dataFormatService.generateHourMinuteArray(60);
        vm.seconds = dataFormatService.generateHourMinuteArray(60);
        vm.hour = vm.hours[vm.eventDate.getHours()];
        vm.minute = vm.minutes[vm.eventDate.getMinutes()];
        vm.second = vm.seconds[vm.eventDate.getSeconds()];
        vm.openDatePicker = openDatePicker;
        vm.datePickerOpened = false;
        vm.onDateFieldChanged = onDateFieldChanged;

        vm.ok = function () {
            $log.log(vm.eventDate);

            $modalInstance.close(vm.eventDate);
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // Functions
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.datePickerOpened = true;
        };

        function onDateFieldChanged() {
            vm.eventDate.setHours(vm.hour);
            vm.eventDate.setMinutes(vm.minute);
            vm.eventDate.setSeconds(vm.second);
        }



    }

})();
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .service('dataFormatService', dataFormatService);


    function dataFormatService() {

        this.pad = function (num, size) {
                return ('000000000' + num).substr(-size);
            },

            this.dateToString = function (date) {
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    return false;
                }

                return date.getUTCFullYear() + '-' + this.pad(date.getUTCMonth() + 1, 2) + '-' + this.pad(date.getUTCDate(), 2) + 'T' + this.pad(date.getUTCHours(), 2) + ':' + this.pad(date.getUTCMinutes(), 2) + ':' + this.pad(date.getUTCSeconds(), 2) + 'Z';
            },

            this.dateToDisplayString = function (date) {
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    return false;
                }
                return date.getFullYear() + '-' + this.pad(date.getMonth() + 1, 2) + '-' + this.pad(date.getDate(), 2) + ' ' + this.pad(date.getHours(), 2) + ':' + this.pad(date.getMinutes(), 2) + ':' + this.pad(date.getSeconds(), 2);
            },

            this.stringToDate = function (str) {
                var res = new Date(Date.parse(str));

                return res;
            }

        this.dateToArray = function (date) {
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    return false;
                }

                var dateArray = {};
                dateArray['year'] = date.getFullYear();
                dateArray['month'] = date.getMonth() + 1;
                dateArray['day'] = date.getDate();
                dateArray['hour'] = date.getHours();
                dateArray['minute'] = date.getMinutes();
                dateArray['second'] = date.getSeconds();
                return dateArray;
            },

            this.dateFromArray = function (dateArr) {
                return new Date(
                    dateArr.year,
                    dateArr.month - 1,
                    dateArr.day,
                    dateArr.hour,
                    dateArr.minute,
                    dateArr.second);
            },

            this.generateHourMinuteArray = function (max) {
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
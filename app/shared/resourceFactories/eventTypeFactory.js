(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('eventTypeFactory', eventTypeFactory);

    function eventTypeFactory($resource) {
        return $resource('http://tor.superhelt.org\:8080/types/events');
    }

})();
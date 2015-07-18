(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('eventTypeFactory', eventTypeFactory);

    function eventTypeFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'types/events');
    }

})();
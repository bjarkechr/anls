(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('slotFactory', slotFactory);

    function slotFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'types/slots');
    }

})();
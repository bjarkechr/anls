(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('slotFactory', slotFactory);

    function slotFactory($resource) {
        return $resource('http://tor.superhelt.org\:8080/types/slots');
    }

})();
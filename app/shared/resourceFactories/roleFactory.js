(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('roleFactory', roleFactory);

    function roleFactory($resource) {
        return $resource('http://tor.superhelt.org\:8080/types/roles');
    }

})();
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('buytypeFactory', buytypeFactory);

    function buytypeFactory($resource) {
        return $resource('http://tor.superhelt.org\:8080/types/buytypes');
    }

})();
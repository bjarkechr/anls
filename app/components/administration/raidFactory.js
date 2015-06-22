(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('raidFactory', raidFactory);

    function raidFactory($resource) {
        return $resource('http://tor.superhelt.org:\8080/raids/:raidId');
    }

})();
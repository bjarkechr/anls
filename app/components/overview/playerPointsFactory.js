(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('playerPointsFactory', playerPointsFactory);

    function playerPointsFactory($resource) {
        return $resource('http://tor.superhelt.org\:8080/points');
    }

})();
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('playerFactory', playerFactory);

    function playerFactory($resource) {
        return $resource('http://localhost:8080/players/:playerId');
    }

})();
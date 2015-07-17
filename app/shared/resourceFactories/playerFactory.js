(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('playerFactory', playerFactory);

    function playerFactory($resource) {
        return $resource('http://tor.superhelt.org:\8080/players/:playerId/', {
            playerId: '@id'
        }, {
            'deletePlayer': {
                method: 'DELETE'
            }
        });
    }

})();
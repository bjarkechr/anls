(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('playerFactory', playerFactory);

    function playerFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'players/:playerId/', {
            playerId: '@id'
        }, {
            'deletePlayer': {
                method: 'DELETE'
            }
        });
    }

})();
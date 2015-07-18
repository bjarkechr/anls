(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('playerPointsFactory', playerPointsFactory);

    function playerPointsFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'points');
    }

})();
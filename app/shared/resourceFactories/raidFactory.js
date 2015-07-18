(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('raidFactory', raidFactory);

    function raidFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'raids/:raidId/', {
            raidId: '@id'
        }, {
            'deleteRaid': {
                method: 'DELETE'
            }
        });
    }

})();
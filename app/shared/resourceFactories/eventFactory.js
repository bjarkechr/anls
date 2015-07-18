(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('eventFactory', eventFactory);

    function eventFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'raids/:raidId/events/:eventId', {
            raidId: '@id',
            eventId: '@id'
        }, {
            'delete': {
                method: 'DELETE'
            },
            'update': {
                method: 'PUT'
            }
        });
    }

})();
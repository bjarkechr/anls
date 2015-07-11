(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('eventFactory', eventFactory);

    function eventFactory($resource) {
        return $resource('http://tor.superhelt.org:\8080/raids/:raidId/events/:eventId', {
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
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('instanceItemFactory', instanceItemFactory);

    function instanceItemFactory($resource) {
        return $resource('http://tor.superhelt.org:\8080/instances/:instanceId/items', {
            instanceId: '@id'
        });
    }

})();
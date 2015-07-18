(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('instanceItemFactory', instanceItemFactory);

    function instanceItemFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'instances/:instanceId/items', {
            instanceId: '@id'
        });
    }

})();
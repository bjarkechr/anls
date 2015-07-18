(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('itemFactory', itemFactory);

    function itemFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'items/:itemId', {
            itemId: '@id'
        }, {
            'deleteItem': {
                method: 'DELETE'
            }
        });
    }

})();
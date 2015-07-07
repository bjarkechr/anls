(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('itemFactory', itemFactory);

    function itemFactory($resource) {
        return $resource('http://tor.superhelt.org:\8080/items/:itemId', {
            itemId: '@id'
        }, {
            'deleteItem': {
                method: 'DELETE'
            }
        });
    }

})();
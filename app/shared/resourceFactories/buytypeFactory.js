(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('buytypeFactory', buytypeFactory);

    function buytypeFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'types/buytypes');
    }

})();
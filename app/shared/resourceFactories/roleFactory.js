(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('roleFactory', roleFactory);

    function roleFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'types/roles');
    }

})();
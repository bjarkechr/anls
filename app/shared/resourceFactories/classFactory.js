(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('classFactory', classFactory);

    function classFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'types/classes');
    }

})();
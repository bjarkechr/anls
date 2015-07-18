(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('instanceFactory', instanceFactory);

    function instanceFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'instances');
    }

})();
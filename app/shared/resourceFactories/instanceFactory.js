(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('instanceFactory', instanceFactory);

    function instanceFactory($resource) {
        return $resource('http://tor.superhelt.org:\8080/instances');
    }

})();
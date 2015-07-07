(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('classFactory', classFactory);

    function classFactory($resource) {
        return $resource('http://tor.superhelt.org\:8080/types/classes');
    }

})();
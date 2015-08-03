(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('bonusFactory', bonusFactory);

    function bonusFactory($resource, BASE_API_URL) {
        return $resource(BASE_API_URL + 'types/bonuses');
    }

})();
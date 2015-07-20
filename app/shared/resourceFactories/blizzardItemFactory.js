(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('blizzardItemFactory', blizzardItemFactory);

    function blizzardItemFactory($resource) {
        return $resource('https://eu.api.battle.net/wow/item/:itemId/:context?locale=en_GB&apikey=y3sj5tk7grmdrdqgcday53ahwsmpvycm', {
            itemId: '@id',
            context: '@context'
        });

    }

})();
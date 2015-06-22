(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('OverviewController', OverviewController);

    function OverviewController(playerFactory, $log) {
        var vm = this;
        
        vm.players = [];
        
        playerFactory.query(null, queryResult);
        
        function queryResult(data)
        {
            vm.players = data;
        }
        
        
    }

})();
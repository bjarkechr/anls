(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('OverviewController', OverviewController);

    function OverviewController(playerPointsFactory, $log) {
        var vm = this;
        
        vm.playerPoints = [];
        
        playerPointsFactory.query(null, queryResult);
        
        function queryResult(data)
        {
            vm.playerPoints = data;
        }
        
        
    }

})();
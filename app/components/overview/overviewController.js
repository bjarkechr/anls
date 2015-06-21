(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('OverviewController', OverviewController);

    function OverviewController(playerFactory) {
        var vm = this;
        
        vm.test = '';
        
        playerFactory.query(null, queryResult);
        
        function queryResult()
        {
            
        }
        
        vm.players = [
            {name:'Graznak', points:100, activity:80},
            {name:'Ziktator', points:80, activity:100}            
        ];
    }

})();
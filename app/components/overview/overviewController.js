(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('OverviewController', OverviewController);

    function OverviewController() {
        var vm = this;
        
        vm.players = [
            {name:'Graznak', points:100, activity:80},
            {name:'Ziktator', points:80, activity:100}            
        ];
    }

})();
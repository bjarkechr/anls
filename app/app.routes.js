(function () {
    'use strict';
    angular
        .module('anlsApp')
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /overview
        $urlRouterProvider.otherwise("/overview");

        $stateProvider
            .state('overview', {
                url: "/overview",
                templateUrl: 'app/components/overview/overviewView.html',
                controller: 'OverviewController',
                controllerAs: 'vm'
            })
            .state('raidManagement', {
                url: '/raidManagement',
                templateUrl: 'app/components/administration/raidAdminView.html',
                controller: 'RaidAdminController',
                controllerAs: 'vm'
            })
            .state('raidDetailManagement', {
                url: '/raidManagement/{raidId}',
                templateUrl: 'app/components/administration/raidDetailAdminView.html',
                controller: 'RaidDetailAdminController',
                controllerAs: 'vm'
            });
    }
})();
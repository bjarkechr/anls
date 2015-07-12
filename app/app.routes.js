(function () {
    'use strict';
    angular
        .module('anlsApp')
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /overview
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('overview', {
                url: "/",
                templateUrl: 'app/components/overview/overviewView.html',
                controller: 'OverviewViewController',
                controllerAs: 'vm'
            })
            .state('viewRaid', {
                url: "/raid/:raidId",
                templateUrl: 'app/components/overview/specificRaidView.html',
                controller: 'SpecificRaidViewController',
                controllerAs: 'vm'
            })
            .state('raidManagement', {
                url: '/raidManagement',
                templateUrl: 'app/components/administration/raidAdminView.html',
                controller: 'RaidAdminViewController',
                controllerAs: 'vm'
            })
            .state('raidDetailManagement', {
                url: '/raidManagement/:raidId',
                templateUrl: 'app/components/administration/raidAdminDetailView.html',
                controller: 'RaidAdminDetailViewController',
                controllerAs: 'vm'
            });
    }

    function run(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
})();
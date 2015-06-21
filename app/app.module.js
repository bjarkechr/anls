(function () {
    'use strict';
    angular
        .module('anlsApp', ['ui.router', 'ngResource']);
    
    angular
    .module('anlsApp').config(['$httpProvider', function($httpProvider) {
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
    
})();
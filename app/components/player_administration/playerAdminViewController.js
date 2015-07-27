(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('PlayerAdminViewController', PlayerAdminViewController);

    function PlayerAdminViewController($log, dataFormatService, utilityService, playerFactory, classFactory, roleFactory) {
        var vm = this;

        // Properties
        vm.errorMsg = "";
        vm.working = false;

        vm.players = [];
        vm.classes = [];
        vm.roles = [];

        vm.addPlayer_name = "";
        vm.addPlayer_class = "";
        vm.addPlayer_role = "";
        vm.addPlayer_isAdmin = false;

        vm.filter = "";

        vm.addPlayer = addPlayer;
        vm.clearAddPlayer = clearAddPlayer;

        vm.refresh = refresh;

        // Query Rest services
        refresh();

        // Functions

        function refresh() {
            loadPlayers();
            loadClasses();
            loadRoles();
        }

        function loadPlayers() {
            vm.players.length = 0;

            playerFactory.query(null).$promise
                .then(function (players) {
                        vm.players = players;
                    },
                    function (errorMsg) {
                        vm.errorMsg = "Error loading players. Status " + errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details."
                        $log.error(errorMsg);
                    });
        }

        function loadClasses() {
            classFactory.query(null).$promise
                .then(function (data) {
                        vm.classes = data;

                        vm.addPlayer_class = vm.classes[0];
                    },
                    function (errorMsg) {
                        vm.errorMsg = "Error loading classes. Status " + errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details."
                        $log.error(errorMsg);
                    });
        }

        function loadRoles() {
            roleFactory.query(null).$promise
                .then(function (data) {
                        vm.roles = data;
                        vm.addPlayer_role = vm.roles[0];
                    },
                    function (errorMsg) {
                        vm.errorMsg = "Error loading roles. Status " + errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details."
                        $log.error(errorMsg);
                    });
        }

        function addPlayer(form) {
            vm.working = true;

            var newPlayer = new playerFactory();

            newPlayer.name = vm.addPlayer_name;
            newPlayer.class = vm.addPlayer_class;
            newPlayer.role = vm.addPlayer_role;
            newPlayer.isAdmin = vm.addPlayer_isAdmin;

            newPlayer.$save()
                .then(function () {
                        setTimeout(function () {
                            loadPlayers();
                            clearAddPlayer(form);
                        }, 100);
                    },
                    function (error) {
                        if (error.data != null || error.data != "") {
                            vm.errorMsg = error.data;
                        } else {
                            vm.errorMsg = "Error occured while adding new player to server. Check development log for details."
                            $log.error(error);
                        }
                    })
                .finally(function () {
                    vm.working = false;
                });
        }

        function clearAddPlayer(form) {
            vm.addPlayer_name = "";
            vm.addPlayer_class = vm.classes[0];
            vm.addPlayer_role = vm.roles[0];
            vm.addPlayer_isAdmin = false;

            form.$setPristine();
        }
    }

})();
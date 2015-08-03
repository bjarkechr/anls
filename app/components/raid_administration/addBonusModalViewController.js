(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('AddBonusModalViewController', AddBonusModalViewController);

    function AddBonusModalViewController($log, $modalInstance, activePlayers, queuedPlayers, afkPlayers, bonusFactory) {
        var vm = this;

        vm.players = [];
        vm.bonusTxt = "";
        vm.bonusAmount = 0;
        vm.bonusTxts = [];
        vm.errorMsg = "";

        vm.ok = acceptModal;

        vm.cancel = cancelModal;

        init();

        // Functions

        function init() {
            // Init players
            for (var i = 0; i < activePlayers.length; i++) {
                addPlayer(activePlayers[i], "Active");
            }

            for (var i = 0; i < queuedPlayers.length; i++) {
                addPlayer(queuedPlayers[i], "Queued");
            }

            for (var i = 0; i < afkPlayers.length; i++) {
                addPlayer(afkPlayers[i], "Afk");
            }

            function addPlayer(player, status) {
                vm.players.push(player);
                vm.players[vm.players.length - 1].isChecked = false;
                vm.players[vm.players.length - 1].status = status;
                vm.players[vm.players.length - 1].statusOrderBy = status == "Active" ? 1 : status == "Queued" ? 2 : 3;
            }

            // Init bonusses
            bonusFactory.query(null).$promise
                .then(function (result) {
                        vm.bonusTxts = result;
                    },
                    function (error) {
                        if (error.data != null && error.data != "") {
                            vm.errorMsg = error.data;
                        } else {
                            vm.errorMsg = "Error occured while adding new player to server. Check development log for details."
                            $log.error(error);
                        }
                    });
        }

        function acceptModal() {
            var len = vm.players.length;
            var checkedPlayers = [];
            for (var i = 0; i < len; i++) {
                if (vm.players[i].isChecked) {
                    checkedPlayers.push(vm.players[i]);
                }
            }

            $modalInstance.close({
                bonusTxt: vm.bonusTxt,
                bonusAmount: vm.bonusAmount,
                bonusPlayers: checkedPlayers
            });
        };

        function cancelModal() {
            $modalInstance.dismiss('cancel');
        };

        function checkPlayers(who) {

            for (var i = 0; i < vm.players.length; i++) {
                if (who == "All" || (who == "Active" && vm.players[i].status == "Active") || (who == "ActiveQueued" && (vm.players[i].status == "Active" || vm.players[i].status == "Queued"))) {
                    vm.players.isChecked = true;
                }
            }
        }

    }

})();
(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidAdminDetailViewController', RaidAdminDetailViewController);

    function RaidAdminDetailViewController($log, $stateParams, $modal, raidDataFactory, filterFilter, eventFactory, dataFormatService, buytypeFactory) {
        var vm = this;

        vm.raidId = $stateParams.raidId;

        vm.errorMsg = "";

        vm.raidData = {};

        vm.instance = "";
        vm.status = "";
        vm.startDisplayDateStr;
        vm.isStartRaidPossible = false;
        vm.isFinishRaidPossible = false;

        vm.activePlayers = [];
        vm.afkPlayers = [];
        vm.queuedPlayers = [];
        vm.inactivePlayers = [];
        vm.isInactivePlayersCollapsed = true;

        vm.orderBy = {
            "activePlayers": {
                column: "ep",
                desc: true
            },
            "afkPlayers": {
                column: "player",
                desc: false
            },
            "queuedPlayers": {
                column: "qp",
                desc: true
            }
        };
        vm.setOrderBy = setOrderBy;

        vm.items = [];
        vm.buyTypes = [];

        vm.events = [];
        vm.enableEventEdit = false;
        vm.eventFilter = eventFilter;
        vm.eventFilterAdd = false;
        vm.eventFilterBonus = false;
        vm.eventFilterAfk = false;
        vm.eventFilterQueue = false;
        vm.eventFilterBuy = false;

        vm.refresh = refresh;

        vm.addPlayerToRaid = addPlayerToRaid;
        vm.deleteEvent = deleteEvent;
        vm.afkPlayer = afkPlayer;
        vm.queuePlayer = queuePlayer;
        vm.returnAfkPlayer = returnAfkPlayer;
        vm.returnQueuePlayer = returnQueuePlayer;
        vm.startRaid = startRaid;
        vm.finishRaid = finishRaid;

        vm.openAddLootModal = openAddLootModal;
        vm.openSetNewEventTimestampModal = openSetNewEventTimestampModal;
        vm.openAddBonusModal = openAddBonusModal;

        vm.lastItemQualityLootGiven = "";

        // Load data
        loadRaidData();

        loadBuyTypes();

        // Functions

        function refresh() {
            loadRaidData();
        }

        function loadRaidData() {
            raidDataFactory.getRaidData(vm.raidId)
                .then(function (result) {

                        vm.raidData = result;

                        vm.instance = result.instance;
                        vm.status = result.status;
                        vm.startDisplayDateStr = result.startDisplayDateStr;
                        vm.isStartRaidPossible = result.isStartRaidPossible;
                        vm.isFinishRaidPossible = result.isFinishRaidPossible;

                        vm.activePlayers = result.activePlayers;
                        vm.afkPlayers = result.afkPlayers;
                        vm.queuedPlayers = result.queuedPlayers;
                        vm.inactivePlayers = result.inactivePlayers;

                        vm.events = result.events;

                        vm.items = result.instanceItems;

                    },
                    function (errorMsg) {
                        vm.errorMsg = errorMsg.status + " (" + errorMsg.statusText + ") - Check development log for details.";
                        $log.error(errorMsg);
                    });
        }

        function loadBuyTypes() {
            vm.buyTypes.length = 0;

            buytypeFactory.query(null, onLoaded);

            function onLoaded(data) {
                vm.buyTypes = data;
            }
        }

        function setOrderBy(group, column) {
            if (vm.orderBy[group].column == column) {
                vm.orderBy[group].desc = !vm.orderBy[group].desc;
            } else {
                vm.orderBy[group].column = column;
                vm.orderBy[group].desc = false;
            }
        }

        function eventFilter(event) {

            return (event.type == "Buy" && !vm.eventFilterBuy) || (event.type == "Add" && !vm.eventFilterAdd) || (event.type == "Bonus" && !vm.eventFilterBonus) || ((event.type == "AFK" || event.type == "ReturnAFK") && !vm.eventFilterAfk) || ((event.type == "Queue" || event.type == "ReturnQueue") && !vm.eventFilterQueue) || (event.type == "Start" || event.type == "Finish");;
        }

        function deleteEvent(event) {
            vm.errorMsg = "";

            eventFactory.delete({
                    raidId: vm.raidId,
                    eventId: event.id
                }).$promise
                .then(function () {
                        setTimeout(function () {
                            loadRaidData();
                        }, 100);
                    },
                    function (reason) {
                        vm.errorMsg = "Error occured while deleting event.<br> " + reason;
                    });
        }

        function startRaid() {
            createAndSendEvent("Start", null, modifyEvent, "Error occured while starting raid.");

            function modifyEvent(event) {
                event.amount = 10;
            }
        }

        function finishRaid() {
            createAndSendEvent("Finish", null, null, "Error occured while finishing raid.");
        }

        function addPlayerToRaid(player) {
            createAndSendEvent("Add", [player.player], null, "Error occured while adding player to raid.");
        }

        function afkPlayer(playername) {
            createAndSendEvent("AFK", [playername], null, "Error occured while setting player AFK.");
        }

        function returnAfkPlayer(playername) {
            createAndSendEvent("ReturnAFK", [playername], null, "Error occured while returning player from afk.");
        }

        function queuePlayer(playername) {
            createAndSendEvent("Queue", [playername], null, "Error occured while queuing player.");
        }

        function returnQueuePlayer(playername) {
            createAndSendEvent("ReturnQueue", [playername], null, "Error occured while returning player from queue.");
        }

        function addBonusToPlayers(bonusTxt, bonusAmount, players) {
            var len = players.length;
            if (len > 0) {

                var playerNames = [];

                for (var i = 0; i < len; i++) {
                    playerNames.push(players[i].player);
                }

                createAndSendEvent("Bonus", playerNames, function (event) {
                        event.amount = bonusAmount;
                        event.comment = bonusTxt;
                    },
                    "Error occured while adding bonus to players.");
            }
        }

        function createAndSendEvent(type, players, modifyEventCallback, errorMsg) {
            vm.errorMsg = "";

            var event = new eventFactory();
            event.type = type;
            if (players != null) {
                event.players = players;
            }
            event.date = dataFormatService.dateToString(new Date());

            if (modifyEventCallback != null) {
                modifyEventCallback(event);
            }

            event.$save({
                    raidId: vm.raidId
                })
                .then(function () {
                        setTimeout(function () {
                            loadRaidData();
                        }, 100);
                    },
                    function (reason) {
                        vm.errorMsg = errorMsg + ". Reason: " + reason.data;
                    });
        }

        function modifyEvent(event, eventDate) {
            vm.errorMsg = "";

            eventFactory.get({
                    raidId: vm.raidId,
                    eventId: event.id
                }).$promise
                .then(function (eventFac) {
                    eventFac.date = dataFormatService.dateToString(eventDate);

                    eventFac.$update({
                        raidId: vm.raidId,
                        eventId: event.id
                    }).then(function () {
                            setTimeout(function () {
                                loadRaidData();
                            }, 100);
                        },
                        onError);
                }, onError);

            function onError(reason) {
                vm.errorMsg = "Error modifying event. Reason: " + reason.data;
            }
        }

        function addLootToPlayer(loot) {
            vm.lastItemQualityLootGiven = loot.itemQuality;

            createAndSendEvent("Buy", [loot.player.player], modifyEvent, "Error occured while adding item to player.");

            function modifyEvent(event) {
                event.buyType = loot.buyType;
                event.item = loot.item.id;
                event.itemQuality = loot.itemQuality;

                if (loot.comment != null) {
                    event.comment = loot.comment;
                }
            }
        }

        function openAddLootModal(player) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/components/raid_administration/addLootModalView.html',
                controller: 'AddLootModalViewController as vm',
                resolve: {
                    players: function () {
                        return vm.activePlayers;
                    },
                    items: function () {
                        return vm.items;
                    },
                    selectedPlayer: function () {
                        return player;
                    },
                    buyTypes: function () {
                        return vm.buyTypes;
                    },
                    itemQuality: function () {
                        return vm.lastItemQualityLootGiven;
                    }
                }
            });

            modalInstance.result.then(function (loot) {
                    addLootToPlayer(loot);
                },
                function () {});
        }

        function openSetNewEventTimestampModal(event) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/components/raid_administration/setEventDateModalView.html',
                controller: 'SetEventDateModalViewController as vm',
                resolve: {
                    eventDate: function () {
                        return event.parsedDate;
                    }
                }
            });

            modalInstance.result.then(function (eventDate) {
                    modifyEvent(event, eventDate);
                },
                function () {});
        }

        function openAddBonusModal() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/components/raid_administration/addBonusModalView.html',
                controller: 'AddBonusModalViewController as vm',
                resolve: {
                    activePlayers: function () {
                        return vm.activePlayers;
                    },
                    queuedPlayers: function () {
                        return vm.queuedPlayers;
                    },
                    afkPlayers: function () {
                        return vm.afkPlayers;
                    }                    
                }
            });

            modalInstance.result.then(function (bonus) {
                    addBonusToPlayers(bonus.bonusTxt, bonus.bonusAmount, bonus.bonusPlayers);
                },
                function () {});
        }
    }

})();
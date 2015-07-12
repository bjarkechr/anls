(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidAdminDetailViewController', RaidAdminDetailViewController);

    function RaidAdminDetailViewController($log, $stateParams, $modal, filterFilter, raidFactory, eventFactory, itemFactory, playerPointsFactory, dataFormatService, buytypeFactory) {
        var vm = this;

        vm.raidId = $stateParams.raidId;
        vm.instance = "";
        vm.startDisplayDateStr;
        vm.status = "";
        vm.errorOccured = false;
        vm.errorMsg = "";
        vm.items = [];
        vm.events = [];
        vm.activePlayers = [];
        vm.afkPlayers = [];
        vm.queuedPlayers = [];
        vm.inactivePlayers = [];
        vm.buyTypes = [];
        vm.isInactivePlayersCollapsed = true;
        vm.addPlayerToRaid = addPlayerToRaid;
        vm.deleteEvent = deleteEvent;
        vm.afkPlayer = afkPlayer;
        vm.queuePlayer = queuePlayer;
        vm.returnAfkPlayer = returnAfkPlayer;
        vm.returnQueuePlayer = returnQueuePlayer;
        vm.openAddLootModal = openAddLootModal;
        vm.startRaid = startRaid;
        vm.finishRaid = finishRaid;
        vm.isStartRaidPossible = false;
        vm.isFinishRaidPossible = false;
        vm.enableEventEdit = false;
        vm.openSetNewEventTimestampModal = openSetNewEventTimestampModal;

        loadItems();
        loadBuyTypes();

        // Functions

        function openAddLootModal(player) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/components/administration/addLootModalView.html',
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
                    }
                }
            });

            modalInstance.result.then(function (loot) {
                    addLootToPlayer(loot);
                },
                function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        }

        function openSetNewEventTimestampModal(event) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/components/administration/setEventDateModalView.html',
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
                function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        }

        function loadItems() {
            vm.items.length = 0;
            itemFactory.query(null, onItemsLoaded);

            function onItemsLoaded(data) {
                vm.items = data;

                loadRaid();
            }
        }

        function loadRaid() {

            vm.events.length = 0;
            vm.afkPlayers.length = 0;
            vm.queuedPlayers.length = 0;
            vm.activePlayers.length = 0;

            var raid = raidFactory.get({
                raidId: vm.raidId
            }).$promise.then(onRaidLoaded);

            function onRaidLoaded(raid) {
                vm.instance = raid.instance;

                vm.startDisplayDateStr = dataFormatService.dateToDisplayString(dataFormatService.stringToDate(raid.start));

                vm.status = raid.status;

                vm.isStartRaidPossible = vm.status == "Planned";
                vm.isFinishRaidPossible = vm.status == "Active";

                getEvents(raid.events);

                updatePlayerArrays(raid.points, raid.afk, raid.queue);

                updateInactivePlayers(raid.points);
            }

            function getEvents(events) {
                var eventLength = events.length;
                for (var i = 0; i < eventLength; i++) {

                    vm.events.push(events[i]);

                    // Convert event.date string to javascript date object and save this as a property.
                    vm.events[i].parsedDate = dataFormatService.stringToDate(vm.events[i].date);
                    vm.events[i].displayDate = dataFormatService.dateToDisplayString(vm.events[i].parsedDate);
                    vm.events[i].canBeModified = vm.events[i].id != null && vm.events[i].id != "";

                    if (vm.events[i].type == "Buy") {
                        var item = getItemById(vm.events[i].item);
                        if (item != null) {
                            vm.events[i].itemName = item.name + " (" + vm.events[i].itemQuality + ")";
                        }
                    } else {
                        vm.events[i].itemName = "";
                    }
                }

                function getItemById(itemId) {
                    var itemsLength = vm.items.length;
                    var item;
                    for (var i = 0; i < itemsLength; i++) {
                        if (vm.items[i].id == itemId) {
                            item = vm.items[i];
                            break;
                        }
                    }
                    return item;
                }
            }

            function updatePlayerArrays(points, afkPlayerNames, queuedPlayerNames) {

                var pointsLength = points.length;
                var afkLength = afkPlayerNames.length;
                var queuedLength = queuedPlayerNames.length;

                for (var i = 0; i < pointsLength; i++) {

                    // Distribute point records between activePlayers, afkPlayers and queuedPlayers arrays.
                    if (afkLength > 0 && isPlayerInArray(points[i].player, afkPlayerNames, afkLength)) {
                        vm.afkPlayers.push(points[i]);
                    } else if (queuedLength > 0 && isPlayerInArray(points[i].player, queuedPlayerNames, queuedLength)) {
                        vm.queuedPlayers.push(points[i]);
                    } else {
                        vm.activePlayers.push(points[i]);
                    }
                }

                function isPlayerInArray(playerName, arr, arrLength) {
                    var rv = false;
                    for (var i = 0; i < arrLength; i++) {
                        rv = arr[i] === playerName;

                        if (rv) break;
                    }
                    return rv;
                }
            }

            function updateInactivePlayers(activePlayerPoints) {
                vm.inactivePlayers.length = 0;

                playerPointsFactory.query(null, onPlayersLoaded);

                function onPlayersLoaded(allPlayerPoints) {
                    var len = allPlayerPoints.length;

                    for (var i = 0; i < len; i++) {
                        // Use a filter to figure out whether this player exists in array of active players or not.
                        var filterArr = filterFilter(activePlayerPoints, {
                            player: allPlayerPoints[i].player
                        });

                        // if filterArr contains any elements then it is because we have a match in active players
                        // and this player should _not_ be included in list of inactive players.
                        if (filterArr.length == 0) {
                            vm.inactivePlayers.push(allPlayerPoints[i]);
                        }
                    }
                }
            }
        }

        function loadBuyTypes() {
            vm.buyTypes.length = 0;

            buytypeFactory.query(null, onLoaded);

            function onLoaded(data) {
                vm.buyTypes = data;
            }
        }

        function deleteEvent(event) {
            vm.errorOccured = false;
            vm.errorMsg = "";

            eventFactory.delete({
                    raidId: vm.raidId,
                    eventId: event.id
                }, onSuccess,
                onError);

            function onSuccess() {
                setTimeout(function () {
                    loadRaid();
                }, 1000);
            }

            function onError(reason) {
                vm.errorOccured = true;
                vm.errorMsg = "Error occured while deleting event.<br> " + reason;
            }
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
            createAndSendEvent("Add", player.player, null, "Error occured while adding player to raid.");
        }

        function afkPlayer(playername) {
            createAndSendEvent("AFK", playername, null, "Error occured while setting player AFK.");
        }

        function returnAfkPlayer(playername) {
            createAndSendEvent("ReturnAFK", playername, null, "Error occured while returning player from afk.");
        }

        function queuePlayer(playername) {
            createAndSendEvent("Queue", playername, null, "Error occured while queuing player.");
        }

        function returnQueuePlayer(playername) {
            createAndSendEvent("ReturnQueue", playername, null, "Error occured while returning player from queue.");
        }

        function addLootToPlayer(loot) {
            createAndSendEvent("Buy", loot.player.player, modifyEvent, "Error occured while adding item to player.");

            function modifyEvent(event) {
                event.buyType = loot.buyType;
                event.item = loot.item.id;
                event.itemQuality = loot.itemQuality;

                if (loot.comment != null) {
                    event.comment = loot.comment;
                }
            }
        }

        function createAndSendEvent(type, playername, modifyEventCallback, errorMsg) {
            vm.errorOccured = false;
            vm.errorMsg = "";

            var event = new eventFactory();
            event.type = type;
            if (playername != null) {
                event.players = [playername];
            }
            event.date = dataFormatService.dateToString(new Date());

            if (modifyEventCallback != null) {
                modifyEventCallback(event);
            }

            var promise = event.$save({
                raidId: vm.raidId
            });

            promise.then(onSuccess,
                onError);

            function onSuccess() {
                setTimeout(function () {
                    loadRaid();
                }, 1000);
            }

            function onError(reason) {
                vm.errorOccured = true;
                vm.errorMsg = errorMsg + ". Reason: " + reason.data;
            }
        }

        function modifyEvent(event, eventDate) {
            vm.errorOccured = false;
            vm.errorMsg = "";

            $log.log(event);

            eventFactory.get({
                raidId: vm.raidId,
                eventId: event.id
            }, onGetSuccess, onError);

            function onGetSuccess(eventFac) {
                eventFac.date = dataFormatService.dateToString(eventDate);

                var promise = eventFac.$update({
                    raidId: vm.raidId,
                    eventId: event.id
                });

                promise.then(onSuccess,
                    onError);

                function onSuccess() {
                    setTimeout(function () {
                        loadRaid();
                    }, 1000);
                }
            }

            function onError(reason) {
                vm.errorMsg = "Error modifying event. Reason: " + reason.data;
            }
        }
    }

})();
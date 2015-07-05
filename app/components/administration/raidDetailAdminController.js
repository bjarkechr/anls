(function () {
    'use strict';

    angular
        .module('anlsApp')
        .controller('RaidDetailAdminController', RaidDetailAdminController);

    function RaidDetailAdminController($log, $stateParams, filterFilter, raidFactory, eventFactory, itemFactory, playerPointsFactory, dataFormatService) {
        var vm = this;

        vm.raidId = $stateParams.raidId;
        vm.instance = "";
        vm.start = "";
        vm.status = "";
        vm.items = [];
        vm.events = [];
        vm.activePlayers = [];
        vm.afkPlayers = [];
        vm.queuedPlayers = [];
        vm.inactivePlayers = [];
        vm.isInactivePlayersCollapsed = true;

        $log.log();

        vm.addPlayerToRaid = addPlayerToRaid;

        loadItems();

        // Functions

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
                vm.start = raid.start;
                vm.status = raid.status;

                getEvents(raid.events);

                updatePlayerArrays(raid.points, raid.afk, raid.queue);

                updateInactivePlayers(raid.points);
            }

            function getEvents(events) {
                var eventLength = events.length;
                for (var i = 0; i < eventLength; i++) {
                    vm.events.push(events[i]);

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

        function addPlayerToRaid(player) {
            var event = new eventFactory();
            event.type = "Add";
            event.players = [player.player];
            event.date = dataFormatService.dateToString(new Date());
            var promise = event.$save({
                raidId: vm.raidId
            });
            
            promise.catch(onError);
            
            function onError(reason){
                $log.log("Add player failed. Reason: " + reason);
            }
        }
    }

})();
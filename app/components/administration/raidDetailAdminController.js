(function () {
        'use strict';

        angular
            .module('anlsApp')
            .controller('RaidDetailAdminController', RaidDetailAdminController);

        function RaidDetailAdminController($log, $stateParams, raidFactory, eventFactory, itemFactory) {
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

                    getEvents(raid.events);

                    updatePlayerArrays(raid.points, raid.afk, raid.queue);
                    
                    $log.log(vm.activePlayers);
                    $log.log(vm.queuedPlayers);
                    $log.log(vm.afkPlayers);
                }

                function getEvents(events) {
                    var eventLength = events.length;
                    for (var i = 0; i < eventLength; i++) {
                        vm.events.push(events[i]);
                        $log.log(vm.events[i]);

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
                }
            }

        })();
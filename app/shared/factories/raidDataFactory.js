(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('raidDataFactory', raidDataFactory);

    function raidDataFactory($log, $q, filterFilter, raidFactory, playerPointsFactory, instanceFactory, instanceItemFactory, dataFormatService) {

        function updatePlayerArrays(points, afkPlayerNames, queuedPlayerNames, raidData) {
            var pointsLength = points.length;
            var afkLength = afkPlayerNames.length;
            var queuedLength = queuedPlayerNames.length;

            // Distribute point records between activePlayers, afkPlayers and queuedPlayers arrays.
            for (var i = 0; i < pointsLength; i++) {
                if (afkLength > 0 && isPlayerInArray(points[i].player, afkPlayerNames, afkLength)) {
                    raidData.afkPlayers.push(points[i]);
                } else if (queuedLength > 0 && isPlayerInArray(points[i].player, queuedPlayerNames, queuedLength)) {
                    raidData.queuedPlayers.push(points[i]);
                } else {
                    raidData.activePlayers.push(points[i]);
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

        function updateInactivePlayers(activePlayerPoints, allPlayerPoints, raidData) {
            var len = allPlayerPoints.length;

            for (var i = 0; i < len; i++) {
                // Use a filter to figure out whether this player exists in array of active players or not.
                var filterArr = filterFilter(activePlayerPoints, {
                    player: allPlayerPoints[i].player
                });

                // if filterArr contains any elements then it is because we have a match in active players
                // and this player should _not_ be included in list of inactive players.
                if (filterArr.length == 0) {
                    raidData.inactivePlayers.push(allPlayerPoints[i]);
                }
            }
        }

        function getItemById(itemId, items) {
            var itemsLength = items.length;
            var item;
            for (var i = 0; i < itemsLength; i++) {
                if (items[i].id == itemId) {
                    item = items[i];
                    break;
                }
            }
            return item;
        }

        return {
            getRaidData: function (raidId) {

                var deferred = $q.defer();
                var raidData = {};

                var ppFactPromise = playerPointsFactory.query(null).$promise;
                var raidFactPromise = raidFactory.get({
                    raidId: raidId
                }).$promise;
                var instanceFactPromise = instanceFactory.query(null).$promise;

                $q.all([raidFactPromise, ppFactPromise, instanceFactPromise])
                    .then(function (results) {
                            var raidFactResult = results[0];
                            var ppFactResult = results[1];
                            var instFactResult = results[2];

                            raidData.instance = raidFactResult.instance;
                            raidData.startDate = dataFormatService.stringToDate(raidFactResult.start);
                            raidData.startDisplayDateStr = dataFormatService.dateToDisplayString(raidData.startDate);
                            raidData.status = raidFactResult.status;
                            raidData.isStartRaidPossible = raidData.status == "Planned";
                            raidData.isFinishRaidPossible = raidData.status == "Active";

                            raidData.events = raidFactResult.events;

                            //Initialize arrays
                            raidData.activePlayers = [];
                            raidData.afkPlayers = [];
                            raidData.queuedPlayers = [];
                            raidData.inactivePlayers = [];

                            raidData.instanceItems = [];


                            updatePlayerArrays(raidFactResult.points, raidFactResult.afk, raidFactResult.queue, raidData);

                            updateInactivePlayers(raidFactResult.points, ppFactResult, raidData);

                            //Get instance ID from instance name
                            var instanceId = null;
                            for (var i = 0; i < instFactResult.length; i++) {
                                if (instFactResult[i].name == raidData.instance) {
                                    instanceId = instFactResult[i].id;
                                    break;
                                }
                            }
                            if (instanceId != null) {
                                return instanceItemFactory.query({
                                    instanceId: instanceId
                                }).$promise;
                            } else {
                                return $q.reject("No instance id found for instance " + raidData.instance);
                            }
                        },
                        function (errorMsg) {
                            return $q.reject(errorMsg);
                        })
                    .then(function (result) {
                            //Save items found in instance
                            raidData.instanceItems = result;

                            //Extend events with bind-friendly properties
                            var eventLength = raidData.events.length;
                            for (var i = 0; i < eventLength; i++) {

                                // Convert event.date string to javascript date object and save this as a property.
                                raidData.events[i].parsedDate = dataFormatService.stringToDate(raidData.events[i].date);
                                raidData.events[i].displayDate = dataFormatService.dateToDisplayString(raidData.events[i].parsedDate);
                                raidData.events[i].canBeModified = raidData.events[i].id.length > 0;

                                // For buy events lookup item by Id and add name of bought item
                                if (raidData.events[i].type == "Buy") {
                                    var item = getItemById(raidData.events[i].item, raidData.instanceItems);
                                    if (item != null) {
                                        raidData.events[i].itemName = item.name + " (" + raidData.events[i].itemQuality + ")";
                                    }
                                } else {
                                    raidData.events[i].itemName = "";
                                }
                            }

                            deferred.resolve(raidData);
                        },
                        function (errorMsg) {
                            deferred.reject(errorMsg);
                        });

                return deferred.promise;
            }
        }
    }

})();
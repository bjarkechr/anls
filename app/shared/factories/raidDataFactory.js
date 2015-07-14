(function () {
    'use strict';

    angular
        .module('anlsApp')
        .factory('raidDataFactory', raidDataFactory);

    function raidDataFactory(raidFactory, playerPointsFactory, $log, $q, filterFilter, dataFormatService) {

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

        return {
            getRaidData: function (raidId) {

                var deferred = $q.defer();

                var ppFactPromise = playerPointsFactory.query(null).$promise;

                var raidFactPromise = raidFactory.get({
                    raidId: raidId
                }).$promise;

                $q.all([raidFactPromise, ppFactPromise])
                    .then(function (results, res) {

                            var raidFactResult = results[0];
                            var ppFactResult = results[1];

                            var raidData = {};

                            raidData.instance = raidFactResult.instance;
                            raidData.startDate = dataFormatService.stringToDate(raidFactResult.start);
                            raidData.startDisplayDateStr = dataFormatService.dateToDisplayString(raidData.startDate);
                            raidData.status = raidFactResult.status;
                            raidData.isStartRaidPossible = raidData.status == "Planned";
                            raidData.isFinishRaidPossible = raidData.status == "Active";

                            //Initialize arrays
                            raidData.activePlayers = [];
                            raidData.afkPlayers = [];
                            raidData.queuedPlayers = [];
                            raidData.inactivePlayers = [];

                            updatePlayerArrays(raidFactResult.points, raidFactResult.afk, raidFactResult.queue, raidData);

                            updateInactivePlayers(raidFactResult.points, ppFactResult, raidData);

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
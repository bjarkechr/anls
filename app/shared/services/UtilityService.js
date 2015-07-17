(function () {
    'use strict';

    angular
        .module('anlsApp')
        .service('utilityService', utilityService);


    function utilityService() {
        this.getClassColor = function (clss) {
                var classColorMap = {
                    "deathknight": "#C41F3B",
                    "druid": "#FF7D0A",
                    "hunter": "#ABD473",
                    "mage": "#69CCF0",
                    "monk": "#00FF96",
                    "paladin": "#F58CBA",
                    "priest": "#FFFFFF",
                    "rogue": "#FFF569",
                    "shaman": "#0070DE",
                    "warlock": "#9482C9",
                    "warrior": "#C79C6E"
                };
                return classColorMap[clss.toLowerCase()];
            },
            this.mergePlayerAndPlayerPoints = function (players, playerPoints) {
                var playerPointsLen = playerPoints.length;
                var playersLen = players.length;
                var playerFound = false;

                for (var i = 0; i < playerPointsLen; i++) {
                    // Find matching player with name in players
                    playerFound = false;
                    for (var j = 0; j < playersLen; j++) {
                        if (players[j].name == playerPoints[i].player) {
                            playerPoints[i].playerClass = players[j].class;
                            playerPoints[i].playerRole = players[j].role;

                            playerPoints[i].playerClassColor = this.getClassColor(players[j].class);

                            playerFound = true;
                            break;
                        }
                    }

                    if (!playerFound) {
                        $log.error("No player record found for: " + playerPoints[i].player);
                    }
                }
            }
    }

})();
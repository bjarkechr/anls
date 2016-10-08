(function () {
    'use strict';

    angular
        .module('anlsApp')
        .service('utilityService', utilityService);


    function utilityService($log) {
        this.getClassColor = function (clss) {
                var classColorMap = {
		    "demonhunter": "#A330C9",
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
            },
            this.getWowHeadLink = function (itemId, itemQuality) {

                var link = "http://www.wowhead.com/item=" + itemId;

                if (itemQuality == "Heroic") {
                    link += "?bonus=566";
                } else if (itemQuality == "Mythic") {
                    link += "?bonus=567";
                } else {
                    //Nothing
                }
                return link;
            },
            this.getSlotNameFromIndex = function (index) {
                var slotType = {
                    '0': 'None',
                    '1': 'Head',
                    '2': 'Neck',
                    '3': 'Shoulders',
                    '4': 'Shirt',
                    '5': 'Chest',
                    '6': 'Waist',
                    '7': 'Legs',
                    '8': 'Feet',
                    '9': 'Wrist',
                    '10': 'Hands',
                    '11': 'Finger',
                    '12': 'Trinket',
                    '13': 'One-Hand',
                    '14': 'Shield',
                    '15': 'Ranged',
                    '16': 'Cloak',
                    '17': 'Two-Hand',
                    '18': 'Bag',
                    '19': 'Tabard',
                    '20': 'Chest', //Robe
                    '21': 'Weapon', //Main Hand
                    '22': 'Weapon', //Off Hand
                    '23': 'Held In Off-hand',
                    '24': 'Ammo',
                    '25': 'Thrown',
                    '26': 'Ranged Right',
                    '28': 'Relic'
                };
                return slotType[index];
            }
    }

})();

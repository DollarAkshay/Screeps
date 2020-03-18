const GLOBAL = require('globals');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function firstRun () {
    Game.spawns[SPAWN_NAME].memory['creepCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['upgraderCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['harvesterCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['builderCount'] = 0;
}

module.exports = {
    firstRun
};

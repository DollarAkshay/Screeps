
const GLOBAL = require('globals');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function resetCounters () {
    Game.spawns[SPAWN_NAME].memory['upgraderCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['harvesterCount'] = 0;
}

module.exports = {
    resetCounters
};

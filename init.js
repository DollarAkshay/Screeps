const GLOBAL = require('globals');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

function firstRun () {
    Game.spawns[SPAWN_NAME].memory['creepCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['upgraderCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['harvesterCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['builderCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['repairerCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['haulerCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['sourceFreeSpotCount'] = [3, 1, 0, 0, 0]; // Set this to the number of free spots left around a resource
    Game.spawns[SPAWN_NAME].memory['sourceMinerCount'] = [0, 0, 0, 0, 0];
}

module.exports = {
    firstRun
};

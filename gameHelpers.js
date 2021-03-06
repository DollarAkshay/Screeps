
const GLOBAL = require('globals');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

function resetCounters () {
    Game.spawns[SPAWN_NAME].memory['upgraderCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['harvesterCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['builderCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['repairerCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['haulerCount'] = 0;
    Game.spawns[SPAWN_NAME].memory['sourceMinerCount'] = [0, 0, 0, 0, 0];
}

function clearMemory () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function resetMineSources () {
    for (let name in Memory.creeps) {
        delete Memory.creeps[name]['mineSource'];
    }
    return true;
}

module.exports = {
    resetCounters,
    clearMemory,
    resetMineSources
};

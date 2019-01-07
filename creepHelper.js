const GLOBAL = require('globals');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Increment the counter of each creep type in memory
 * @param {Creep} creep - Creep Object
 */
function incrementCreepTypeCounter (creep) {
    let role = creep.memory.role;
    Game.spawns[SPAWN_NAME].memory[role + 'Count'] += 1;
}

module.exports = {
    incrementCreepTypeCounter
};

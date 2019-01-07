const GLOBAL = require('globals');
const gameHelpers = require('gameHelpers');
const harvester = require('harvester');
const upgrader = require('upgrader');
const builder = require('builder');
const init = require('init');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

module.exports.loop = function () {
    if (Game.spawns[SPAWN_NAME].memory['initialized'] === undefined) {
        init.firstRun();
        Game.spawns[SPAWN_NAME].memory['initialized'] = true;
    }

    if (Game.spawns[SPAWN_NAME].energy === Game.spawns[SPAWN_NAME].energyCapacity) {
        let upgraderCount = Game.spawns[SPAWN_NAME].memory['upgraderCount'];
        let harvesterCount = Game.spawns[SPAWN_NAME].memory['harvesterCount'];

        if (upgraderCount < harvesterCount && upgraderCount < 3) {
            Game.spawns[SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], 'Upgrader_' + upgraderCount, {
                memory: {role: 'upgrader'}
            });
        }
        else if (harvesterCount < 6) {
            Game.spawns[SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], 'Harvester_' + harvesterCount, {
                memory: {role: 'harvester'}
            });
        }
    }

    gameHelpers.resetCounters();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            harvester.run(creep);
        }
        else if (creep.memory.role === 'upgrader') {
            upgrader.run(creep);
        }
        else if (creep.memory.role === 'builder') {
            builder.run(creep);
        }
        else {
            console.log('Creep Role undefined');
        }
    }
}
;

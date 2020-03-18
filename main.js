const GLOBAL = require('globals');
const gameHelpers = require('gameHelpers');
const harvester = require('unit_harvester');
const upgrader = require('unit_upgrader');
const builder = require('unit_builder');
const init = require('init');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function spawnCreeps () {
    // Spawn Creeps
    let creepCount = Game.spawns[SPAWN_NAME].memory['creepCount'];
    let spawn = Game.spawns[SPAWN_NAME];

    if (spawn.memory['harvesterCount'] < 6) {
        let spawnStatus = spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester_' + creepCount, {
            dryRun: true,
            memory: {role: 'harvester'}
        });
        if (spawnStatus !== OK) {
            console.log('Error in spawning :', spawnStatus);
        }
        else {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester_' + creepCount, {
                memory: {role: 'harvester'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['upgraderCount'] < 3) {
        let spawnStatus = spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader_' + creepCount, {
            dryRun: true,
            memory: {role: 'upgrader'}
        });
        if (spawnStatus !== OK) {
            console.log('Error in spawning :', spawnStatus);
        }
        else {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader_' + creepCount, {
                memory: {role: 'upgrader'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['builderCount'] < 3) {
        let spawnStatus = spawn.spawnCreep([WORK, CARRY, MOVE], 'Builder_' + creepCount, {
            dryRun: true,
            memory: {role: 'builder'}
        });
        if (spawnStatus !== OK) {
            console.log('Error in spawning :', spawnStatus);
        }
        else {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Builder_' + creepCount, {
                memory: {role: 'builder'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
}

module.exports.loop = function () {
    gameHelpers.clearMemory();

    if (Game.spawns[SPAWN_NAME].memory['initialized'] === undefined) {
        init.firstRun();
        Game.spawns[SPAWN_NAME].memory['initialized'] = true;
    }

    spawnCreeps();

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

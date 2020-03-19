const GLOBAL = require('globals');
const gameHelpers = require('gameHelpers');
const harvester = require('unit_harvester');
const upgrader = require('unit_upgrader');
const builder = require('unit_builder');
const repairer = require('unit_repairer');
const hauler = require('unit_hauler');
const init = require('init');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function calculateStage () {
    let stage = 1;

    let containerCount = Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {
        filter: {structureType: STRUCTURE_CONTAINER}
    }).length;
    let extensionCount = Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {
        filter: {structureType: STRUCTURE_CONTAINER}
    }).length;

    if (extensionCount >= 5 && containerCount >= 1) {
        stage = 2;
    }

    Game.spawns[SPAWN_NAME].memory['Stage'] = stage;
}

function stage2Spawns () {
    let creepCount = Game.spawns[SPAWN_NAME].memory['creepCount'];
    let spawn = Game.spawns[SPAWN_NAME];

    if (spawn.memory['haulerCount'] < 1) {
        let bodyParts = [CARRY, CARRY, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Hauler_' + creepCount, {
            dryRun: true,
            memory: {role: 'hauler'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Hauler_' + creepCount, {
                memory: {role: 'hauler'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    if (spawn.memory['harvesterCount'] < 6) {
        let bodyParts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
            dryRun: true,
            memory: {role: 'harvester'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
                memory: {role: 'harvester'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['upgraderCount'] < 2) {
        let bodyParts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
            dryRun: true,
            memory: {role: 'upgrader'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
                memory: {role: 'upgrader'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['builderCount'] < 2) {
        let bodyParts = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
            dryRun: true,
            memory: {role: 'builder'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
                memory: {role: 'builder'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['repairerCount'] < 1) {
        let bodyParts = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Repairer_' + creepCount, {
            dryRun: true,
            memory: {role: 'repairer'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Repairer_' + creepCount, {
                memory: {role: 'repairer'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
}

function stage1Spawns () {
    let creepCount = Game.spawns[SPAWN_NAME].memory['creepCount'];
    let spawn = Game.spawns[SPAWN_NAME];

    if (spawn.memory['harvesterCount'] < 6) {
        let bodyParts = [WORK, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
            dryRun: true,
            memory: {role: 'harvester'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
                memory: {role: 'harvester'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['upgraderCount'] < 3) {
        let bodyParts = [WORK, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
            dryRun: true,
            memory: {role: 'upgrader'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
                memory: {role: 'upgrader'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['builderCount'] < 3) {
        let bodyParts = [WORK, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
            dryRun: true,
            memory: {role: 'builder'}
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
                memory: {role: 'builder'}
            });
            spawn.memory['creepCount'] += 1;
        }
    }
}

function spawnCreeps () {
    let stage = Game.spawns[SPAWN_NAME].memory['Stage'];
    if (stage === 2) {
        stage2Spawns();
    }
    else {
        stage1Spawns();
    }
}

module.exports.loop = function () {
    gameHelpers.clearMemory();

    if (Game.spawns[SPAWN_NAME].memory['initialized'] === undefined) {
        init.firstRun();
        Game.spawns[SPAWN_NAME].memory['initialized'] = true;
    }

    calculateStage();
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
        else if (creep.memory.role === 'repairer') {
            repairer.run(creep);
        }
        else if (creep.memory.role === 'hauler') {
            hauler.run(creep);
        }
        else {
            console.log('Creep Role undefined');
        }
    }
}
;

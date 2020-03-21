const GLOBAL = require('globals');
const gameHelpers = require('gameHelpers');
const harvester = require('unit_harvester');
const upgrader = require('unit_upgrader');
const builder = require('unit_builder');
const repairer = require('unit_repairer');
const hauler = require('unit_hauler');
const tower = require('unit_tower');
const init = require('init');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

function calculateStage () {
    let stage = 1;
    let spawn = Game.spawns[SPAWN_NAME];

    let containerCount = spawn.room.find(FIND_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_CONTAINER
        }
    }).length;
    let extensionCount = spawn.room.find(FIND_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_EXTENSION
        }
    }).length;

    if (extensionCount >= 5 && containerCount >= 1 && (spawn.memory['harvesterCount'] >= 1 || spawn.room.energyAvailable > 600)) {
        stage = 2;
    }

    spawn.memory['stage'] = stage;
}

function stage2Spawns () {
    let creepCount = Game.spawns[SPAWN_NAME].memory['creepCount'];
    let spawn = Game.spawns[SPAWN_NAME];
    let constructionSiteCount = Game.spawns[SPAWN_NAME].room.find(FIND_MY_CONSTRUCTION_SITES).length;
    let towerCount = Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER;
        }
    }).length;

    if (spawn.memory['haulerCount'] < 1) {
        let bodyParts = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Hauler_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'hauler'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Hauler_' + creepCount, {
                memory: {
                    role: 'hauler'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['harvesterCount'] < 2) {
        let bodyParts = [WORK, WORK, WORK, WORK, WORK, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'harvester'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
                memory: {
                    role: 'harvester'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['haulerCount'] < 3) {
        let bodyParts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Hauler_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'hauler'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Hauler_' + creepCount, {
                memory: {
                    role: 'hauler'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['upgraderCount'] < 5) {
        let bodyParts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'upgrader'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
                memory: {
                    role: 'upgrader'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['builderCount'] < 2 && constructionSiteCount > 0) {
        let bodyParts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'builder'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
                memory: {
                    role: 'builder'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['repairerCount'] < 1 && towerCount === 0) {
        let bodyParts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Repairer_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'repairer'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Repairer_' + creepCount, {
                memory: {
                    role: 'repairer'
                }
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
            memory: {
                role: 'harvester'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Harvester_' + creepCount, {
                memory: {
                    role: 'harvester'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['upgraderCount'] < 3) {
        let bodyParts = [WORK, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'upgrader'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Upgrader_' + creepCount, {
                memory: {
                    role: 'upgrader'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
    else if (spawn.memory['builderCount'] < 3) {
        let bodyParts = [WORK, CARRY, MOVE];
        let spawnStatus = spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
            dryRun: true,
            memory: {
                role: 'builder'
            }
        });
        if (spawnStatus === OK) {
            spawn.spawnCreep(bodyParts, 'Builder_' + creepCount, {
                memory: {
                    role: 'builder'
                }
            });
            spawn.memory['creepCount'] += 1;
        }
    }
}

function spawnCreeps () {
    let stage = Game.spawns[SPAWN_NAME].memory['stage'];
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

    // Creep Code
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
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

    // Tower Code
    let towers = Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER;
        }
    });
    for (let t of towers) {
        tower.run(t);
    }
};

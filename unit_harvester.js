const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function bestSource (creep) {
    // Harvest Energy sources
    let energySources = creep.room.find(FIND_SOURCES);
    if (energySources.length > 0) {
        if (creep.memory['mineSource'] === undefined || creep.memory['mineSource'] === -1) {
            let spots = Game.spawns[SPAWN_NAME].memory['sourceFreeSpotCount'];
            let miners = Game.spawns[SPAWN_NAME].memory['sourceMinerCount'];
            let bestRatio = 1000000;
            let bestMine = -1;
            for (let i = 0; i < spots.length; i++) {
                if (spots[i] !== 0) {
                    let curRatio = miners[i] / spots[i];
                    if (curRatio < bestRatio) {
                        bestMine = i;
                        bestRatio = curRatio;
                    }
                }
            }
            creep.memory['mineSource'] = bestMine;
            Game.spawns[SPAWN_NAME].memory['sourceMinerCount'][bestMine] += 1;
        }
        return energySources[creep.memory['mineSource']];
    }

    console.log('No energy sources found');
    return null;
}

function bestStorageTarget (creep, stage) {
    if (stage === 2) {
        let closestStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
    }

    if (Game.spawns[SPAWN_NAME].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return Game.spawns[SPAWN_NAME];
    }

    let closestExtension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (closestExtension !== null) {
        return closestExtension;
    }

    let closestContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (closestContainer !== null) {
        return closestContainer;
    }

    return null;
}

function run (creep) {
    let stage = Game.spawns[SPAWN_NAME].memory['Stage'];
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy < creep.carryCapacity) {
        let source = bestSource(creep);
        let harvestStatus = creep.harvest(source);
        if (harvestStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(source, {visualizePathStyle: GLOBAL.HARVESTER_PATH});
            if (moveStatus !== OK) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (harvestStatus !== OK) {
            console.log(creep.name, '|', 'Error in harvesting :', harvestStatus);
        }
    }
    else {
        var storageTarget = bestStorageTarget(creep, stage);
        if (storageTarget !== null) {
            let transferStatus = creep.transfer(storageTarget, RESOURCE_ENERGY);
            if (transferStatus === ERR_NOT_IN_RANGE) {
                let moveStatus = creep.moveTo(storageTarget, {visualizePathStyle: GLOBAL.HARVESTER_PATH});
                if (moveStatus !== OK) {
                    console.log(creep.name, '|', 'Error in Moving :', moveStatus);
                }
            }
        }
        else {
            console.log('Transfering energy to Controller as all storages are full');
            let upgradeStatus = creep.upgradeController(creep.room.controller);
            if (upgradeStatus === ERR_NOT_IN_RANGE) {
                let moveStatus = creep.moveTo(creep.room.controller);
                if (moveStatus !== OK) {
                    console.log(creep.name, '|', 'Error in Moving :', moveStatus);
                }
            }
            else if (upgradeStatus !== OK) {
                console.log(creep.name, '|', 'Error in upgrading :', upgradeStatus);
            }
        }
    }
}

module.exports = {
    run
};

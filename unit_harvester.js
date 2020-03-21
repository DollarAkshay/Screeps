const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Process State function
 * @param {Creep} creep - Creep Object
 */
function processState (creep) {
    let carryBodypartCount = _.filter(creep.body, bodyPart => {
        return bodyPart.type === CARRY;
    }).length;

    if (creep.store.getFreeCapacity() === 0 && carryBodypartCount > 0) {
        if (creep.memory['status'] !== 'Transfering') {
            creep.say('🚛 Transfering');
        }
        creep.memory['status'] = 'Transfering';
    }
    else if (creep.store.getUsedCapacity() === 0) {
        if (creep.memory['status'] !== 'Harvesting') {
            creep.say('🌞 Harvesting');
        }
        creep.memory['status'] = 'Harvesting';
    }
    else if (creep.memory['status'] === undefined) {
        creep.memory['status'] = 'Harvesting';
    }
}

/**
 * Find the best source function
 * @param {Creep} creep - Creep Object
 */
function bestSource (creep) {
    let energySources = creep.room.find(FIND_SOURCES);
    if (energySources.length > 0) {
        // Calculate mine source if not stored
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
        }

        Game.spawns[SPAWN_NAME].memory['sourceMinerCount'][creep.memory['mineSource']] += 1;
        return energySources[creep.memory['mineSource']];
    }

    console.log('No energy sources found');
    return null;
}

/**
 * Find the best storage function
 * @param {Creep} creep - Creep Object
 */
function bestStorageTarget (creep) {
    let stage = Game.spawns[SPAWN_NAME].memory['stage'];

    if (stage === 2) {
        let closestStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (closestStorage !== null) {
            return closestStorage;
        }
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

/**
 * Harvest function
 * @param {Creep} creep - Creep Object
 */
function harvest (creep) {
    let source = bestSource(creep);

    let harvestStatus = creep.harvest(source);
    if (harvestStatus === ERR_NOT_IN_RANGE) {
        let closestContainer = source.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER;
            }
        });
        let moveStatus = creep.moveTo(closestContainer.pos, {visualizePathStyle: GLOBAL.HARVESTER_PATH});
        if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
            console.log(creep.name, '|', 'Error in Moving :', moveStatus);
        }
    }
    else if (harvestStatus !== OK) {
        console.log(creep.name, '|', 'Error in harvesting :', harvestStatus);
    }
}

/**
 * Transfer function
 * @param {Creep} creep - Creep Object
 */
function transfer (creep) {
    let storageTarget = bestStorageTarget(creep);
    if (storageTarget !== null) {
        let transferStatus = creep.transfer(storageTarget, RESOURCE_ENERGY);
        if (transferStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(storageTarget, {visualizePathStyle: GLOBAL.HARVESTER_PATH});
            if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
    }
    else {
        console.log('Transfering energy to Controller as all storages are full');
        let upgradeStatus = creep.upgradeController(creep.room.controller);
        if (upgradeStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(creep.room.controller);
            if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (upgradeStatus !== OK) {
            console.log(creep.name, '|', 'Error in upgrading :', upgradeStatus);
        }
    }
}

/**
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);
    processState(creep);

    if (creep.memory['status'] === 'Harvesting') {
        harvest(creep);
    }
    else if (creep.memory['status'] === 'Transfering') {
        transfer(creep);
    }
    else {
        console.log(creep.name, '|', 'Unknown Status :', creep.memory['status']);
    }
}

module.exports = {
    run
};

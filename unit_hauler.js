const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    let closestTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    let closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    let closestDroppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
            return resource.resourceType === RESOURCE_ENERGY;
        }
    });

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && closestTarget !== null) {
        let transferStatus = creep.transfer(closestTarget, RESOURCE_ENERGY);
        if (transferStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(closestTarget, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (transferStatus !== OK) {
            console.log(creep.name, '|', 'Error in transfering :', transferStatus);
        }
    }
    else if (closestDroppedEnergy !== null) {
        let pickupStatus = creep.pickup(closestDroppedEnergy);
        if (pickupStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(closestDroppedEnergy, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (pickupStatus !== OK) {
            console.log(creep.name, '|', 'Error in picking up :', pickupStatus);
        }
    }
    else if (closestTarget !== null) {
        let withdrawStatus = creep.withdraw(closestContainer, RESOURCE_ENERGY);
        if (withdrawStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(closestContainer, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else if (withdrawStatus !== OK) {
            console.log(creep.name, '|', 'Error in withdrawing :', withdrawStatus);
        }
    }
    else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        let transferStatus = creep.transfer(closestContainer, RESOURCE_ENERGY);
        if (transferStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(closestContainer, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (transferStatus !== OK) {
            console.log(creep.name, '|', 'Error in transfering :', transferStatus);
        }
    }
}

module.exports = {
    run
};

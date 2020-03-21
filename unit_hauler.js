const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Process State function
 * @param {Creep} creep - Creep Object
 */
function processState (creep) {
    if (creep.store.getUsedCapacity() === 0 && creep.room.find(FIND_DROPPED_RESOURCES).length > 0) {
        if (creep.memory['status'] !== 'Pickup') {
            creep.say('Pickup');
        }
        creep.memory['status'] = 'Pickup';
    }
    else if (creep.store.getUsedCapacity() === 0) {
        if (creep.memory['status'] !== 'Withdraw') {
            creep.say('Withdraw');
        }
        creep.memory['status'] = 'Withdraw';
    }
    else if (creep.store.getUsedCapacity() > 0) {
        if (creep.memory['status'] !== 'Transfer') {
            creep.say('Transfer');
        }
        creep.memory['status'] = 'Transfer';
    }
    else if (creep.memory['status'] === undefined) {
        creep.memory['status'] = 'Withdraw';
    }
}

/**
 * Find the best place to pickup resources
 * @param {Creep} creep - Creep Object
 */
function bestPickupSource (creep) {
    let pickupTarget = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
            return resource.resourceType === RESOURCE_ENERGY;
        }
    });
    if (pickupTarget !== null) {
        return pickupTarget;
    }

    return null;
}

/**
 * Find the best place to withdraw resources
 * @param {Creep} creep - Creep Object
 */
function bestWithdrawSource (creep) {
    // Tombstones
    let tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
        filter: (structure) => {
            return structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (tombstone !== null) {
        return tombstone;
    }

    // Mining containers
    let miningContainers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER && GLOBAL.MINER_CONTAINERS.includes(structure.id) === true &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (miningContainers.length > 0) {
        miningContainers.sort((a, b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));
        return miningContainers[0];
    }

    // Non-mining containers
    let nonminingContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER && GLOBAL.MINER_CONTAINERS.includes(structure.id) === false &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (nonminingContainer != null) {
        return nonminingContainer;
    }

    // Spawn
    if (Game.spawns[SPAWN_NAME].store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return Game.spawns[SPAWN_NAME];
    }

    return null;
}

/**
 * Find the best place to drop resources
 * @param {Creep} creep - Creep Object
 */
function bestTransferSource (creep) {
    // Extensions
    let extenstions = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (extenstions !== null) {
        return extenstions;
    }

    // Spawn
    if (Game.spawns[SPAWN_NAME].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return Game.spawns[SPAWN_NAME];
    }

    // Towers
    let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > structure.store.getCapacity(RESOURCE_ENERGY) / 2;
        }
    });
    if (tower != null) {
        return tower;
    }

    // Non-Mining Containers
    let nonminingContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER && GLOBAL.MINER_CONTAINERS.includes(structure.id) === false &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (nonminingContainer != null) {
        return nonminingContainer;
    }

    return null;
}

/**
 * Pickup function
 * @param {Creep} creep - Creep Object
 */
function pickup (creep) {
    // If no pickup target is defined, choose one
    if (creep.memory['pickupTarget'] === undefined) {
        let target = bestPickupSource(creep);
        if (target !== null) {
            creep.memory['pickupTarget'] = target.id;
        }
    }

    if (creep.memory['pickupTarget'] !== undefined) {
        let pickupTarget = Game.getObjectById(creep.memory['pickupTarget']);
        let pickupStatus = creep.pickup(pickupTarget);
        if (pickupStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(pickupTarget, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (pickupStatus !== OK && pickupStatus !== ERR_BUSY) {
            console.log(creep.name, '|', 'Error in picking up :', pickupStatus);
            delete creep.memory['pickupTarget'];
        }
        else {
            delete creep.memory['pickupTarget'];
        }
    }
    else {
        console.log(creep.name, '|', 'No pickup target found!');
    }
}

/**
 * Withdraw function
 * @param {Creep} creep - Creep Object
 */
function withdraw (creep) {
    // If no withdraw target is defined, choose one
    if (creep.memory['withdrawTarget'] === undefined) {
        let target = bestWithdrawSource(creep);
        if (target !== null) {
            creep.memory['withdrawTarget'] = target.id;
        }
    }

    if (creep.memory['withdrawTarget'] !== undefined) {
        let withdrawTarget = Game.getObjectById(creep.memory['withdrawTarget']);
        let withdrawStatus = creep.withdraw(withdrawTarget, RESOURCE_ENERGY);
        if (withdrawStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(withdrawTarget, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (withdrawStatus !== OK && withdrawStatus !== ERR_BUSY) {
            console.log(creep.name, '|', 'Error in withdrawing :', withdrawStatus);
            delete creep.memory['withdrawTarget'];
        }
        else {
            delete creep.memory['withdrawTarget'];
        }
    }
    else {
        console.log(creep.name, '|', 'No withdraw target found!');
    }
}

/**
 * Drop function
 * @param {Creep} creep - Creep Object
 */
function transfer (creep) {
    // If no transfer target is defined, choose one
    if (creep.memory['transferTarget'] === undefined) {
        let target = bestTransferSource(creep);
        if (target !== null) {
            creep.memory['transferTarget'] = target.id;
        }
    }

    if (creep.memory['transferTarget'] !== undefined) {
        let transferTarget = Game.getObjectById(creep.memory['transferTarget']);
        let transferStatus = creep.transfer(transferTarget, RESOURCE_ENERGY);
        if (transferStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(transferTarget, {visualizePathStyle: GLOBAL.HAULER_PATH});
            if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (transferStatus !== OK) {
            console.log(creep.name, '|', 'Error in transfering up :', transferStatus);
            delete creep.memory['transferTarget'];
        }
        else {
            delete creep.memory['transferTarget'];
        }
    }
    else {
        console.log(creep.name, '|', 'No transfer target found!');
    }
}

/**
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);
    processState(creep);

    if (creep.memory['status'] === 'Pickup') {
        pickup(creep);
    }
    else if (creep.memory['status'] === 'Withdraw') {
        withdraw(creep);
    }
    else if (creep.memory['status'] === 'Transfer') {
        transfer(creep);
    }
    else {
        console.log(creep.name, '|', 'Unknown Status :', creep.memory['status']);
    }
}

module.exports = {
    run
};

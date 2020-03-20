
const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Process State function
 * @param {Creep} creep - Creep Object
 */
function processState (creep) {
    let stage = Game.spawns[SPAWN_NAME].memory['stage'];

    if (creep.store.getUsedCapacity() === 0 && stage <= 1) {
        if (creep.memory['status'] !== 'Harvest') {
            creep.say('🌞 Harvesting');
        }
        creep.memory['status'] = 'Harvest';
    }
    else if (creep.store.getUsedCapacity() === 0) {
        if (creep.memory['status'] !== 'Withdraw') {
            creep.say('📥 Withdrawing');
        }
        creep.memory['status'] = 'Withdraw';
    }
    else if (creep.store.getUsedCapacity() > 0) {
        if (creep.memory['status'] !== 'Upgrade') {
            creep.say('⏫ Upgrading');
        }
        creep.memory['status'] = 'Upgrade';
    }
    else if (creep.memory['status'] === undefined) {
        creep.memory['status'] = 'Withdraw';
    }
}

/**
 * Find the best place to withdraw resources
 * @param {Creep} creep - Creep Object
 */
function bestWithdrawSource (creep) {
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

    return null;
}

/**
 * Harvest function
 * @param {Creep} creep - Creep Object
 */
function harvest (creep) {
    let sources = creep.room.find(FIND_SOURCES);
    let harvestStatus = creep.harvest(sources[0]);
    if (harvestStatus === ERR_NOT_IN_RANGE) {
        let moveStatus = creep.moveTo(sources[0]);
        if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
            console.log(creep.name, '|', 'Error in Moving :', moveStatus);
        }
    }
    else if (harvestStatus !== OK) {
        console.log(creep.name, '|', 'Error in harvesting :', harvestStatus);
    }
}

/**
 * Upgrade function
 * @param {Creep} creep - Creep Object
 */
function upgrade (creep) {
    let upgradeStatus = creep.upgradeController(creep.room.controller);
    if (upgradeStatus === ERR_NOT_IN_RANGE) {
        let moveStatus = creep.moveTo(creep.room.controller, {visualizePathStyle: GLOBAL.UPGRADER_PATH});
        if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
            console.log(creep.name, '|', 'Error in Moving :', moveStatus);
        }
    }
    else if (upgradeStatus !== OK) {
        console.log(creep.name, '|', 'Error in upgrading :', upgradeStatus);
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
            let moveStatus = creep.moveTo(withdrawTarget, {visualizePathStyle: GLOBAL.UPGRADER_PATH});
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
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);
    processState(creep);

    if (creep.memory['status'] === 'Upgrade') {
        upgrade(creep);
    }
    else if (creep.memory['status'] === 'Harvest') {
        harvest(creep);
    }
    else if (creep.memory['status'] === 'Withdraw') {
        withdraw(creep);
    }
    else {
        console.log(creep.name, '|', 'Unknown Status :', creep.memory['status']);
    }
}

module.exports = {
    run
};

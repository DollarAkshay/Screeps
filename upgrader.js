
const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Harvest function
 * @param {Creep} creep - Creep Object
 */
function harvest (creep) {
    let sources = creep.room.find(FIND_SOURCES);
    let harvestStatus = creep.harvest(sources[0]);
    if (harvestStatus === ERR_NOT_IN_RANGE) {
        let moveStatus = creep.moveTo(sources[0]);
        if (moveStatus !== OK) {
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
        let moveStatus = creep.moveTo(creep.room.controller);
        if (moveStatus !== OK) {
            console.log(creep.name, '|', 'Error in Moving :', moveStatus);
        }
    }
    else if (upgradeStatus !== OK) {
        console.log(creep.name, '|', 'Error in upgrading :', upgradeStatus);
    }
}

/**
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy === 0) {
        creep.memory['status'] = 'Harvesting';
    }
    else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory['status'] = 'Upgrading';
    }

    if (creep.memory['status'] === 'Upgrading') {
        upgrade(creep);
    }
    else if (creep.memory['status'] === 'Harvesting') {
        harvest(creep);
    }
    else {
        console.log('Unknown Status');
    }
}

module.exports = {
    run
};

/**
 * Harvest function
 * @param {Creep} creep - IDs of the tags whose clusters to fetch
 */

function harvest (creep) {
    let sources = creep.room.find(FIND_SOURCES);
    let harvestStatus = creep.harvest(sources[0]);
    if (harvestStatus === ERR_NOT_IN_RANGE) {
        let moveStatus = creep.moveTo(sources[0]);
        if (moveStatus !== OK) {
            console.log('Error in Moving :', moveStatus);
        }
    }
    else {
        console.log('Error in harvesting :', harvestStatus);
    }
}

/**
 * Upgrade function
 * @param {Creep} creep - IDs of the tags whose clusters to fetch
 */

function upgrade (creep) {
    let upgradeStatus = creep.upgradeController(creep.room.controller);
    if (upgradeStatus === ERR_NOT_IN_RANGE) {
        let moveStatus = creep.moveTo(creep.room.controller);
        if (moveStatus !== OK) {
            console.log('Error in Moving :', moveStatus);
        }
    }
    else {
        console.log('Error in upgrading :', upgradeStatus);
    }
}

/**
 * Run function
 * @param {Creep} creep - IDs of the tags whose clusters to fetch
 */
function run (creep) {
    if (creep.carry.energy == 0) {
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

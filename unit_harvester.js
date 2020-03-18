const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function bestSource (creep) {
    // Harvest Tombstones first
    let tombstones = creep.room.find(FIND_TOMBSTONES);
    if (tombstones.length > 0) {
        return tombstones[0];
    }

    // Harvest Energy sources
    let energySources = creep.room.find(FIND_SOURCES);
    if (energySources.length > 0) {
        return energySources[0];
    }

    console.log('No energy sources found');
    return null;
}

function run (creep) {
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
        let transferStatus = creep.transfer(Game.spawns[SPAWN_NAME], RESOURCE_ENERGY);
        if (transferStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(Game.spawns[SPAWN_NAME], {visualizePathStyle: GLOBAL.HARVESTER_PATH});
            if (moveStatus !== OK) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (transferStatus === ERR_FULL) {
            console.log('Transfering Energy to Controller as Spawn is Full');
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
        else if (transferStatus !== OK) {
            console.log(creep.name, '|', 'Error in transfer :', transferStatus);
        }
    }
}

module.exports = {
    run
};

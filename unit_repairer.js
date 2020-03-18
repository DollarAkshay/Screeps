const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Return the best construction site
 * @param {Creep} creep - Creep Object
 */
function weakestStructure (creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
    });

    if (targets.length > 0) {
        targets.sort((a, b) => a.hits - b.hits);
        return targets[0];
    }
    else {
        return null;
    }
}

/**
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy > 0) {
        let target = weakestStructure(creep);
        if (target !== null) {
            let repairStatus = creep.repair(target);
            if (repairStatus === ERR_NOT_IN_RANGE) {
                let moveStatus = creep.moveTo(target);
                if (moveStatus !== OK) {
                    console.log('Error in Moving :', moveStatus);
                }
            }
            else if (buildStatus !== OK) {
                console.log(creep.name, '|', 'Error in building :', buildStatus);
            }
        }
    }
    else {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        let withdrawStatus = creep.withdraw(target, RESOURCE_ENERGY);
        if (withdrawStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(target, {visualizePathStyle: GLOBAL.REPAIRER_PATH});
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else if (withdrawStatus !== OK) {
            console.log(creep.name, '|', 'Error in withdrawing :', withdrawStatus);
        }
    }
}

module.exports = {
    run
};
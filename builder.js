
const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Return the best construction site
 * @param {Creep} creep - Creep Object
 */
function bestConstructionSite (creep) {
    // Walls Highest Priority
    let closestWall = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_WALL }
    });
    if (closestWall !== null) {
        return closestWall;
    }

    let closestExtension = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    if (closestExtension !== null) {
        return closestExtension;
    }

    return creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
}

/**
 * Run function
 * @param {Creep} creep - Creep Object
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy > 0) {
        let target = bestConstructionSite(creep);
        if (target !== null) {
            let buildStatus = creep.build(target);
            if (buildStatus === ERR_NOT_IN_RANGE) {
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
        let target = Game.spawns[SPAWN_NAME];
        let withdrawStatus = creep.withdraw(target, RESOURCE_ENERGY);
        if (withdrawStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(target);
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else if (withdrawStatus !== OK) {
            console.log(creep.name, '|', 'Error in building :', withdrawStatus);
        }
    }
}

module.exports = {
    run
};

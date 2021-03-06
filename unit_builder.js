
const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Return the best construction site
 * @param {Creep} creep - Creep Object
 */
function bestConstructionSite (creep, stage = 1) {
    // Walls Highest Priority
    let closestWall = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_WALL }
    });
    if (closestWall !== null) {
        return closestWall;
    }

    // Extension
    let closestExtension = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    if (closestExtension !== null) {
        return closestExtension;
    }

    // Container
    let closestContainer = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });
    if (closestContainer !== null) {
        return closestContainer;
    }

    // Roads
    let closestRoad = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_ROAD }
    });
    if (closestRoad !== null) {
        return closestRoad;
    }

    return creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
}

function bestResourceSite (creep, stage = 1) {
    // Container
    let closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (closestContainer !== null) {
        return closestContainer;
    }

    // Use spawn in the early stages of the game
    if (stage === 1 && Game.spawns[SPAWN_NAME].store.getUsedCapacity(RESOURCE_ENERGY) > 200) {
        return Game.spawns[SPAWN_NAME];
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
    let stage = Game.spawns[SPAWN_NAME].memory['stage'];
    creepHelpers.incrementCreepTypeCounter(creep);

    // Fill up only if fully empty
    if (creep.store.getUsedCapacity() === 0) {
        let resourceLocation = bestResourceSite(creep, stage);
        let withdrawStatus = creep.withdraw(resourceLocation, RESOURCE_ENERGY);
        if (withdrawStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(resourceLocation, {visualizePathStyle: GLOBAL.BUILDER_PATH});
            if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                console.log(creep.name, '|', 'Error in Moving :', moveStatus);
            }
        }
        else if (withdrawStatus !== OK && withdrawStatus !== ERR_BUSY) {
            console.log(creep.name, '|', 'Error in withdrawing :', withdrawStatus);
        }
    }
    // Deliver energy to construction site
    else {
        let target = bestConstructionSite(creep, stage);
        if (target !== null) {
            let buildStatus = creep.build(target);
            if (buildStatus === ERR_NOT_IN_RANGE) {
                let moveStatus = creep.moveTo(target, {visualizePathStyle: GLOBAL.BUILDER_PATH});
                if (moveStatus !== OK && moveStatus !== ERR_TIRED) {
                    console.log(creep.name, '|', 'Error in Moving :', moveStatus);
                }
            }
            else if (buildStatus !== OK) {
                console.log(creep.name, '|', 'Error in building :', buildStatus);
            }
        }
    }
}

module.exports = {
    run
};

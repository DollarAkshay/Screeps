
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

    // Roads over swamp terrain
    let roomTerrain = Game.map.getRoomTerrain(GLOBAL.ROOM_NAME);
    let swampRoads = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_ROAD }
    });
    swampRoads = _.filter(swampRoads, road => roomTerrain.get(road.pos.x, road.pos.y) === TERRAIN_MASK_SWAMP);
    if (swampRoads.length > 0) {
        return swampRoads[0];
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
                let moveStatus = creep.moveTo(target, {visualizePathStyle: GLOBAL.BUILDER_PATH});
                if (moveStatus !== OK) {
                    console.log('Error in Moving :', moveStatus);
                }
            }
            else if (buildStatus !== OK) {
                console.log(creep.name, '|', 'Error in building :', buildStatus);
            }
        }
    }
    else if (Game.spawns[SPAWN_NAME].store.getUsedCapacity(RESOURCE_ENERGY) > 200) {
        let gameSpawn = Game.spawns[SPAWN_NAME];
        let withdrawAmount = Math.min(Game.spawns[SPAWN_NAME].store.getUsedCapacity(RESOURCE_ENERGY) - 200, creep.store.getCapacity(RESOURCE_ENERGY));
        let withdrawStatus = creep.withdraw(gameSpawn, RESOURCE_ENERGY, withdrawAmount);
        if (withdrawStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(gameSpawn);
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

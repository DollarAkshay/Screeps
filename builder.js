
const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Run function
 * @param {Creep} creep - IDs of the tags whose clusters to fetch
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy > 0) {
        let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (target != null) {
            let buildStatus = creep.build(target);
            if (buildStatus === ERR_NOT_IN_RANGE || buildStatus === ERR_NOT_ENOUGH_RESOURCES) {
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

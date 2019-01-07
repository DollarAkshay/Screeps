
const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Run function
 * @param {Creep} creep - IDs of the tags whose clusters to fetch
 */
function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (target != null) {
        let buildStatus = creep.build(target);
        if (buildStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(target);
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else {
            console.log('Error in building :', buildStatus);
        }
    }
}

module.exports = {
    run
};

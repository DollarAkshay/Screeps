const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy < creep.carryCapacity) {
        let sources = creep.room.find(FIND_SOURCES);
        let harvestStatus = creep.harvest(sources[1]);
        if (harvestStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(sources[1]);
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else {
            console.log('Error in harvesting :', harvestStatus);
        }
    }
    else {
        let transferStatus = creep.transfer(Game.spawns[SPAWN_NAME], RESOURCE_ENERGY);
        if (transferStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(Game.spawns[SPAWN_NAME]);
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else if (transferStatus === ERR_FULL) {
            console.log('Transfering Energy to Builder as Spawn is Full');
            let nearestBuilder = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function (creep) {
                    return creep.carry.energy < creep.carryCapacity && creep.memory.role === 'builder';
                }
            });

            let transferStatus = creep.transfer(nearestBuilder, RESOURCE_ENERGY);
            if (transferStatus === ERR_NOT_IN_RANGE) {
                let moveStatus = creep.moveTo(Game.spawns[SPAWN_NAME]);
                if (moveStatus !== OK) {
                    console.log('Error in Moving :', moveStatus);
                }
            }
            else {
                console.log('Error in transfer :', transferStatus);
            }
        }
        else {
            console.log('Error in transfer :', transferStatus);
        }
    }
}

module.exports = {
    run
};

const GLOBAL = require('globals');
let creepHelpers = require('creepHelper');

var SPAWN_NAME = GLOBAL.SPAWN_NAME;

function run (creep) {
    creepHelpers.incrementCreepTypeCounter(creep);

    if (creep.carry.energy < creep.carryCapacity) {
        let sources = creep.room.find(FIND_SOURCES);
        let harvestStatus = creep.harvest(sources[0]);
        if (harvestStatus === ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(sources[0], {visualizePathStyle: {
                fill: 'transparent',
                stroke: '#fff',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .1
            }});
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
            let moveStatus = creep.moveTo(Game.spawns[SPAWN_NAME]);
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

function run (creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        let sources = creep.room.find(FIND_SOURCES);
        let harvestStatus = creep.harvest(sources[0]);
        if (harvestStatus == ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(sources[0]);
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
            }
        }
        else {
            console.log('Error in harvesting :', harvestStatus);
        }
    }
    else {
        let transferStatus = creep.transfer(Game.spawns['Spawn Center'], RESOURCE_ENERGY);
        if (transferStatus == ERR_NOT_IN_RANGE) {
            let moveStatus = creep.moveTo(Game.spawns['Spawn Center']);
            if (moveStatus !== OK) {
                console.log('Error in Moving :', moveStatus);
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

const harvester = require('harvester');
const upgrader = require('upgrader');
const builder = require('builder');

module.exports.loop = function () {
    if (Game.spawns['Spawn Center'].energy == Game.spawns['Spawn Center'].energyCapacity) {
        let upgraderCount = Game.spawns['Spawn Center'].memory['upgraderCount'];
        let harvesterCount = Game.spawns['Spawn Center'].memory['harvesterCount'];

        if (upgraderCount < harvesterCount) {
            Game.spawns['Spawn Center'].spawnCreep([WORK, CARRY, MOVE], 'Upgrader_' + upgraderCount, {
                memory: {role: 'upgrader'}
            });
            Game.spawns['Spawn Center'].memory['upgraderCount'] += 1;
        }
        else {
            Game.spawns['Spawn Center'].spawnCreep([WORK, CARRY, MOVE], 'Harvester_' + harvesterCount, {
                memory: {role: 'harvester'}
            });
            Game.spawns['Spawn Center'].memory['harvesterCount'] += 1;
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            harvester.run(creep);
        }
        else if (creep.memory.role === 'upgrader') {
            upgrader.run(creep);
        }
        else if (creep.memory.role === 'builder') {
            builder.run(creep);
        }
        else {
            console.log('Creep Role undefined');
        }
    }
}
;

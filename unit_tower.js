const GLOBAL = require('globals');

let SPAWN_NAME = GLOBAL.SPAWN_NAME;

/**
 * Process State function
 * @param {StructureTower} tower - Tower Object
 */
function processState (tower) {
    let enemyCreeps = tower.room.find(FIND_HOSTILE_CREEPS);
    let enemyStructures = tower.room.find(FIND_HOSTILE_STRUCTURES);
    let injuredFriendlyCreeps = tower.room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.hits < creep.hitsMax;
        }
    });

    if (enemyCreeps.length > 0 || enemyStructures.length > 0) {
        if (tower.memory['status'] !== 'Attack') {
            tower.say('💣 Attack');
        }
        tower.memory['status'] = 'Attack';
    }
    else if (injuredFriendlyCreeps.length > 0) {
        if (tower.memory['status'] !== 'Heal') {
            tower.say('💟 Healing');
        }
        tower.memory['status'] = 'Heal';
    }
    else {
        if (tower.memory['status'] !== 'Repair') {
            tower.say('🔨 Repairing');
        }
        tower.memory['status'] = 'Repair';
    }
}

/**
 * Return the best repair site
 * @param {StructureTower} tower - Tower Object
 */
function bestRepairStructure (tower) {
    let targetStructures = tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax;
        }
    });
    if (targetStructures.length > 0) {
        targetStructures.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax);
        return targetStructures[0];
    }

    const targets = tower.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
    });

    if (targets.length > 0) {
        targets.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax);
        return targets[0];
    }
    else {
        return null;
    }
}

/**
 * Attack function
 * @param {StructureTower} tower - Tower Object
 */
function attack (tower) {
    let closestEnemyCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    let closestEnemyStructure = tower.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);

    if (closestEnemyCreep !== null) {
        let attackStatus = tower.attack(closestEnemyCreep);
        if (attackStatus !== OK) {
            console.log('Tower | Error in attacking :', attackStatus);
        }
    }
    else if (closestEnemyStructure !== null) {
        let attackStatus = tower.attack(closestEnemyStructure);
        if (attackStatus !== OK) {
            console.log('Tower | Error in attacking :', attackStatus);
        }
    }
}

/**
 * Heal function
 * @param {StructureTower} tower - Tower Object
 */
function heal (tower) {
    let closestInjuredFriendlyCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.hits < creep.hitsMax;
        }
    });
    if (closestInjuredFriendlyCreep !== null) {
        let healStatus = tower.heal(closestInjuredFriendlyCreep);
        if (healStatus !== OK) {
            console.log('Tower | Error in healing :', healStatus);
        }
    }
}

/**
 * Repair function
 * @param {StructureTower} tower - Tower Object
 */
function repair (tower) {
    let targetStructure = bestRepairStructure(tower);

    if (targetStructure !== null) {
        let repairStatus = tower.repair(targetStructure);
        if (repairStatus !== OK) {
            console.log('Tower | Error in repairing :', repairStatus);
        }
    }
}

/**
 * Run function
 * @param {StructureTower} tower - Tower Object
 */
function run (tower) {
    processState(tower);

    if (tower.memory['status'] === 'Attack') {
        attack(tower);
    }
    else if (tower.memory['status'] === 'Heal') {
        heal(tower);
    }
    else if (tower.memory['status'] === 'Repair') {
        repair(tower);
    }
    else {
        console.log(tower.name, '|', 'Unknown Status :', tower.memory['status']);
    }
}

module.exports = {
    run
};

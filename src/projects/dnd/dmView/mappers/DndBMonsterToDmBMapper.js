import {COLOR_RED, generateUniqueId, levelData, creatureTypes, creatureSizes } from '../constants';

function removeHTMLTags(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

const getStats = (creature, profBonus) => {

    if(creature.isReleased) {
        const STR = creature.stats[0].value
        const DEX = creature.stats[1].value
        const CON = creature.stats[2].value
        const INT = creature.stats[3].value
        const WIS = creature.stats[4].value
        const CHA = creature.stats[5].value
    
        const STR_MOD = Math.floor((STR-10)/2)
        const DEX_MOD = Math.floor((DEX-10)/2)
        const CON_MOD = Math.floor((CON-10)/2)
        const INT_MOD = Math.floor((INT-10)/2)
        const WIS_MOD = Math.floor((WIS-10)/2)
        const CHA_MOD = Math.floor((CHA-10)/2)
    
        let saves = creature.savingThrows
        return {
            "strength": STR,
            "dexterity": DEX,
            "constitution": CON,
            "intelligence": INT,
            "wisdom": WIS,
            "charisma": CHA,
            "strength_save": saves.some(save => save.statId === 1) ? profBonus + STR_MOD : 0,
            "dexterity_save": saves.some(save => save.statId === 2) ? profBonus + DEX_MOD : 0,
            "constitution_save": saves.some(save => save.statId === 3) ? profBonus + CON_MOD : 0,
            "intelligence_save": saves.some(save => save.statId === 4) ? profBonus + INT_MOD : 0,
            "wisdom_save": saves.some(save => save.statId === 5) ? profBonus + WIS_MOD : 0,
            "charisma_save": saves.some(save => save.statId === 6) ? profBonus + CHA_MOD : 0,
        }
    } else {
        return {
            "strength": 10,
            "dexterity": 10,
            "constitution": 10,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 10,
            "strength_save": 0,
            "dexterity_save": 0,
            "constitution_save": 0,
            "intelligence_save": 0,
            "wisdom_save": 0,
            "charisma_save": 0,
        }
    }
}

const getSpeed = (movements) => {
    let speedJson = {};
    const types = {
        1: 'walk',
        2: 'burrow',
        3: 'climb',
        4: 'fly',
        5: 'swim',
    }

    movements.forEach(move => {
        let type = types[move.movementId]
        speedJson[type === 'walk' ? '' : type] = move.speed + "ft"
    });

    return speedJson
};


//doesnt work on things you dont own
export const DndBMonsterToDmBMapper = async (monsterRes, encounterMonsterRes, encounterGuid) => {

    const lvlObjsArray = Object.entries(levelData);
    const lvlKeys = Object.keys(levelData);
    let lvlObj = lvlObjsArray[monsterRes.challengeRatingId-2] || undefined
    let profBonus = lvlObj ? lvlObj[1].profBonus : 0 
    const stats = getStats(monsterRes, profBonus)

    let returnObj = {
        "name": encounterMonsterRes.name,
        "name_default": encounterMonsterRes.name,
        "from": "dnd_b",
        "creatureGuid": generateUniqueId(),
        "encounterGuid": encounterGuid,
        "status": monsterRes.isReleased ? 200 : 500,
        "dnd_b_monster_id": monsterRes.id,
        "link": monsterRes.url,
        "avatarUrl": monsterRes.avatarUrl,
        "hit_points": encounterMonsterRes.maximumHitPoints,
        "hit_points_default": encounterMonsterRes.maximumHitPoints,
        "hit_points_current": encounterMonsterRes.currentHitPoints,
        "hit_points_temp": encounterMonsterRes.temporaryHitPoints,
        "hit_points_override": 0, //dnd beyonds override max hp
        "hit_points_modifier": 0, //dnd beyonds max hp modifier
        "initiative": encounterMonsterRes.initiative,
        "last_damage": null,
        "alignment": "enemy",
        "type": "monster",
        "border": COLOR_RED,
        "effects": [],
        "creature_type": creatureTypes[monsterRes.typeId],
        "inspiration": false,
        "armor_class": monsterRes.armorClass || 0,
        "armor_desc": removeHTMLTags(monsterRes.armorClassDescription), 
        "inventory": [],
        "speed": getSpeed(monsterRes.movements),
        "skills": [removeHTMLTags(monsterRes.skillsHtml)],
        "spell_list": [],
        "hidden": false,
        ...stats,
        "hit_dice": monsterRes.hitPointDice.diceString || '',
        "challenge_rating": lvlKeys[monsterRes.challengeRatingId-1] || 0,
        "cr": lvlKeys[monsterRes.challengeRatingId-1] || 0,
        "senses": removeHTMLTags(monsterRes.sensesHtml),
        "languages": monsterRes.languageDescription,
        "condition_immunities": removeHTMLTags(monsterRes.conditionImmunitiesHtml),
        "actions": monsterRes.actionsDescription,
        "special_abilities": monsterRes.specialTraitsDescription,
        "legendary_actions": monsterRes.legendaryActionsDescription,
        "size": creatureSizes[monsterRes.sizeId],
        "isReleased": monsterRes.isReleased,
        "damage_resistances": "Dnd_Beyond doesn't provide this info :(",
        "environments": '',
        "deathSaves": {
            "failCount": 0,
            "successCount": 0,
            "isStabilized": true
        }
    }
    return returnObj
};

export default DndBMonsterToDmBMapper;
import {generateUniqueId } from '../constants';

export const DndBCharacterToDmBMapper = async (dndBeyondRes, skillDetails) => {

    let {maxHp, armorClass, inventory, skills_json_array} = skillDetails;
    let calculatedHp = dndBeyondRes.overrideHitPoints ? dndBeyondRes.overrideHitPoints : maxHp;
    console.log("=============")
    console.log(dndBeyondRes)
    console.log(maxHp)
    console.log(armorClass)
    console.log(inventory)
    console.log("=============")

    return {
        "name": dndBeyondRes.name,
        "name_default": dndBeyondRes.name,
        "from": "dnd_b",
        "guid": generateUniqueId(),
        "status": dndBeyondRes.status,
        "dnd_b_player_id": dndBeyondRes.id,
        "link": dndBeyondRes.link,
        "avatarUrl": dndBeyondRes.decorations.avatarUrl || 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg',
        "hit_points": calculatedHp,
        "hit_points_default": calculatedHp,
        "hit_points_current": calculatedHp - dndBeyondRes.removedHitPoints,
        "hit_points_temp": dndBeyondRes.temporaryHitPoints,
        "hit_points_override": dndBeyondRes.overrideHitPoints, //dnd beyonds override max hp
        "hit_points_modifier": dndBeyondRes.bonusHitPoints, //dnd beyonds max hp modifier
        "initiative": 0,
        "last_damage":null,
        "deathSaves": dndBeyondRes.deathSaves,
        "exhaustionLvl": dndBeyondRes.conditions.find(obj => obj.id === 4) || 0,
        "path": "",
        "type": "player",
        "effects": [],
        "creature_type": dndBeyondRes.race.fullName,
        "inspiration": dndBeyondRes.inspiration,
        "armor_class": armorClass,
        "inventory": inventory,
        "skills": skills_json_array,
    }
};

export default DndBCharacterToDmBMapper;
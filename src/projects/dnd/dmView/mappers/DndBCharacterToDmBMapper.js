import {generateUniqueId } from '../constants';

export const Open5eToDmBMapper = async (dndBeyondRes, maxHp) => {

    console.log("res", dndBeyondRes)
    console.table(dndBeyondRes.bonusHitPoints, dndBeyondRes.overrideHitPoints, dndBeyondRes.temporaryHitPoints)
    let calculatedHp = dndBeyondRes.overrideHitPoints ? dndBeyondRes.overrideHitPoints : maxHp;

    return {
        "name": dndBeyondRes.name,
        "name_default": dndBeyondRes.name,
        "from": "dndb",
        "guid": generateUniqueId(),
        "status": dndBeyondRes.status,
        "dndb-id": dndBeyondRes.id,
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
        //let exLvl = resData.conditions.find(obj => obj.id === 4);
        "exhaustionLvl": dndBeyondRes.conditions.find(obj => obj.id === 4) || 0,
        "path": "",
        "type": "player",
        "effects": []

    }
};

export default Open5eToDmBMapper;
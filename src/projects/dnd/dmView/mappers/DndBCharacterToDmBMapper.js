import {generateUniqueId } from '../constants';

export const Open5eToDmBMapper = async (dndBeyondRes, maxHp) => {

    return {
        "name": dndBeyondRes.name,
        "name_default": dndBeyondRes.name,
        "from": "dndb",
        "guid": generateUniqueId(),
        "status": dndBeyondRes.status,
        "dndb-id": dndBeyondRes.id,
        "link": dndBeyondRes.link,
        "avatarUrl": dndBeyondRes.decorations.avatarUrl || 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg',
        "hit_points_default": maxHp,
        "hit_points_current": maxHp - dndBeyondRes.removedHitPoints,
        "hit_points_temp": dndBeyondRes.bonusHitPoints,
        "hit_points_override": dndBeyondRes.overrideHitPoints,
        "removed_hit_points": dndBeyondRes.removedHitPoints,
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
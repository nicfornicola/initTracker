import {generateUniqueId, COLOR_GREEN } from '../constants';

export const DndBCharacterToDmBMapper = (dndBeyondRes, encounterGuid, skillDetails=undefined) => {
    // Full info is available from dndB
    if(skillDetails) {
        let {maxHp, armorClass, inventory, skills_json_array} = skillDetails;
        let calculatedHp = dndBeyondRes.overrideHitPoints ? dndBeyondRes.overrideHitPoints : maxHp;

        return {
            "name": dndBeyondRes.name,
            "name_default": dndBeyondRes.name,
            "from": "dnd_b",
            "creatureGuid": generateUniqueId(),
            "encounterGuid": encounterGuid,
            "status": dndBeyondRes.status === 0 ? 200 : dndBeyondRes.status,
            "dnd_b_player_id": dndBeyondRes.id.toString(),
            "link": dndBeyondRes.link,
            "avatarUrl": dndBeyondRes.decorations.avatarUrl || 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg',
            "hit_points": calculatedHp,
            "hit_points_default": calculatedHp,
            "hit_points_current": calculatedHp - dndBeyondRes.removedHitPoints || 0,
            "hit_points_temp": dndBeyondRes.temporaryHitPoints || 0,
            "hit_points_override": dndBeyondRes.overrideHitPoints || 0, //dnd beyonds override max hp
            "hit_points_modifier": dndBeyondRes.bonusHitPoints || 0, //dnd beyonds max hp modifier
            "initiative": 0,
            "last_damage":null,
            "deathSaves": dndBeyondRes.deathSaves,
            "exhaustionLvl": dndBeyondRes.conditions.find(obj => obj.id === 4)?.level || 0,
            "path": "",
            "type": "player",
            "alignment": "ally",
            "border": COLOR_GREEN,
            "effects": [],
            "creature_type": dndBeyondRes.race.fullName,
            "inspiration": dndBeyondRes.inspiration,
            "armor_class": armorClass || 0,
            "inventory": inventory,
            "skills": '',
            "spellcasting": [],
            "hidden": false,
            "environments": '',
            "legendary_actions": [],
            "lair_actions": [],
            "campaign": dndBeyondRes?.campaign?.name
        }

    } else {
        return {
            "name": dndBeyondRes.name,
            "name_default": dndBeyondRes.name || '',
            "level": dndBeyondRes.level || 0,
            "from": "dnd_b",
            "creatureGuid": generateUniqueId(),
            "encounterGuid": encounterGuid,
            "status": 403,
            "dnd_b_player_id": dndBeyondRes.id,
            "link": "",
            "avatarUrl": 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg',
            "hit_points": 10,
            "hit_points_default": 1,
            "hit_points_current": 10,
            "hit_points_temp": 0,
            "hit_points_override": 0, 
            "hit_points_modifier": 0, 
            "initiative": 0,
            "last_damage": null,
            "deathSaves": {
                "failCount": 0,
                "successCount": 0,
                "isStabilized": true
            },   
            "exhaustionLvl": 0,
            "path": "",
            "type": "player",
            "alignment": "ally",
            "border": COLOR_GREEN,
            "effects": [],
            "creature_type": dndBeyondRes.race || '',
            "inspiration": false,
            "armor_class": 10,
            "inventory": null,
            "skills":  [],
            "spellcasting": [],   
            "hidden": false,
            "environments": '',
            "legendary_actions": [],
            "lair_actions": [],
            "campaign": null

        }
    }
};

export default DndBCharacterToDmBMapper;
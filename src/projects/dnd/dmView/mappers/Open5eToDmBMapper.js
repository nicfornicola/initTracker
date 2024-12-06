import { COLOR_RED } from "../constants";

function capsFirstLetter(word) {
    if (!word)
        return ''; // Handle empty or undefined input
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function addSign(modNumber) {
    if (modNumber == null)
        return '+0'

    if (modNumber >= 0) {
        return `+${modNumber}`;
    }

    return `${modNumber}`; // Negative number already has a minus sign
}

function mapSkills(skills) {
    return Object.entries(skills).map(([key, value], index) => (
        (index === 0 ? '' : ', ') + capsFirstLetter(key) + addSign(value)
    ))
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

const getLegendaryBoxes = (desc, actions) => {
    // regex to find "3 legendary actions"
    //Multiply by ten
    //i.e. 32 = 3 legendary actions, 2 are used
    const match = desc?.match(/(\d+)\s+legendary\s+actions/) 
               || actions?.[0]?.name?.match(/(\d+)\s+legendary\s+actions/);
    return match ? parseInt(match[1]) * 10 : 0;
};

export const Open5eToDmBMapper = async (open5eData, avatarUrl) => {
    let isDefault = avatarUrl.includes("Content/Skins/WaterDeep")
    let image = avatarUrl;

    if(open5eData.img_main && open5eData.img_main !== "http://api.open5e.com/") {
        //open5e has an image, if dnd_b doesnt have an image use open5e's else just use default
        image = isDefault ? open5eData.img_main : avatarUrl
    }

    return {
        ...open5eData,  
        "name": open5eData.name,
        "name_default": open5eData.name,
        "from": "open5e",
        "creatureGuid": null,
        "link": open5eData.link,
        "searchHint": open5eData.searchHint,
        "filterDimensions": { ...open5eData.filterDimensions},
        // If dnd_b image is defualt then try to get the open5e image which might still be false
        "avatarUrl": image,
        "hit_points_default": open5eData.hit_points,
        "hit_points_current": open5eData.hit_points,
        "hit_points_temp": 0,
        "hit_points_override": 0,
        "hit_points_modifier": 0,
        "initiative": open5eData.dexterity_save || 0,
        "last_damage": null,
        "effects": [],
        "creature_alignment": capitalizeWords(open5eData.alignment) ?? '--',
        "alignment": "enemy",
        "type": "monster",
        "border": COLOR_RED,
        "creature_type": open5eData.type ?? '--',
        "inspiration": false,
        "hidden": false,
        "deathSaves": {
            "failCount": 0,
            "successCount": 0,
            "isStabilized": true
        },
        "skills": mapSkills(open5eData.skills),
        "armor_desc": "(" + open5eData.armor_desc + ")",
        "environments": open5eData?.environments.length > 0 ? open5eData.environments.join(", ") : '',
        "lair_actions": open5eData?.lair_actions || [],
        "legendary_actions": open5eData.legendary_actions,
        "strength_save": open5eData.strength_save ?? 0,
        "dexterity_save": open5eData.dexterity_save ?? 0,
        "constitution_save": open5eData.constitution_save ?? 0,
        "intelligence_save": open5eData.intelligence_save ?? 0,
        "charisma_save": open5eData.charisma_save ?? 0,
        "wisdom_save": open5eData.wisdom_save ?? 0,
        "size": open5eData.size ?? '--',
        "subtype": open5eData.subtype ?? '--',
        "legendary_actions_count": getLegendaryBoxes(open5eData?.legendary_desc, open5eData?.legendary_actions) ?? 0
    }
};

export default Open5eToDmBMapper;
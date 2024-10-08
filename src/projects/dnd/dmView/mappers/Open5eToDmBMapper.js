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
        "guid": null,
        "link": open5eData.link,
        "searchHint": open5eData.searchHint,
        "filterDimensions":{ ...open5eData.filterDimensions},
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
        "creature_alignment": open5eData.alignment,
        "alignment": "enemy",
        "type": "monster",
        "border": COLOR_RED,
        "creature_type": open5eData.type,
        "inspiration": false,
        "hidden": false,
        "deathSaves": {
            "failCount": 0,
            "successCount": 0,
            "isStabilized": true
        },
        "skills": mapSkills(open5eData.skills),
        "armor_desc": "(" + open5eData.armor_desc + ")"

    }
};

export default Open5eToDmBMapper;
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
        "type": "monster",
        "creature_type": open5eData.type,
        "inspiration": false,
        "hidden": false

    }
};

export default Open5eToDmBMapper;
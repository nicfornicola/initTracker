import {COLOR_RED, generateUniqueId } from '../constants';

export const DndBMonsterToDmBMapper = async (monsterRes, encounterMonsterRes) => {

    return {
        "name": encounterMonsterRes.name,
        "name_default": encounterMonsterRes.name,
        "from": "dnd_b",
        "guid": generateUniqueId(),
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
        "creature_type": "dnd beyond doesnt give me this",
        "inspiration": false,
        "armor_class": monsterRes.armorClass,
        "inventory": [],
        "movement": monsterRes.movements,
        "skills": monsterRes.stats,
        "hidden": false

    }
};

export default DndBMonsterToDmBMapper;
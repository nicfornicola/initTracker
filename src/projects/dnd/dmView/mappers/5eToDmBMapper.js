const COLOR_RED = "#D44E3B"
const COLOR_GREEN = "#68AA33"

const alignmentConst = {
    'L' : 'Lawful',
    'C' : 'Chaotic',
    'G' : 'Good',
    'E' : 'Evil',
    'N' : 'Neutral',
    'U' : 'Unaligned'
}

const allyConst = {
    'G' : 'ally',
    'E' : 'enemy',
    'N' : 'neutral',
    'U' : 'neutral'
}

const colors = {
    "enemy": COLOR_RED,
    "neutral": '#999999',
    "ally": COLOR_GREEN,
    "pet": COLOR_GREEN
}

const sizeConst = {
    'T': 'Tiny',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'H': 'Huge',
    'G': 'Gargantuan',
}

const calcSize = (sizeArray) => {
    if(sizeArray) {
        let size = sizeArray.map((s) => sizeConst[s])
        return size
    }
        
    return "NO SIZE"
}

const calcAlignment = (alignmentArray) => {
    if(alignmentArray)
        return alignmentArray.map((a) => alignmentConst[a])
    return "NO ALIGNMENT"
}

const allyCheck = (alignmentArray) => {
    if(alignmentArray)
        alignmentArray.forEach(a => {
            if(a === "E" || a === "N" || a === "U" || a === "G") {
                return allyConst[a]
            }
        });
    return 'enemy'
}

function capsFirstLetter(word) {
    if (!word)
        return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function mapSkills(skills) {
    console.log("skills", skills)
    if(skills)
        return Object.entries(skills).map(([key, value], index) => (
            (index === 0 ? '' : ', ') + capsFirstLetter(key) + value
        ))
    else 
        return []
}

const getRechargeBoxes = (desc, actions) => {
    // regex to find "3 legendary actions"
    //Multiply by ten
    //i.e. 32 = 3 legendary actions, 2 are used
    const match = desc?.match(/(\d+)\s+legendary\s+actions/) 
               || actions?.[0]?.name?.match(/(\d+)\s+legendary\s+actions/);
    return match ? parseInt(match[1]) * 10 : 0;
};

function addRechargeCount(objectsArr) {
    if(objectsArr) 
        return objectsArr.map(obj => {
            const match = obj.name.match(/\((\d+)\/[^)]+\)/); // Match (X/any text) pattern
            obj.rechargeCount = match ? parseInt(match[1]) * 10 : 0; // Set to null if no pattern is found
            return obj;
        });
    else 
        return null
}

export const t5eToDmBMapper = (monster, avatarUrl = null) => {
    console.log(monster)
    let alignment = allyCheck(monster.alignment)
    const armor_class = Array.isArray(monster?.ac) && monster.ac[0]?.ac 
        ? monster.ac[0].ac 
        : monster?.ac?.[0] || "NO AC";
    const armor_desc = Array.isArray(monster?.ac) && monster?.ac[0]?.from ? ("(" + (monster?.ac[0]?.from?.join("")) + ")") : "NO DESC";


    return {
        "name": monster.name,
        "name_default": monster.name,
        "from": "t5",
        "creatureGuid": null,
        "avatarUrl": avatarUrl,
        "cr": monster.cr,
        "armor_class": armor_class,
        "armor_desc": armor_desc,
        "hit_points_formula": monster?.hp?.formula,
        "hit_points_default": monster?.hp?.average,
        "hit_points_current": monster?.hp?.average,
        "hit_points_temp": 0,
        "hit_points_override": 0,
        "hit_points_modifier": 0,
        "initiative": Math.floor((monster?.dex-10)/2) || 0,
        "effects": [],
        "creature_alignment": calcAlignment(monster.alignment),
        "alignment": alignment,
        "type": "monster",
        "border": colors[alignment],
        "creature_type": monster.type?.type || monster.type || '--',
        "subtype": monster.type?.tags?.join(",") || '--',
        "inspiration": false,
        "hidden": false,
        "deathSaves": {
            "failCount": 0,
            "successCount": 0,
            "isStabilized": true
        },
        "skills": mapSkills(monster.skill),
        "senses": monster.senses?.join(",") || "",
        "environments": '',
        "lair_actions": [],
        "strength_save": monster.save?.str ?? 0,
        "dexterity_save":  monster.save?.dex ?? 0,
        "constitution_save":  monster.save?.con ?? 0,
        "intelligence_save":  monster.save?.int ?? 0,
        "charisma_save":  monster.save?.cha ?? 0,
        "wisdom_save":  monster.save?.wis ?? 0,
        "size": calcSize(monster.size),
        "legendary_actions_count": getRechargeBoxes(monster?.legendary_desc, monster?.legendary_actions) ?? 0,
        "special_abilities": addRechargeCount(monster?.special_abilities || null),
        "actions": addRechargeCount(monster?.actions || null),
        "bonus_actions": addRechargeCount(monster?.bonus || null),
        "legendary_actions": addRechargeCount(monster?.legendary),
        "dnd_b_player_id": null,
        "sourceShort": monster.source
    }
};

export default t5eToDmBMapper;
import legendaryGroups from '../monsterJsons/legendarygroups.json'
import { legendaryDescDefault } from '../replacements.js'

const legendaryDetails = legendaryGroups.legendaryGroup;

const COLOR_RED = "#D44E3B"
const COLOR_GREEN = "#68AA33"

const alignmentConst = {
    'L' : 'Lawful',
    'C' : 'Chaotic',
    'G' : 'Good',
    'E' : 'Evil',
    'N' : 'Neutral',
    'U' : 'Unaligned',
    'A' : 'Any Alignment'
}

const allyConst = {
    'G' : 'ally',
    'E' : 'enemy',
    'A' : 'enemy',
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
        let size = sizeArray.map((s) => sizeConst[s]).join(", ")
        return size
    }
        
    return "NO SIZE"
}

const calcAlignment = (alignmentArray) => {
    if(alignmentArray)
        return alignmentArray
            .map((a) => alignmentConst[a] || "") // Handle unmatched keys
            .join(" "); // Join matches into a single string
    return "--"
}

const calcSpeed = (speed) => {
    
    if(speed && Object.entries(speed).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
            speed[key] = `${value.number} ${value.condition}`.trim();
        } else {
            speed[key] = value;
        }
    }))


    if(speed?.fly?.number) {
        speed.fly = speed.fly.number
    }

    if(speed?.canHover) {
        speed.hover = speed.canHover
    }

    return speed;
}

const calcActionTypes = (actionJson) => {
    if(actionJson) {
        actionJson.forEach(a => {
            a.desc = a.entries.join(" ")
        });
    }

    return actionJson;
}

const calcCreatureType = (type) => {
    if(typeof type === 'string') {
       return type
    } else if(typeof type.type === 'string') {
        return type.type
    } else {
        return type.type.choose.map((t) => capsFirstLetter(t)).join(" or ")
    }
}

// For immunities and resistances
const calcImmune = (defense, cKey) => {
    if (!defense) return "";

    const dString1 = defense
        .filter(entry => typeof entry === "string")
        .join(", ");

    const dString2 = defense
        .filter(entry => typeof entry === "object" && entry[cKey])
        .map(entry => `${entry[cKey].join(", ")} ${entry?.note}`)
        .join("; ");

        return `${dString1}${dString2 ? `; ${dString2}` : ""}` 
    };

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
    if (!word || word === '--')
        return '';

    return word.charAt(0).toUpperCase() + word.slice(1);
}

function mapSkills(skills) {
    if(skills) {
        let skillString = Object.entries(skills).map(([key, value]) => (
            capsFirstLetter(key) + value
        )).join(", ")
        return skillString
    }
    else 
        return ''
}

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

const calcSenses = (senses, passive) => {
    let sensesString = ''
    if(senses) {
        sensesString = senses.join(", ")
    }

    if(passive)
        sensesString += `${sensesString ? ',' : ''} Passive Perception ${passive}`

    return sensesString
}

const calcCr = (monster) => {

    let cr = monster?.cr?.cr || monster.cr
    // if(monster?.cr?.lair)
    //     cr += "Lair: " + monster?.cr?.lair
    return cr
}

const calcAC = (monster) => {
    if(Array.isArray(monster?.ac)) {
        if(monster.ac[0]?.ac) {
            return monster.ac[0]?.ac
        }

        else if(typeof monster.ac[0] === 'number') {
            let ac = monster.ac[0];
            if(typeof monster.ac[1] === 'object') {
                ac = `${ac.toString()} (${monster.ac[1].ac.toString()} ${monster.ac[1].condition})`
            }
            
            return ac
        }
        else
            return monster?.ac[0]?.special
    }

    return "NO AC"
}

export const t5eToDmBMapper = (monster, avatarUrl = null) => {
    let alignment = allyCheck(monster.alignment)
    const armor_class = calcAC(monster) 
    const armor_desc = Array.isArray(monster?.ac) && monster?.ac[0]?.from ? ("(" + (monster?.ac[0]?.from?.join("")) + ")") : "";
    const cr = calcCr(monster)

    return {
        "name": monster.name,
        "name_default": monster.name,
        "from": "t5",
        "creatureGuid": null,
        "avatarUrl": avatarUrl,
        "speed": calcSpeed(monster.speed),
        "armor_class": armor_class,
        "armor_desc": armor_desc,
        "creature_alignment": calcAlignment(monster.alignment),
        "alignment": alignment,
        "size": calcSize(monster.size),
        "type": "monster",
        "border": colors[alignment],
        "creature_type": calcCreatureType(monster?.type),
        "subtype": capsFirstLetter(monster.type?.tags?.join(",") || '--'),
        "hit_points_formula": monster?.hp?.formula,
        "hit_points_default": monster?.hp?.average || monster?.hp?.special,
        "hit_points": monster?.hp?.average || monster?.hp?.special,
        "hit_points_current": monster?.hp?.average || monster?.hp?.special,
        "hit_points_temp": 0,
        "hit_points_override": 0,
        "hit_points_modifier": 0,
        "initiative": Math.floor((monster?.dex-10)/2) || 0,
        "effects": [],
        'damage_vulnerabilities': monster?.vulnerable?.join(', ') || "",
        'damage_resistances': calcImmune(monster?.resist, "resist") || "",
        'damage_immunities': calcImmune(monster?.immune, "immune"),
        'condition_immunities': monster?.conditionImmune?.join(', ') || "",
        "skills": mapSkills(monster.skill),
        "senses": calcSenses(monster?.senses, monster?.passive),
        'languages': monster?.languages?.join(', '),
        "cr": cr,
        "challenge_rating": cr,
        "special_abilities": addRechargeCount(calcActionTypes(monster?.trait || null)),
        "actions": addRechargeCount(calcActionTypes(monster?.action) || null),
        "bonus_actions": addRechargeCount(calcActionTypes(monster?.bonus) || null),
        "legendary_actions_count": monster?.legendary?.length > 0 ? 30 : 0,
        "legendary_actions": addRechargeCount(calcActionTypes(monster?.legendary)),
        "legendary_desc": monster?.legendary?.length ? (monster?.legendaryHeader?.join(" ") || legendaryDescDefault(monster.name)) : "NOTHIN",
        "lair_actions": [], //see legendaryDetails ^^^
        "inspiration": false,
        "hidden": false,
        "deathSaves": {
            "failCount": 0,
            "successCount": 0,
            "isStabilized": true
        },
        "environments": '',
        "strength": monster.str ?? 0,
        "dexterity":  monster.dex ?? 0,
        "constitution":  monster.con ?? 0,
        "intelligence":  monster.int ?? 0,
        "charisma":  monster.cha ?? 0,
        "wisdom":  monster.wis ?? 0,
        "strength_save": monster.save?.str ?? 0,
        "dexterity_save":  monster.save?.dex ?? 0,
        "constitution_save":  monster.save?.con ?? 0,
        "intelligence_save":  monster.save?.int ?? 0,
        "charisma_save":  monster.save?.cha ?? 0,
        "wisdom_save":  monster.save?.wis ?? 0,
        "dnd_b_player_id": null,
        "sourceShort": monster.source,

    }
};

export default t5eToDmBMapper;
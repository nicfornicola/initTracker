import CoreRules from './monsterJsons/5eCoreRules.json';
import CreatureCodex from './monsterJsons/CreatureCodex.json';
import CriticalRole from './monsterJsons/CriticalRole.json';
import Menagerie from './monsterJsons/Menagerie.json';
import TomeOfBeasts1 from './monsterJsons/TomeOfBeasts1.json';
import TomeOfBeasts2 from './monsterJsons/TomeOfBeasts2.json';
import TomeOfBeasts3 from './monsterJsons/TomeOfBeasts3.json';
import TomeOfBeasts2023 from './monsterJsons/TomeOfBeasts2023.json';

export const proxyUrl = window.location.href.includes("dmbuddy.com") 
                        ? 'https://nics-cors-anywhere-99e39b544c5d.herokuapp.com/' 
                        : "";

                        
proxyUrl === "" ? console.log("No Proxy") : console.log("Using Proxy")

export const generateUniqueId = () => {
    let num = Math.random().toString(36).substring(2, 12).toUpperCase();
    return num
}

export const sortCreatureArray = (array) => {
    return array.sort((a, b) => {
        // Extract initiative and name from both objects
        const initiativeA = a.initiative;
        const initiativeB = b.initiative;

        // Handle cases where one initiative is null
        if (initiativeA === null && initiativeB !== null) {
            return 1;
        } else if (initiativeA !== null && initiativeB === null) {
            return -1;
        } else if (initiativeA !== null && initiativeB !== null) {
            // Both initiatives are not null, compare them numerically
            const initiativeComparison = initiativeB - initiativeA;
            if (initiativeComparison !== 0) {
                return initiativeComparison;
            } else {
                // Initiatives are the same, compare by name alphabetically
                return a.name.localeCompare(b.name);
            }
        } else {
            return 0; // Both are null, maintain the current order
        }
    });
};

export const INIT_ENCOUNTER_NAME = 'Name Your Encounter';

export const INIT_ENCOUNTER = {
    encounterName: INIT_ENCOUNTER_NAME,
    guid: "",
    roundNum: 1,
    turnNum: 0,
    currentEncounterCreatures: []
}

export const setLocalPlayerViewEncounter = (encounter) => {
    localStorage.setItem('playerViewEncounter', JSON.stringify(encounter));
}

let combinedArray = [...CoreRules,
                     ...CreatureCodex,
                     ...CriticalRole,
                     ...Menagerie,
                     ...TomeOfBeasts1,
                     ...TomeOfBeasts2,
                     ...TomeOfBeasts3,
                     ...TomeOfBeasts2023
                    ];
                    
combinedArray.sort((a, b) => {
    return a.name.localeCompare(b.name)
});

export const monsterList = combinedArray
export const imagesAvailable = [
    "5e Core Rules",
    "Tome of Beasts",
    "Critical Role: Tal’Dorei Campaign Setting",
    "Tome of Beasts 2023"
]

export const levelXPData = {
    '0': 0,
    '1/8': 25,
    '1/4': 50,
    '1/2': 100,
    '1': 200,
    '2': 450,
    '3': 700,
    '4': 1100,
    '5': 1800,
    '6': 2300,
    '7': 2900,
    '8': 3900,
    '9': 5000,
    '10': 5900,
    '11': 7200,
    '12': 8400,
    '13': 10000,
    '14': 11500,
    '15': 13000,
    '16': 15000,
    '17': 18000,
    '18': 20000,
    '19': 22000,
    '20': 25000,
    '21': 33000,
    '22': 41000,
    '23': 50000,
    '24': 62000,
    '25': 75000,
    '26': 90000,
    '27': 105000,
    '28': 120000,
    '29': 135000,
    '30': 155000,
    '--': "--"
};

export const dummyDefault = {
    "name": "Dummy",
    "name_default": "Dummy",
    "from": "dmb",
    "guid": null,
    "hit_points": 20,
    "hit_points_default": 20,
    "hit_points_current": 20,
    "hit_points_temp": 0,
    "hit_points_override": 0,
    "hit_points_modifier": 0,
    "initiative": 0,
    "last_damage": null,
    "effects": [],
    "type": "default",
    "desc": "**Commoners** include peasants, serfs, slaves, servants, pilgrims, merchants, artisans, and hermits.",
    "size": "Medium",
    "type": "",
    "subtype": "",
    "group": "",
    "alignment": "",
    "armor_class": 10,
    "armor_desc": null,
    "hit_dice": "1d8",
    "speed": {
        "walk": 30
    },
    "strength": 10,
    "dexterity": 10,
    "constitution": 10,
    "intelligence": 10,
    "wisdom": 10,
    "charisma": 10,
    "strength_save": null,
    "dexterity_save": null,
    "constitution_save": null,
    "intelligence_save": null,
    "wisdom_save": null,
    "charisma_save": null,
    "perception": null,
    "skills": {},
    "damage_vulnerabilities": "",
    "damage_resistances": "",
    "damage_immunities": "",
    "condition_immunities": "",
    "senses": "passive Perception 10",
    "languages": "Common",
    "challenge_rating": "0",
    "cr": 0,
    "actions": [
        {
            "name": "Dumb Club",
            "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage.",
            "attack_bonus": 2,
            "damage_dice": "1d4"
        }
    ],
    "bonus_actions": null,
    "reactions": null,
    "legendary_desc": "",
    "legendary_actions": null,
    "special_abilities": null,
    "spell_list": [],
    "page_no": 398,
    "environments": [
        "Hill",
        "Urban",
        "Grassland",
        "Coastal",
        "Forest",
        "Arctic",
        "Desert",
        "Settlement"
    ],
    "img_main": null,
    "document__slug": "wotc-srd",
    "document__title": "5e Core Rules",
    "document__license_url": "http://open5e.com/legal",
    "document__url": "http://dnd.wizards.com/articles/features/systems-reference-document-srd",
    "name_default": "Dummy",
    "hit_points_default": 20,
    "hit_points_current": 20,
    "hit_points_temp": 0,
    "hit_points_override": 0,
    "initiative": 0,
    "last_damage": null
}


export const envObject = {
    "slug": "Env/Lair",
    "desc": "A falling piller, exploding magma, the world is your oyster! And that oyster will blow up at the end of the round. Poor souls...",
    "name": "Environment/Lair",
    "size": "",
    "type": "",
    "subtype": "",
    "group": "",
    "alignment": "",
    "armor_class": 0,
    "armor_desc": null,
    "hit_points": 0,
    "hit_dice": "",
    "speed": {
        "walk": 0
    },
    "strength": 10,
    "dexterity": 10,
    "constitution": 10,
    "intelligence": 10,
    "wisdom": 10,
    "charisma": 10,
    "strength_save": null,
    "dexterity_save": null,
    "constitution_save": null,
    "intelligence_save": null,
    "wisdom_save": null,
    "charisma_save": null,
    "perception": null,
    "skills": {},
    "damage_vulnerabilities": "",
    "damage_resistances": "",
    "damage_immunities": "",
    "condition_immunities": "",
    "senses": "passive Perception 10",
    "languages": "Terren",
    "challenge_rating": "--",
    "cr": "--",
    "actions": [
        {
            "name": "Super Earth Combo",
            "desc": "Melee Weapon Attack: +100 to hit, reach - are you on earth?, alot of targets. Hit: 5000 (10d100) force damage.",
        }
    ],
    "bonus_actions": null,
    "reactions": null,
    "legendary_desc": "",
    "legendary_actions": null,
    "special_abilities": null,
    "spell_list": [],
    "page_no": 0,
    "environments": [
        "Earth",
        "Space?"
    ],
    "img_main": null,
    "document__title": "Nic's Lair",
    "document__license_url": "",
    "document__url": "",
    "name_default": "Environment/Lair",
    "hit_points_default":  0,
    "hit_points_current": 0,
    "hit_points_temp": 0,
    "hit_points_override": 0,
    "initiative": 0,
    "last_damage": null
}
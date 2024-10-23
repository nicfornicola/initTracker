import CoreRules from './monsterJsons/5eCoreRules.json';
import CreatureCodex from './monsterJsons/CreatureCodex.json';
import CriticalRole from './monsterJsons/CriticalRole.json';
import Menagerie from './monsterJsons/Menagerie.json';
import TomeOfBeasts1 from './monsterJsons/TomeOfBeasts1.json';
import TomeOfBeasts2 from './monsterJsons/TomeOfBeasts2.json';
import TomeOfBeasts3 from './monsterJsons/TomeOfBeasts3.json';
import TomeOfBeasts2023 from './monsterJsons/TomeOfBeasts2023.json';
import GlobalImg from './pics/global.png'

import aid from './pics/effects/aid.png'; 
import bane from './pics/effects/bane.png'; 
import bladeWard from './pics/effects/bladeWard.png'; 
import bless from './pics/effects/bless.png'; 
import blinded from './pics/effects/blinded.png'; 
import boneChilled from './pics/effects/boneChilled.png'; 
import barkSkin from './pics/effects/barkSkin.png'; 
import command from './pics/effects/command.png'; 
import confused from './pics/effects/confused.png'; 
import disguised from './pics/effects/disguised.png'; 
import ensnared from './pics/effects/ensnared.png'; 
import faerieFire from './pics/effects/faireFire.png'; 
import guidance from './pics/effects/guidance.png'; 
import guidingBolt from './pics/effects/guidingBolt.png'; 
import hex from './pics/effects/hex.png'; 
import holdPerson from './pics/effects/holdPerson.png'; 
import huntersMark from './pics/effects/huntersMark.png'; 
import invis from './pics/effects/invis.png'; 
import poisened from './pics/effects/poisened.png'; 
import rayOfFrost from './pics/effects/rayOfFrost.png'; 
import sheildOfFaith from './pics/effects/sheildOfFaith.png'; 
import silence from './pics/effects/silence.png'; 
import slept from './pics/effects/slept.png'; 
import webbed from './pics/effects/webbed.png'; 

import background1 from "./pics/backgrounds/fallenCastleBigTree.jpg"
import background2 from "./pics/backgrounds/spookyForest.jpg"
import background3 from "./pics/backgrounds/grasslands.jpg"
import background4 from "./pics/backgrounds/lavaMontains.jpg"
import background5 from "./pics/backgrounds/riverPath.jpg"
import background6 from "./pics/backgrounds/riverVillage.jpeg"
import background7 from "./pics/backgrounds/shiningTown.jpg"
import background8 from "./pics/backgrounds/snowyForrest.jpg"
import background9 from "./pics/backgrounds/snowyMounts.jpg"
import background10 from "./pics/backgrounds/spookyCastle.jpg"
import background11 from "./pics/backgrounds/spookyVillage.jpg"
import background12 from "./pics/backgrounds/snowyMountsGiant.jpg"
import background13 from "./pics/backgrounds/happyTavern.png"
import background14 from "./pics/backgrounds/tavern.jpg"
import background15 from "./pics/backgrounds/dungeon.jpg"
import background16 from "./pics/backgrounds/waterfall.gif"
import background17 from "./pics/backgrounds/faireSwamp.gif"
import background18 from "./pics/backgrounds/tower.gif"
import background19 from "./pics/backgrounds/butteflyCavern.gif"
import background20 from "./pics/backgrounds/riverDeer.gif"
import background21 from "./pics/backgrounds/grass.gif"
import background22 from "./pics/backgrounds/church.gif"
import background23 from "./pics/backgrounds/adventureTime.gif"
import background24 from "./pics/backgrounds/fire.gif"

export const backgroundImages = [
    background1,
    background2,
    background3,
    background4,
    background5,
    background6,
    background7,
    background8,
    background9,
    background10,
    background11,
    background12,
    background13,
    background14,
    background15,
    background16,
    background17,
    background18,
    background19,
    background20,
    background21,
    background22,
    background23,
    background24
];

export const isProd = window.location.href.includes("dmbuddy.com") 
// export const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// To test corsanywhere locally, switch the "" to "http://localhost:8080/" and run a regular chrome browser
// If run with no-cors browser bad stuff happens
export const proxyUrl = isProd
                        ? 'https://nics-cors-anywhere-99e39b544c5d.herokuapp.com/' 
                        : "";
                        
proxyUrl === "" ? console.log("No Proxy") : console.log("Using Proxy")
console.log(proxyUrl)

export const skills_long = ["Strength Score", "Dexterity Score", "Constitution Score", "Intelligence Score", "Wisdom Score", "Charisma Score"];
export const skill_codes = [3520, 3521, 3522, 3523, 3524, 3525];
export const skills_short = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export const sortCreaturesByInitiative = (creatures) => {
    return creatures.sort((a, b) => {
        if (a.initiative === null && b.initiative !== null) {
            return 1; // `a` (initiative === null) should come after `b` (initiative !== null)
        } else if (a.initiative !== null && b.initiative === null) {
            return -1; // `a` (initiative !== null) should come before `b` (initiative === null)
        } else if (a.initiative !== null && b.initiative !== null) {
            // Both initiatives are not null, compare them numerically
            const initiativeComparison = b.initiative - a.initiative;
            if (initiativeComparison !== 0) {
                return initiativeComparison;
            } else {
                // Initiatives are the same, compare by creature.name alphabetically
                return a.name.localeCompare(b.name);
            }
        } else {
            return 0; // Both are null, maintain the current order
        }
    });
};

export const effectObjs = [
    {img: aid, effect: "Aided"}, 
    {img: bane, effect: "Baned"}, 
    {img: bladeWard, effect: "Blade Ward"}, 
    {img: bless, effect: "Blessed"}, 
    {img: blinded, effect: "Blinded"}, 
    {img: boneChilled, effect: "Bone Chilled"}, 
    {img: barkSkin, effect: "Bark Skin"}, 
    {img: command, effect: "Command"}, 
    {img: confused, effect: "Confused"}, 
    {img: disguised, effect: "Disguised"}, 
    {img: ensnared, effect: "Ensnared"}, 
    {img: faerieFire, effect: "Faerie Fire"}, 
    {img: guidance, effect: "Guidance"}, 
    {img: guidingBolt, effect: "Guiding Bolt"}, 
    {img: hex, effect: "Hexed"}, 
    {img: holdPerson, effect: "Hold Person"}, 
    {img: huntersMark, effect: "Hunters Mark"}, 
    {img: invis, effect: "Invisible"}, 
    {img: poisened, effect: "Poisened"}, 
    {img: rayOfFrost, effect: "Slowed"}, 
    {img: sheildOfFaith, effect: "Sheild Of Faith"}, 
    {img: silence, effect: "Silenced"}, 
    {img: slept, effect: "Slept"}, 
    {img: webbed, effect: "Enwebbed"}, 
];

export const LONG_REFRESH = 10
export const SHORT_REFRESH = 1

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
            // Both initiatives are not null, compare them numerically using absolute values
            const initiativeComparison = Math.abs(initiativeB) - Math.abs(initiativeA);
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
    encounterGuid: "",
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

// export const conditionTypes = {
//     1: 'Blinded',
//     2: 'Charmed',
//     3: 'Deafened',
//     4: 'Exhausted',
//     5: 'Frightened',
//     6: 'Grappled',
//     7: 'Incapacitated',
//     8: 'Invisible',
//     9: 'Paralyzed',
//     10: 'Petrified',
//     11: 'Poisened',
//     12: 'Prone',
//     13: 'Restrained',
//     14: 'Stunned',
//     15: 'Unconscious',
// }

export const creatureTypes = {
    1: 'Aberration',
    2: 'Beast',
    3: 'Celestial',
    4: 'Construct',
    5: 'If you see this please tell me what type this monster is',
    6: 'Dragon',
    7: 'Elemental',
    8: 'Fey',
    9: 'Fiend',
    10: 'Giant',
    11: 'Humanoid',
    12: 'If you see this please tell me what type this monster is',
    13: 'Monstrosity',
    14: 'Ooze',
    15: 'Plant',
    16: 'Undead',
}

export const creatureSizes = {
    1: 'If you see this please tell me what type this monster is',
    2: 'Tiny',
    3: 'Small',
    4: 'Medium',
    5: 'Large',
    6: 'Huge',
    7: 'Gargantuan',
}

export const levelData = {
    '0': {'xp': 0, 'profBonus': 2},
    '1/8': {'xp': 25, 'profBonus': 2},
    '1/4': {'xp': 50, 'profBonus': 2},
    '1/2': {'xp': 100, 'profBonus': 2},
    '1': {'xp': 200, 'profBonus': 2},
    '2': {'xp': 450, 'profBonus': 2},
    '3': {'xp': 700, 'profBonus': 2},
    '4': {'xp': 1100, 'profBonus': 2},
    '5': {'xp': 1800, 'profBonus': 3},
    '6': {'xp': 2300, 'profBonus': 3},
    '7': {'xp': 2900, 'profBonus': 3},
    '8': {'xp': 3900, 'profBonus': 3},
    '9': {'xp': 5000, 'profBonus': 4},
    '10': {'xp': 5900, 'profBonus': 4},
    '11': {'xp': 7200, 'profBonus': 4},
    '12': {'xp': 8400, 'profBonus': 4},
    '13': {'xp': 10000, 'profBonus': 5},
    '14': {'xp': 11500, 'profBonus': 5},
    '15': {'xp': 13000, 'profBonus': 5},
    '16': {'xp': 15000, 'profBonus': 5},
    '17': {'xp': 18000, 'profBonus': 6},
    '18': {'xp': 20000, 'profBonus': 6},
    '19': {'xp': 22000, 'profBonus': 6},
    '20': {'xp': 25000, 'profBonus': 6},
    '21': {'xp': 33000, 'profBonus': 7},
    '22': {'xp': 41000, 'profBonus': 7},
    '23': {'xp': 50000, 'profBonus': 7},
    '24': {'xp': 62000, 'profBonus': 7},
    '25': {'xp': 75000, 'profBonus': 8},
    '26': {'xp': 90000, 'profBonus': 8},
    '27': {'xp': 105000, 'profBonus': 8},
    '28': {'xp': 120000, 'profBonus': 8},
    '29': {'xp': 135000, 'profBonus': 9},
    '30': {'xp': 155000, 'profBonus': 9},
    '--': "--"
};

const sharedItems = {
    "from": "dmb",
    "name": "Dummy",
    "name_default": "Dummy",
    "hit_dice": "1d8",
    "hit_points": 1,
    "hit_points_default":  1,
    "hit_points_current": 1,
    "hit_points_temp": 0,
    "hit_points_override": 0,
    "hit_points_modifier": 0,
    "initiative": 0,
    "last_damage": null,
    "effects": [],
    "creatureGuid": null,
    "senses": "passive Perception 10",
    "armor_class": 0,
    "damage_vulnerabilities": "",
    "damage_resistances": "",
    "damage_immunities": "",
    "condition_immunities": "",
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
    "skills": [],
    "spell_list": [],
    "bonus_actions": null,
    "reactions": null,
    "legendary_desc": "",
    "legendary_actions": null,
    "special_abilities": null,
    "type": "",
    "subtype": "",
    "group": "",
    "alignment": "",
    "document__slug": "",
    "document__title": "DmBuddy Dummy",
    "document__license_url": "",
    "document__url": "",
    "hidden": false,
    "deathSaves": { successCount: 0, failureCount: 0 }
}

export const COLOR_RED = "#F44E3B"
export const COLOR_GREEN = "#68BC00"

export const dummyDefault = {
    ...sharedItems,
    "hit_points": 20,
    "hit_points_default": 20,
    "hit_points_current": 20,
    "initiative": 0,
    "type": "default",
    "alignment": "ally",
    "border": COLOR_GREEN,
    "desc": "**Commoners** include peasants, serfs, slaves, servants, pilgrims, merchants, artisans, and hermits.",
    "size": "Medium",
    "armor_class": 10,
    "armor_desc": null,
    "speed": {
        "walk": 30
    },
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
    ]
}


export const envObject = {
    ...sharedItems,
    "type": "global",
    "alignment": "neutral",
    "border": "#FFFFFF",
    "name": "Env/Lair",
    "name_default": "Env/Lair",
    "desc": "A falling piller, exploding magma, the world is your oyster! And that oyster will blow up at the end of the round. Poor souls...",
    "size": "",
    "armor_desc": null,
    "speed": {
        "walk": 0
    },
    "languages": "Terren",
    "challenge_rating": "--",
    "cr": "--",
    "actions": [
        {
            "name": "Super Earth Combo",
            "desc": "Melee Weapon Attack: +100 to hit, reach - are you on earth?, alot of targets. Hit: 5000 (10d100) force damage.",
        }
    ],
    "environments": [
        "Earth",
        "Space?"
    ],
    "avatarUrl": GlobalImg,
}


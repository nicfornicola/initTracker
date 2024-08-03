import CoreRules from './monsterJsons/5eCoreRules.json';
import CreatureCodex from './monsterJsons/CreatureCodex.json';
import CriticalRole from './monsterJsons/CriticalRole.json';
import Menagerie from './monsterJsons/Menagerie.json';
import TomeOfBeasts1 from './monsterJsons/TomeOfBeasts1.json';
import TomeOfBeasts2 from './monsterJsons/TomeOfBeasts2.json';
import TomeOfBeasts3 from './monsterJsons/TomeOfBeasts3.json';
import TomeOfBeasts2023 from './monsterJsons/TomeOfBeasts2023.json';

export const proxyUrl = window.location.href.includes("nicfornicola.com") 
                        ? 'https://nics-cors-anywhere-99e39b544c5d.herokuapp.com/' 
                        : "";

// export const proxyUrl = window.location.href.includes("localhost") 
//                         ? 'http://localhost:8080/' 
//                         : "";
                        
proxyUrl === "" ? console.log("No Proxy") : console.log("Using Proxy")

export const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
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
    '30': 155000
};

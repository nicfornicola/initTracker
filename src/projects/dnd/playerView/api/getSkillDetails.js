import { skill_codes, skills_long, skills_short } from '../../dmView/constants.js';


function extractAc(jsonData) {
    try {
        if (jsonData.definition.armorClass) {
            return jsonData.definition.armorClass;
        } else {
            return 0;
        }
    } catch (error) {
        return 0;
    }
}

export const getSkillDetails = (data) => {

    // Bonushp is maxHP modifier 
    if (data.overrideHitPoints) {
        return data.overrideHitPoints
    }
    

    let skill_race = [0, 0, 0, 0, 0, 0];
    let skill_AI = [0, 0, 0, 0, 0, 0];
    
    // Modifiers and proficiencies and racial resists
    data["modifiers"]["race"].forEach(mod => {    
        if (mod["type"] === "bonus") {
            for (let i = 0; i < 6; i++) {
                if (mod["friendlySubtypeName"] === skills_long[i]) {
                    skill_race[i] += mod["fixedValue"];
                }
            }
        } 
    });


    for (let choiceDef of data.choices.class) {
        if(choiceDef.label === "Choose an Ability Score") {
            for (let i = 0; i < 6; i++) {
                if (choiceDef.optionValue === skill_codes[i]) {
                    skill_AI[i]++;
                }
            }
        }
    }

    let skills_json_array = [];

    for (let i = 0; i < 6; i++) {
        let skill = {
            skill: skills_short[i],
            base: data["stats"][i]["value"],
            "racial bonus": skill_race[i],
            "ability score": skill_AI[i]
        };

        skill["total score"] = skill["base"] + skill["racial bonus"] + skill["ability score"];
        skill["modifier"] = Math.floor((skill["total score"] - 10) / 2);
        skills_json_array.push(skill);
    }

    let total_lvl = 0;

    data["classes"].forEach(classDND => {
        total_lvl += classDND["level"];
    });

    let hasTough = false;
    let toughHp = 0;
    
    data.feats.forEach(feat => {
        if (feat.definition.name === "Tough") {
            hasTough = true;
        }
    });
    
    if (hasTough) {
        toughHp = total_lvl * 2;
    }

    let baseHp = data["baseHitPoints"];
    let maxHp = skills_json_array[2]["modifier"] * total_lvl + baseHp + toughHp;

    // Bonushp is maxHP modifier 
    if (data.bonusHitPoints) {
        maxHp += data.bonusHitPoints
    }

    console.log("skills", skills_json_array)

    // =================
    // let nakedArmorClass = 10 + skills_json_array[1].modifier;
    let armorClass = 0;

    let shieldAcOnDexSaves = { shieldAc: 0, active: false, restrictions: [] };
    data.modifiers.feat.forEach(mod => {
        if (mod.type === "bonus") {
            if (mod.subType === "shield-ac-on-dex-saves") {
                shieldAcOnDexSaves.active = true;
                shieldAcOnDexSaves.restrictions = mod.restriction;
            }
        }
    });

    data.inventory.sort((a, b) => extractAc(b) - extractAc(a));

    let shield = false;
    let armor = false;
    let inventory = [];
    let modsFromItems = [];

    data.inventory.forEach(item => {
        let itemDef = item.definition;
        let itemDictionary = {
            name: itemDef.name,
            attackType: itemDef.attackType,
            damage: itemDef.damage,
            damageType: itemDef.damageType,
            type: itemDef.type,
            description: itemDef.description,
            range: itemDef.range,
            longRange: itemDef.longRange,
            equipped: itemDef.equipped,
            quantity: itemDef.quantity,
            isAttuned: itemDef.isAttuned,
        };

        if (itemDef.properties) {
            let properties = itemDef.properties.map(prop => {
                let itemProp = {
                    name: prop.name,
                    description: prop.description
                };
                if (prop.notes) {
                    itemProp.notes = prop.notes;
                }
                return itemProp;
            });
            itemDictionary.properties = properties;
        }

        let grantedModsArray = itemDef.grantedModifiers.map(grantedMod => ({
            id: grantedMod.id,
            fixedValue: grantedMod.fixedValue,
            dice: grantedMod.dice,
            restriction: grantedMod.restriction,
            type: grantedMod.type,
            subType: grantedMod.subType
        }));

        itemDictionary.grantedModifiers = grantedModsArray;

        if (item.equipped) {
            if (!shield && item.definition.baseArmorName === "Shield") {
                shield = true;
                armorClass += item.definition.armorClass;
                if (shieldAcOnDexSaves.active) {
                    shieldAcOnDexSaves.shieldAc = item.definition.armorClass;
                }
            } else if (!armor && item.definition.filterType.toLowerCase().includes("armor")) {
                armor = true;
                armorClass += item.definition.armorClass;
            }

            if (itemDictionary.grantedModifiers.length > 0) {
                modsFromItems.push(itemDictionary.grantedModifiers);
            }
        }

        inventory.push(itemDictionary);
    });

    return {maxHp, armorClass, inventory, skills_json_array};
};

export default getSkillDetails;




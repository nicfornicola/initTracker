import {skills_long, skills_short } from '../../dmView/constants.js';


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

    // ignore racial skill mods if background is from a newer source i.e. sourceId != 1
    // new backgrounds give skill mods, new races dont 
    // old backgrounds dont give skill mods, old races do
    // dndb overrides with the new stuff if mixed.
    let ignoreRace = false 
    data?.background?.definition?.sources?.forEach(source => {
        if(source?.sourceId !== 1)
            ignoreRace = true

    })
    
    let bonusAc = 0
    let bonuses = {
        "race": [0, 0, 0, 0, 0, 0],
        "class": [0, 0, 0, 0, 0, 0],
        "background": [0, 0, 0, 0, 0, 0],
        "item": [0, 0, 0, 0, 0, 0],
        "feat": [0, 0, 0, 0, 0, 0],
    }

    Object.entries(data.modifiers).forEach(([key, arr]) => {
        // Skip race
        if(ignoreRace && key === 'race') {
            console.log("Ignoring Old Racial Mods (if present) since there is a 2024 background being used...")
            return
        }

        arr.forEach(mod => {
            if(mod["type"] === "bonus") {
                let typeName = mod["friendlySubtypeName"]
                let indexOfMatch = skills_long.indexOf(typeName)

                if(indexOfMatch !== -1) {
                    bonuses[key][indexOfMatch] += mod["fixedValue"]
                } else if(typeName === 'Armored Armor Class' || typeName === 'Armor Class') {
                    // Get AC bonus from feats, class...
                    bonusAc += mod["fixedValue"]
                }
            } 
        })
    })

    let skills_json_array = [];
    for (let i = 0; i < 6; i++) {
        let skill = {
            skill: skills_short[i],
            base: data["stats"][i]["value"],
            "race":       bonuses['race'][i],
            "class":      bonuses['class'][i],
            "background": bonuses['background'][i],
            "item":       bonuses['item'][i],
            "feat":       bonuses['feat'][i]
        };

        skill["total score"] = 
            skill["base"] +
            skill["race"] +
            skill["class"] +
            skill["background"] +
            skill["item"] +
            skill["feat"];

        skill["modifier"] = Math.floor((skill["total score"] - 10) / 2);
        skills_json_array.push(skill);
    }

    let total_lvl = 0;
    let draconicResilienceHp = 0
    data["classes"].forEach(classDND => {
        total_lvl += classDND["level"];
        if(classDND?.subclassDefinition?.classFeatures) {
            let classFeatures = classDND.subclassDefinition.classFeatures
            classFeatures.forEach(classFeature => {
                if(classFeature.name === "Draconic Resilience") {
                    draconicResilienceHp = 1
                }
            });
        }
    });

    let hasTough = false;
    let toughHp = 0;
    // tough componentID 1789206
    data.feats.forEach(feat => {
        if (feat.definition.name === "Tough") {
            hasTough = true;
        }
    });
    
    if (hasTough) toughHp = total_lvl * 2;
    if(draconicResilienceHp) draconicResilienceHp = total_lvl
 

    // Hyron gets an extra con from hermit
    let baseHp = data["baseHitPoints"];
    let maxHp = (skills_json_array[2]["modifier"] * total_lvl) + baseHp + toughHp + draconicResilienceHp;

    if (data.overrideHitPoints) {
        maxHp = data.overrideHitPoints
    }

    // Bonushp is maxHP modifier 
    if (data.bonusHitPoints) {
        maxHp += data.bonusHitPoints
    }

    // =================
    // let nakedArmorClass = 10 + skills_json_array[1].modifier;
    let armorClass = bonusAc; // Start with AC from modifiers and DEX
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
    const armorTypeKey = {
        0: "none",
        1: "light",
        2: "medium",
        3: "heavy",
    }
    let armorType = "none"

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
                // AC from sheild
                if (shieldAcOnDexSaves.active) {
                    shieldAcOnDexSaves.shieldAc = item.definition.armorClass;
                }
            } else if (!armor && item.definition.filterType.toLowerCase().includes("armor")) {
                armor = true;
                // AC from armor
                armorClass += item.definition.armorClass;
                armorType = armorTypeKey[item.definition.armorTypeId]
            }

            if (itemDictionary.grantedModifiers.length > 0) {
                modsFromItems.push(itemDictionary.grantedModifiers);
            }
        }

        inventory.push(itemDictionary);
    });

    // Only add dex mod to ac is not wearing heavy armor
    if(armorType !== "heavy") {
        armorClass += skills_json_array[1].modifier
        // Add the default 10 if no armor
        if(armorType === "none") 
            armorClass += 10
    } 

    return {maxHp, armorClass, inventory, skills_json_array};
};

export default getSkillDetails;




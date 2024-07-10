import { skill_codes, skills_long, skills_short } from '../constants';


export const getMaxHp = (data) => {

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


    return maxHp;
};

export default getMaxHp;
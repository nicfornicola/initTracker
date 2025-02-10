export const actionsConsts =  {
    "atk mw": "Melee weapon attack: ",
    "atk rw": "Ranged weapon attack: ",
    "atk m": "Melee attack:", 
    "atk r": "Ranged attack:", 
    "atk a": "area attack:", 
    "atk aw": "area weapon attack:", 
    "atk ms": "Melee spell attack:", 
    "atk mw,rw": "Melee or Ranged weapon attack:", 
    "atk rs": "Ranged spell attack:", 
    "atk ms,rs": "Melee or Ranged spell attack:", 
    "atk m,r": "Melee or Ranged attack:", 
    "atk mp": "Melee power attack:", 
    "atk rp": "Ranged power attack:", 
    "atk mp,rp": "Melee or Ranged power attack:", 
    "atkr m": "Melee attack roll:", 
    "atkr r": "Ranged attack roll:", 
    "atkr m,r": "Melee or Ranged attack roll:", 
}

export const legendaryDescDefault = (name) => {
    return `Legendary Action Slots: 3. Immediately after another creature's turn, The ${name} can expend a use to take one of the following actions. The ${name} regains all expended uses at the start of each of their turns.`
}

export const vocab = {
    'instant': 'Instantaneous',
    'action': 'Action',
    'bonus': 'Bonus action',
    'minute': 'Minute'
}

export const schoolOfSpell = {
    'V': 'Evocation',
    'T': 'Transmutation',
    'A': 'Abjuration',
    'I': 'Illusion',
    'E': 'Enchantment',
    'C': 'Conjuration',
    'N': 'Necromancy',
    'D': 'Divination',
}

export const skillsReplace = {
    'str': 'Strength',
    'dex': 'Dexterity',
    'con': 'Constitution',
    'int': 'Intelligence',
    'wis': 'Wisdom',
    'cha': 'Charisma',
}

export const cleanPipes = (key) => {
    let name;
    let textToBeShown;

    if(key.includes("|||")) { // {@status textToBeShown|||info}
        let keys = key.split('|||')
        name = keys[0]
        textToBeShown = name
    } else if(key.includes("||")) { // {@status name||textToBeShown}
        let keys = key.split('||')
        name = keys[0]
        textToBeShown = keys[1]
    } else if(key.includes("|")) {
        let keys = key.split('|')
        name = keys[0]; 
        textToBeShown = keys.length > 2 ? keys.at(-1) : name; 

    } else {
        name = key; 
        textToBeShown = name; 
    }
    
    return {name, textToBeShown}
}

export const titleCase = (str) => {
    return str
      .split(' ') // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string
};

const getRecharge = (str) => {
    if(str === '')
        return '6'

    return str+'-6'
}

export const replace = (key) => {
    if (key.startsWith("dc ")) return <strong>DC {key.slice(3)}</strong>;
    else if (key.startsWith("b ")) return <strong>{key.slice(2)}</strong>;
    else if (key.startsWith("d20 ")) return <strong>{key.slice(4)}</strong>;
    else if (key.startsWith("hit ")) return <strong>+{key.slice(4)}</strong>;
    else if (key.startsWith("item ")) return <strong>{cleanPipes(key.slice(5)).textToBeShown}</strong>;
    else if (key.startsWith("dice ")) return <strong>{key.slice(5)}</strong>;
    else if (key.startsWith("skill ")) return <strong>{cleanPipes(key.slice(6)).textToBeShown}</strong>;
    else if (key.startsWith("sense ")) return <strong>{key.slice(6)}</strong>;
    else if (key.startsWith("damage ")) return <strong>{key.slice(7)}</strong>;
    else if (key.startsWith("actSave ")) return <strong>{skillsReplace[key.slice(8)]} Saving Throw</strong>;
    else if (key.startsWith("actSaveSuccessOrFail")) return <strong>Fail or Success:</strong>;
    else if (key.startsWith("actSaveFail")) return <strong>On Fail:</strong>;
    else if (key.startsWith("actSaveSuccess")) return <strong>On Success:</strong>;
    else if (key.startsWith("recharge")) return <strong>(Recharge {getRecharge(key.slice(8))})</strong>;
    else if (key.startsWith("creature ")) return <strong>{cleanPipes(key.slice(9)).textToBeShown}</strong>;
    else if (key.startsWith("adventure ")) return <strong>{cleanPipes(key.slice(10)).textToBeShown}</strong>;
    else if (key.startsWith("hitYourSpellAttack ")) return <strong>{cleanPipes(key.slice(18)).textToBeShown}</strong>;
    else if (key.startsWith("action opportunity attack")) return <strong>Opportunity Attack</strong>;
    else if (key.startsWith("quickref difficult terrain||3")) return <strong>difficult terrain</strong>;
    else if (key.startsWith("quickref Cover||3||total cover")) return <strong>total cover</strong>;
    else if (key.startsWith("quickref saving throws|PHB|2|1|saving throw")) return <strong>saving throw</strong>;
    else if (key.startsWith("chance ")) return <strong>{cleanPipes(key.slice(7)).textToBeShown}%</strong>;
    else if (key.startsWith("quickref Vision and Light")) return <strong>{cleanPipes(key.slice(25)).textToBeShown}</strong>;
    else if (key.startsWith("quickref ")) return <strong>{cleanPipes(key.slice(9)).textToBeShown}</strong>;
    else if (key.startsWith("scaledamage ")) return <strong>{key.slice(12).split('|').at(-1)}</strong>;
    else if (key.startsWith("variantrule ")) return <strong>{cleanPipes(key.slice(12)).textToBeShown}</strong>;
    else if (key.startsWith("action ")) return <strong>{cleanPipes(key.slice(7)).textToBeShown}</strong>;
    else if (key.startsWith("scaledice ")) return <strong>{cleanPipes(key.slice(10)).textToBeShown}</strong>;
    else if (key.startsWith("book ")) return <strong>{cleanPipes(key.slice(5)).textToBeShown}</strong>;
    else if (key.startsWith("hazard ")) return <strong>{cleanPipes(key.slice(7)).textToBeShown}</strong>;
    else if (key.startsWith("i ")) return <i>'{cleanPipes(key.slice(2)).textToBeShown}'</i>;
    else if (key in actionsConsts) return <span>{actionsConsts[key]}</span>;
    return null
}

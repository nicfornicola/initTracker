import React from 'react';

function addSign(modNumber) {
    //catches 0 and null
    if (!modNumber)
        return '+0'

    if (modNumber > 0) {
        return `+${modNumber}`;
    }

    return `${modNumber}`; // Negative number already has a minus sign
}

function getModString(modNumber) {
    let result = Math.floor((modNumber-10)/2);
    return addSign(result)
}

const SkillGridInput = ({value, cKey, disabled = false, handleChange, style}) => {
    return (
        <input className='statBlockSkillsInput' 
            disabled={disabled || handleChange === undefined}
            style={style} 
            value={value} 
            onFocus={(e) => e.target.select()} 
            type='text' 
            onChange={e => handleChange(e, cKey)} 
            onBlur={e => handleChange(e, cKey, undefined, undefined, true)} 
            onClick={(event) => event.stopPropagation()} 
        />
    )
}

const SkillGridItem = ({skillName, skillTotal, skillSave, edit, handleChange}) => {
    let editStyle = edit ? {borderBottom: '3px dotted grey'} : {}
    const bigLetter = skillName.charAt(0); // Gets the first letter
    const smallLetters = skillName.slice(1); // Gets the rest of the string

    let skillKeys = {
        'STR':['strength', 'strength_save'],
        'DEX':['dexterity', 'dexterity_save'],
        'CON':['constitution', 'constitution_save'],
        'INT':['intelligence', 'intelligence_save'],
        'WIS':['wisdom', 'wisdom_save'],
        'CHA':['charisma', 'charisma_save']
    }


    return (
        <>
            <div className="skillGridItem titleFontFamily">
                <strong>{bigLetter}<span>{smallLetters}</span></strong>
            </div>
            <div className="skillGridItem">
                <SkillGridInput value={skillTotal} cKey={skillKeys[skillName][0]} handleChange={handleChange} style={editStyle}/>
            </div>
            <div className="skillGridItem">
                <SkillGridInput value={getModString(skillTotal)} disabled={true} style={{}}/>
            </div>
            <div className="skillGridItem">
                <SkillGridInput value={addSign(skillSave)} cKey={skillKeys[skillName][1]} handleChange={handleChange} style={editStyle}/>
            </div>
        </> 
  );
}

export default SkillGridItem;
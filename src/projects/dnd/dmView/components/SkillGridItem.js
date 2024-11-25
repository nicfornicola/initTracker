import React from 'react';

function addSign(modNumber) {
    if (modNumber == null)
        return '0'

    if (modNumber > 0) {
        return `+${modNumber}`;
    }

    return `${modNumber}`; // Negative number already has a minus sign
}

function getModString(modNumber) {
    let result = Math.floor((modNumber-10)/2);
    return addSign(result)
}

const SkillGridItem = ({skill, skillMod, skillSaveMod, edit}) => {
    let editStyle = edit ? {borderBottom: '3px dotted grey'} : {}
    const bigLetter = skill.charAt(0); // Gets the first letter
    const smallLetters = skill.slice(1); // Gets the rest of the string
    return (
        <>
            <div className="skillGridItem">
                <strong>{bigLetter}<span>{smallLetters}</span></strong>
            </div>
            <div className="skillGridItem">
                <input className='statBlockSkillsInput' style={editStyle} defaultValue={skillMod} onFocus={(e) => e.target.select()} type='text' onChange={()=>{}} onBlur={()=>{}} onClick={(event) => event.stopPropagation()} />
            </div>
            <div className="skillGridItem">
                <input className='statBlockSkillsInput' style={editStyle} defaultValue={getModString(skillMod)} onFocus={(e) => e.target.select()} type='text' onChange={()=>{}} onBlur={()=>{}} onClick={(event) => event.stopPropagation()} />
            </div>
            <div className="skillGridItem">
                <input className='statBlockSkillsInput' style={editStyle} defaultValue={addSign(skillSaveMod)} onFocus={(e) => e.target.select()} type='text' onChange={()=>{}} onBlur={()=>{}} onClick={(event) => event.stopPropagation()} />
            </div>
        </> 
  );
}

export default SkillGridItem;
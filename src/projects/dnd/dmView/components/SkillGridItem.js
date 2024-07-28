import React from 'react';

function addSign(modNumber) {
    if (modNumber == null)
        return '+0'

    if (modNumber >= 0) {
        return `+${modNumber}`;
    }

    return `${modNumber}`; // Negative number already has a minus sign
}

function getModString(modNumber) {
    let result = Math.floor((modNumber-10)/2);
    return addSign(result)
}

const SkillGridItem = ({skill, skillMod, skillSaveMod}) => {
    
    const bigLetter = skill.charAt(0); // Gets the first letter
    const smallLetters = skill.slice(1); // Gets the rest of the string
    return (
       <>
        <div className="skillGridItem">
            <strong>{bigLetter}<span>{smallLetters}</span></strong>
        </div>
        <div className="skillGridItem">
            {skillMod}
        </div>
        <div className="skillGridItem">
            {getModString(skillMod)}
        </div>
        <div className="skillGridItem">
            {addSign(skillSaveMod)}
        </div>
     </>
  );
}

export default SkillGridItem;
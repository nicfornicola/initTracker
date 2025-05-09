import React from 'react';
import { addSign } from '../constants';


function getModString(modNumber) {
    let result = Math.floor((modNumber-10)/2);
    return addSign(result)
}

const SkillGridInput = ({value, cKey, disabled = false, handleChange, style}) => {

    const validate = (e, cKey, send = false) => {
        if(!isNaN(e.target.value))
            handleChange(e, cKey, undefined, undefined, send)
    }

    return (
        <input className='statBlockSkillsInput' 
            disabled={disabled || handleChange === undefined}
            style={style} 
            value={value} 
            onFocus={(e) => e.target.select()} 
            type='text' 
            onChange={e => validate(e, cKey)} 
            onBlur={e => validate(e, cKey, true)} 
            onClick={(event) => event.stopPropagation()} 
        />
    )
}
const changeName = window.location.search.includes('becca')

function getName(skillName) {
    if(!changeName) {
        return skillName
    } else {
        let skillKeys = {
            'STR': 'P.Att.',
            'DEX': 'P.Def.',
            'CON': 'M.Att.',
            'INT': 'M.Def.',
        }

        return skillKeys[skillName]

    }
}

const SkillGridItem = ({skillName, skillTotal, skillSave, edit, handleChange}) => {
    let editStyle = edit ? {borderBottom: '3px dotted grey'} : {}
    let skill = getName(skillName)
    const bigLetter = skill.charAt(0); // Gets the first letter
    const smallLetters = skill.slice(1); // Gets the rest of the string

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
            <div className="skillGridItem" style={{color: '#822000'}}>
                <strong>{bigLetter}<span>{smallLetters}</span></strong>
            </div>
            <div className="skillGridItem">
                <SkillGridInput value={skillTotal} cKey={skillKeys[skillName][0]} handleChange={handleChange} style={editStyle}/>
            </div>
            <div className="skillGridItem">
                <SkillGridInput value={getModString(skillTotal)} disabled={true} style={{}}/>
            </div>
            {!changeName && 
                <div className="skillGridItem">
                    <SkillGridInput value={addSign(skillSave)} cKey={skillKeys[skillName][1]} handleChange={handleChange} style={editStyle}/>
                </div>
            }
            
            
        </> 
  );
}

export default SkillGridItem;
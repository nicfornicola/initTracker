import React, {useState} from 'react';
import OptionButton from '../EncounterColumn/OptionButton';
import magPlus from '../../pics/icons/magPlus.PNG'

function numEnd(input) {
    if(!input && input !== '0') {
        return ""
    }
    // Convert the input to a number
    const number = parseInt(input, 10);

    // Return the input as-is if it's not a valid number
    if (isNaN(number)) return input;

    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    // Handle special cases for 11, 12, and 13
    if (remainder >= 11 && remainder <= 13) {
        return `${number}th`;
    }

    // Use the last digit to determine the suffix
    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit] || "th";
    return `${number}${suffix}`;
}

const EditSpellDropdown = ({handleChange, objIndex}) => {
    const [newSpellType, setNewSpellType] = useState('At Will')
    const [newSpellLevelSlots, setNewSpellLevelSlots] = useState(3)
    const [newSpellLevel, setNewSpellLevel] = useState(1)
    const [newPerDaySlots, setNewPerDaySlots] = useState(3)
    const [newTimeFrame, setNewTimeFrame] = useState('Day')
    const spellOptions = ['At Will', 'X/day', 'X level/Cantrip']
    const spellLevelOptions = [0,1,2,3,4,5,6,7,8,9]
    
    let path = ''
    if(newSpellType === 'At Will') {
        path = `will.`
    } else if(newSpellType === 'X/day') {
        path = `daily.${newPerDaySlots}e`
    } else if(newSpellType === 'X level/Cantrip') {
        path = `spells.${newSpellLevel}.spells`

    }

    let addString = 'Cantrip'

    if(newSpellType === spellOptions[0])
        addString = spellOptions[0]
    else if(newSpellType === spellOptions[1])
        addString = `${newPerDaySlots}/${newTimeFrame}`
    else if(newSpellType === spellOptions[2])
        addString = `${numEnd(newSpellLevel)} lvl (${newSpellLevelSlots} slots)`

    let spellExample = newSpellLevel === 0 ? 'Cantrips (at will)' : `${numEnd(newSpellLevel)} lvl (${newSpellLevelSlots} slot${newSpellLevelSlots !== 1 && 's'})`

    return (
        <div className='editSpellBlock'>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <i className='editBlockTitle'>New Spell Type:</i>
                <select className='editBlockInput' 
                    style={{width: 'fit-content'}}
                    value={newSpellType} 
                    onChange={(e) => setNewSpellType(e.target.value)}
                >
                    {spellOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <OptionButton src={magPlus} message={`Add ${addString}`} 
                    onClickFunction={(e) => handleChange({target: {value: newSpellLevelSlots}}, 'add', path, objIndex, true)}
                />

            </div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {newSpellType === spellOptions[1] &&
                    <>
                        <i className='editBlockTitle'>Slots: </i>
                        <select className='editBlockInput' 
                            style={{width: 'fit-content'}}
                            value={newPerDaySlots} 
                            onChange={(e) => setNewPerDaySlots(e.target.value)}
                            // onBlur={(e) => handleChange(e, cKey, undefined, undefined, true)}
                        >
                            {spellLevelOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <i className='editBlockTitle'> Per: </i>
                        <select className='editBlockInput' 
                            style={{width: 'fit-content'}}
                            value={newTimeFrame} 
                            onChange={(e) => setNewTimeFrame(e.target.value)}
                            // onBlur={(e) => handleChange(e, cKey, undefined, undefined, true)}
                        >
                            {["Day", "Week", "Short Rest", "Long Rest"].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <i> - ({newPerDaySlots}/{newTimeFrame})</i>
                    </>
                }
                {newSpellType === spellOptions[2] &&
                    <>
                        <i className='editBlockTitle'>Spell Level&nbsp;</i>
                        <select className='editBlockInput' 
                            style={{width: 'fit-content'}}
                            value={newSpellLevel} 
                            onChange={(e) => setNewSpellLevel(parseInt(e.target.value))}
                            // onBlur={(e) => handleChange(e, cKey, undefined, undefined, true)}
                        >
                            {spellLevelOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {newSpellLevel > 0 &&
                            <>
                                <i className='editBlockTitle'>&nbsp;Slot{newSpellLevelSlots !== 1 && <>s</>}</i>
                                <select className='editBlockInput' 
                                    style={{width: 'fit-content'}}
                                    value={newSpellLevelSlots} 
                                    onChange={(e) => setNewSpellLevelSlots(parseInt(e.target.value))}
                                >
                                    {spellLevelOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </>
                        }                 
                    
                        &nbsp; - {spellExample}
                        
                    </>
                }
            </div>
            <hr/>
        </div>
    );
}

export default EditSpellDropdown;
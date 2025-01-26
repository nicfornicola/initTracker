import React, {useEffect, useRef, useState} from 'react';
import OptionButton from '../EncounterColumn/OptionButton'
import magPlus from '../../pics/icons/magPlus.PNG'
import magMinus from '../../pics/icons/magMinus.PNG'
import EditSpellDropdown from './EditSpellDropdown';
import EditSpellInput from './EditSpellInput';

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

const timeFrameKeys = {
    "daily": "Day",
    "week": "Week",
    "lr": "Long Rest",
    "sr": "Short Rest"
}

const EditSpellCasting = ({label, spellcasting = [], category, handleChange = undefined}) => {
    const textareaRefs = useRef([]);
    
    useEffect(() => {
        textareaRefs.current.forEach((textarea) => {
            if (textarea) {
                textarea.style.height = "auto"; 
                textarea.style.height = `${textarea.scrollHeight}px`; 
            }
        });
    }, []);


    const handleFocus = (e) => { 
        if(e.target.value === 'None' || e.target.value === '--') 
            e.target.select();
    }

    return (
        <div className='editBlock'>
            <i className='editBlockTitle'>{label}</i>
            {spellcasting?.map((spellListObj, objIndex) => (
                <div className='actionListItem'>
                    <div style={{display: 'flex'}}>
                        <input className="editBlockInput" type='text'
                            value={spellListObj.name}
                            onChange={(e) => handleChange(e, 'name', category, objIndex)} 
                            onBlur={(e) => handleChange(e, 'name', category, objIndex, true)} 
                            size={spellListObj.name.length}
                            onFocus={handleFocus}
                        />
                        <OptionButton src={magMinus} message={`Remove: ${spellListObj.name}`} onClickFunction={(e) => handleChange(e, 'remove', category, objIndex, true)} wrapperClassName='actionTrash'/>
                    </div>
                    <textarea
                        ref={(element) => (textareaRefs.current[objIndex] = element)} 
                        className="editBlockBigInput"
                        type="text"
                        value={spellListObj?.headerEntries}
                        onChange={(e) => handleChange(e, 'headerEntries', category, objIndex)} 
                        onBlur={(e) => handleChange(e, 'headerEntries', category, objIndex, true)} 
                        onFocus={handleFocus}
                    />    
                    <EditSpellDropdown handleChange={handleChange} objIndex={objIndex}/>
                    {Object.entries(spellListObj).map(([key, value], index) => {
                        if (key === "will") {
                            return <span>
                                <span className='spellTypeRemove'>
                                    At will: 
                                    <OptionButton wrapperClassName='spellTypeTrash' src={magMinus} message={`Remove: 'At Will'`}
                                        onClickFunction={(e) => handleChange(e, 'remove', 'will.', objIndex, true)}
                                    />
                                </span>
                                
                                <ul className='spellUl'>
                                    {value.map((spellName, spellIndex) => {
                                        return (
                                            <EditSpellInput spellName={spellName} path={`will.${spellIndex}`} objIndex={objIndex} handleChange={handleChange} />                                                
                                        )
                                    })}
                                </ul>
                                <OptionButton src={magPlus} message={`Add spell to: 'At will'`}
                                    // will. period is here to get past path check
                                    onClickFunction={(e) => handleChange(e, 'add', `will.`, objIndex, true)}
                                />

                            </span>  
                        }

                        if (key === "daily" || key === "week" || key === "lr" || key === "sr") {
                            return Object.entries(value).map(([dailySpell, spells]) => (
                                <>
                                    <span className='spellTypeRemove'>
                                        {dailySpell.slice(0, 1)}/{timeFrameKeys[key]} each: 
                                        <OptionButton wrapperClassName='spellTypeTrash' src={magMinus} message={`Remove: ${dailySpell.slice(0, 1)}/day'`}
                                            onClickFunction={(e) => handleChange(e, 'remove', `daily.${dailySpell}.`, objIndex, true)}
                                        />
                                    </span>
                                    <ul className='spellUl'>
                                        {spells.map((spellName, spellIndex)=>{
                                            return (
                                                <EditSpellInput spellName={spellName} path={`daily.${dailySpell}.${spellIndex}`} objIndex={objIndex} handleChange={handleChange} />
                                            )
                                        })}
                                    </ul>
                                    <OptionButton src={magPlus} message={`Add spell to: '${dailySpell.slice(0, 1)}/day'`}
                                        onClickFunction={(e) => handleChange(e, 'add', `daily.${dailySpell}`, objIndex, true)}
                                    />

                                </>
                            ))
                        }

                        if (key === "spells") {
                            return Object.entries(value).map(([level, spellDetails]) => {
                                if (level === "0") {
                                    return <span>
                                        <span className='spellTypeRemove'>
                                            Cantrips (at will): 
                                            <OptionButton wrapperClassName='spellTypeTrash' src={magMinus} message={`Remove: 'Cantrips'`}
                                                onClickFunction={(e) => handleChange(e, 'remove', `spells.0.`, objIndex, true)}
                                            />
                                        </span>
                                        <ul className='spellUl'>
                                            {spellDetails.spells.map((spellName, spellIndex) => {
                                                return (
                                                    <EditSpellInput spellName={spellName} path={`spells.0.spells.${spellIndex}`} objIndex={objIndex} handleChange={handleChange} />
                                                )
                                            })}
                                        </ul>
                                        <OptionButton src={magPlus} message={`Add Cantrip spell`} 
                                            onClickFunction={(e) => handleChange(e, 'add', `spells.0.spells`, objIndex, true)}
                                        />
                                    </span>
                                }
        
                                const { lower, slots, spells } = spellDetails;
                                return <span>
                                        <span className='spellTypeRemove'>
                                            {lower && `${lower}-`}
                                            {numEnd(level)} lvl: ({slots}{" "}
                                            {lower && <i>{numEnd(level)}-level spell</i>} slots):&nbsp;
                                            <OptionButton wrapperClassName='spellTypeTrash' src={magMinus} message={`Remove: '${numEnd(level)} lvl'`}
                                                onClickFunction={(e) => handleChange(e, 'remove', `spells.${level}.`, objIndex, true)}
                                            />
                                        </span>
                                        <ul className='spellUl'>
                                            {spells.map((spellName, spellIndex)=> {
                                                return <EditSpellInput spellName={spellName} path={`spells.${level}.spells.${spellIndex}`} objIndex={objIndex} handleChange={handleChange} />
                                            })}
                                        </ul>
                                        <OptionButton src={magPlus} message={`Add ${numEnd(level)}-lvl spell`} 
                                            onClickFunction={(e) => handleChange(e, 'add', `spells.${level}.spells`, objIndex, true)}
                                        />
                                    </span>
                            });
                        }

                        return null
                    })}
                    <hr/>  
                </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <OptionButton src={magPlus} message={`Add ${label}`} onClickFunction={(e) => handleChange(e, 'add', category)}/>
            </div>
        </div>
    )
}

export default EditSpellCasting;
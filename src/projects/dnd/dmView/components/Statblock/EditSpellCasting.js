import React, {useEffect, useRef} from 'react';
import OptionButton from '../EncounterColumn/OptionButton'
import magPlus from '../../pics/icons/magPlus.PNG'
import magMinus from '../../pics/icons/magMinus.PNG'
import EditSpellDropdown from './EditSpellDropdown';

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

    console.log("==")
    console.log(spellcasting)
    return (
        <div className='editBlock'>
            <i className='editBlockTitle'>{label}</i>
            {spellcasting?.map((spellListObj, objIndex) => (
                <div key={label + objIndex} className='actionListItem'>
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
                    <EditSpellDropdown />
                    {Object.entries(spellListObj).map(([key, value]) => {
                        if (key === "will") {
                            return <>
                                At will:
                                <ul>
                                    {value.map((spellName, spellIndex) => {
                                        return <li key={spellName} className='spellLi'>
                                            <input className="editBlockInput" type='text'
                                                value={spellName}
                                                onChange={(e) => handleChange(e, 'name', category, objIndex)} 
                                                onBlur={(e) => handleChange(e, 'name', category, objIndex, true)} 
                                                size={spellName.length}
                                                onFocus={handleFocus} 
                                            />
                                            <OptionButton src={magMinus} message={`Remove: ${spellName.replace(/{@spell|}/g, "")}`} wrapperClassName='spellTrash'
                                                onClickFunction={(e) => handleChange(e, 'remove', `will.${spellIndex}`, objIndex, true)}
                                            />

                                        </li>
                                    })}
                                </ul>
                                <OptionButton src={magPlus} message={`Add spell to: 'At will:'`}
                                    // will. period is here to get past path check
                                    onClickFunction={(e) => handleChange(e, 'add', `will.`, objIndex)}
                                />

                            </>  
                        }

                        if (key === "daily") {
                            return Object.entries(value).map(([dailySpell, spells]) => (
                                <>
                                    {dailySpell.slice(0, 1)}/day each: 
                                    <ul>
                                        {spells.map((spellName, spellIndex)=>{
                                            return (
                                                <li key={spellName} className='spellLi'>
                                                    <input className="editBlockInput" type='text'
                                                        value={spellName}
                                                        onChange={(e) => handleChange(e, 'name', category, objIndex)} 
                                                        onBlur={(e) => handleChange(e, 'name', category, objIndex, true)} 
                                                        size={spellName.length}
                                                        onFocus={handleFocus} />
                                                        <OptionButton src={magMinus} message={`Remove: ${spellName.replace(/{@spell|}/g, "")}`} wrapperClassName='spellTrash'
                                                            onClickFunction={(e) => handleChange(e, 'remove', `daily.${dailySpell}.${spellIndex}`, objIndex, true)}
                                                        />
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <OptionButton src={magPlus} message={`Add spell to: '${dailySpell.slice(0, 1)}/day'`}
                                        onClickFunction={(e) => handleChange(e, 'add', `daily.${dailySpell}`, objIndex)}
                                    />

                                </>
                            ))
                        }

                        if (key === "spells") {
                            return Object.entries(value).map(([level, spellDetails]) => {
                                if (level === "0") {
                                    return <>
                                        Cantrips (at will): 
                                        <ul>
                                            {spellDetails.spells.map((spellName, spellIndex) => {
                                                return (
                                                    <li key={spellName} className='spellLi'>
                                                        <input className="editBlockInput" type='text'
                                                            value={spellName}
                                                            //(e, cKey, path = undefined, index = undefined, send = false) => {

                                                            onChange={(e) => handleChange(e, 'spellcasting', `spells.0.spells.${spellIndex}`, objIndex)} 
                                                            onBlur={(e) => handleChange(e, 'spellcasting', `spells.0.spells.${spellIndex}`, objIndex, true)} 
                                                            size={spellName.length}
                                                            onFocus={handleFocus} />
                                                            <OptionButton src={magMinus} message={`Remove: ${spellName.replace(/{@spell|}/g, "")}`} wrapperClassName='spellTrash' 
                                                                onClickFunction={(e) => handleChange(e, 'remove', `spells.0.spells.${spellIndex}`, objIndex)}
                                                            />
                                                    </li>
                                                )
                                                
                                            })}
                                        </ul>
                                        <OptionButton src={magPlus} message={`Add Cantrip spell`} 
                                            onClickFunction={(e) => handleChange(e, 'add', `spells.0.spells`, objIndex)}
                                        />
                                    </>
                                }
        
                                const { lower, slots, spells } = spellDetails;
                                return <>
                                    {lower && `${lower}-`}
                                    {numEnd(level)} lvl: ({slots}{" "}
                                    {lower && <i>{numEnd(level)}-level spell</i>} slots):&nbsp;
                                    <ul>
                                        {spells.map((spellName, spellIndex)=> {
                                            return ( 
                                                <li key={spellName} className='spellLi'>
                                                    <input className="editBlockInput" type='text'
                                                        value={spellName}
                                                        onChange={(e) => handleChange(e, 'name', category, objIndex)} 
                                                        onBlur={(e) => handleChange(e, 'name', category, objIndex, true)} 
                                                        size={spellName.length}
                                                        onFocus={handleFocus} />
                                                        <OptionButton src={magMinus} message={`Remove ${spellName.replace(/{@spell|}/g, "")}`} wrapperClassName='spellTrash'
                                                            onClickFunction={(e) => handleChange(e, 'remove', `spells.${level}.spells.${spellIndex}`, objIndex)}
                                                        />
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <OptionButton src={magPlus} message={`Add ${numEnd(level)}-lvl spell`} 
                                        onClickFunction={(e) => handleChange(e, 'add', `spells.${level}.spells`, objIndex)}
                                    />
                                </>
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
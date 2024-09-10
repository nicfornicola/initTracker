import React, { useState, useEffect }from 'react';
import { INIT_ENCOUNTER_NAME } from '../constants';

const EncounterListTitle = ({handleTurnNums, currentEncounter, setCurrentEncounter, handleStartEncounter, handleAutoRollInitiative, setNameChange}) => {
    const [encounterName, setEncounterName] = useState(currentEncounter.encounterName);


    useEffect(() => {
        if(encounterName !== currentEncounter.encounterName) {
            setEncounterName(currentEncounter.encounterName)
        }
    }, [currentEncounter.encounterName]);


    let titleColor = encounterName === INIT_ENCOUNTER_NAME ? 'grey' : ''
    let {roundNum, turnNum} = handleTurnNums()

    const handleTitleChange = (e) => {
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    const handleEncounterNameChange = (e) => {
        if (currentEncounter.encounterName !== e.target.value) {
            setEncounterName(e.target.value);
            setCurrentEncounter(prev => ({...prev, encounterName: e.target.value}))
            setNameChange(true)
        }
    };

    return (
        <div className='encounterTitleEditContainer animated-label'>                     
            <div className='nameInputContainer'>
                <input style={{color: titleColor}} className='nameInput' type='text' value={encounterName} onChange={handleTitleChange} onBlur={handleEncounterNameChange} onClick={(event) => event.target.select()}/>
                <span className='encounterTitleEdit'>🖉</span>
            </div>
            {currentEncounter.currentEncounterCreatures.length > 0 && encounterName !== INIT_ENCOUNTER_NAME && 
                <div className='encounterTitleButtonGroup' onClick={(e) => e.stopPropagation()}>
                    <div className='dmStartButtons'>
                        <button className='dmViewButton' onClick={handleAutoRollInitiative}>Auto Initiative</button>
                        <button className='dmViewButton' onClick={handleStartEncounter}>Play</button>
                    </div>
                    <div className='turnButtons'>
                        <button className='dmViewButton' onClick={(e) => handleTurnNums('prev', e)}> {'<<'} </button>
                        <div className='turnText'>
                            <div>
                                Round: {roundNum}
                            </div>
                            <div>
                                Turn: {turnNum}
                            </div>
                        </div>
                        <button className='dmViewButton' onClick={(e) => handleTurnNums('next', e)}> {'>>'} </button>
                    </div>
                    
                </div>
            }
        </div>
    );
}

export default EncounterListTitle;
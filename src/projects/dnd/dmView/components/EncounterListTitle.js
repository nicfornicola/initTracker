import React from 'react';
import { INIT_ENCOUNTER_NAME } from '../constants';

const EncounterListTitle = ({handleTurnNums, encounterName, setEncounterName, currentEncounter, handleStartEncounter, handleAutoRollInitiative}) => {

    let titleColor = encounterName === INIT_ENCOUNTER_NAME ? 'grey' : ''
    let {roundNum, turnNum} = handleTurnNums()

    const handleEditTitleChange = (e) => {
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    return (
        <div className='encounterTitleEditContainer animated-label'>                     
            <div className='nameInputContainer'>
                <input style={{color: titleColor}} className='nameInput' type='text' defaultValue={encounterName} onBlur={handleEditTitleChange} onClick={(event) => event.target.select()}/>
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
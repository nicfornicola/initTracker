import React from 'react';

const EncounterListTitle = ({setShowEncounterTitleEdit, handleTurnNums, encounterName, currentEncounterCreatures, handleStartEncounter, handleAutoRollInitiative}) => {

    let titleColor = ''
    if (encounterName === 'Name Your Encounter')
        titleColor = 'grey'
    
    let {roundNum, turnNum} = handleTurnNums()

    return (
        <div className='encounterTitleEditContainer animated-label' onClick={() => setShowEncounterTitleEdit(true)}>                     
            <div className='encounterTitle'><strong style={{color: titleColor}}>{encounterName}</strong></div>
            <div className='encounterTitleEdit'>🖉</div>
            {currentEncounterCreatures.length > 0 && 
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
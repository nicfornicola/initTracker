import React from 'react';

const EncounterListTitle = ({setShowEncounterTitleEdit, titleColor, encounterName, currentEncounterCreatures, handleStartEncounter}) => {
    return (
        <div className='encounterTitleEditContainer animated-label' onClick={() => setShowEncounterTitleEdit(true)}>                     
            <div className='encounterTitle'><strong style={{color: titleColor}}>{encounterName}</strong></div>
            <div className='encounterTitleEdit'>🖉</div>
            {currentEncounterCreatures.length > 0 &&                                 
                <button className='dmViewButton' onClick={handleStartEncounter} >Play</button>
            }
        </div>
    );
}

export default EncounterListTitle;
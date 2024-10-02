import React from 'react';
import DropdownMenu from './DropdownMenu';
import NewEncounterButton from './NewEncounterButton';

const EncounterListTopInfo = ({savedEncounters, setSavedEncounters, handleLoadEncounter, currentEncounter, clickEncounterDropdownMenuX, handleSaveEncounter, handleNewEncounter, saveMessageColor, showSaveMessage, isSaveDisabled}) => {
    return (
        <div className='creatEncounterTopInfo'>
            <h3 className='titleFontFamily'>Create Encounter</h3>
            <div className='dmViewButtonContainer'>
                <DropdownMenu savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters} handleLoadEncounter={handleLoadEncounter} currentEncounter={currentEncounter} clickEncounterDropdownMenuX={clickEncounterDropdownMenuX}/>
                <NewEncounterButton handleNewEncounter={handleNewEncounter} />
                <button className='dmViewButton' onClick={handleSaveEncounter} disabled={isSaveDisabled} style={{border: saveMessageColor}}>  {showSaveMessage ? 'Saved Encounter!' : 'Save Encounter'} </button>
            </div>
        </div>
    );
}

export default EncounterListTopInfo;
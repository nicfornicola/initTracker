import React from 'react';
import DropdownMenu from './DropdownMenu';
import NewEncounterButton from './NewEncounterButton';

const EncounterListTopInfo = ({savedEncounters, setSavedEncounters, handleLoadEncounter, currentEncounter, handleSaveEncounter, handleNewEncounter, saveMessageColor, showSaveMessage, isSaveDisabled, socket}) => {
    return (
        <div className='creatEncounterTopInfo'>
            <h3 className='titleFontFamily'>Current Encounter <span style={{fontSize: '12px'}}> {"- " + currentEncounter.encounterGuid}</span> </h3>
            <div className='dmViewButtonContainer'>
                <DropdownMenu savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters} handleLoadEncounter={handleLoadEncounter} currentEncounter={currentEncounter} socket={socket}/>
                <NewEncounterButton handleNewEncounter={handleNewEncounter} />
                <button className='dmViewButton' onClick={handleSaveEncounter} disabled={isSaveDisabled} style={{border: saveMessageColor}}>  {showSaveMessage ? 'Saved Encounter!' : 'Save Encounter'} </button>
            </div>
        </div>
    );
}

export default EncounterListTopInfo;
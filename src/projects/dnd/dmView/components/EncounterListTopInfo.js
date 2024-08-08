import React from 'react';
import DropdownMenu from './DropdownMenu';

const EncounterListTopInfo = ({savedEncounters, setSavedEncounters, handleLoadEncounter, lastEncounterName, currentEncounterCreatures, clickEncounterDropdownMenuX, handleSaveEncounter, handleNewEncounter, saveMessageColor, showSaveMessage, isSaveDisabled}) => {
    return (
        <div className='creatEncounterTopInfo'>
            <h3 className='titleFontFamily'>Create Encounter</h3>
            <div className='dmViewButtonContainer'>
                <DropdownMenu savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures} clickEncounterDropdownMenuX={clickEncounterDropdownMenuX}/>
                <button className='dmViewButton' onClick={handleSaveEncounter} disabled={isSaveDisabled} style={{backgroundColor: saveMessageColor}}>  {showSaveMessage ? <>Encounter Saved!</> : <>Save Encounter</>} </button>
                <button className='dmViewButton' onClick={handleNewEncounter} >  New Encounter </button>
            </div>
        </div>
    );
}

export default EncounterListTopInfo;
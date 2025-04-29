import React, {useState} from 'react';
import EncounterListTopInfo from './EncounterListTopInfo.js'
import EncounterControls from './EncounterControls.js'

const EncounterColumnTop = ({savedEncounters, refreshLoading, setNameChange, handleLoadEncounter, setPlayerViewBackground, handleTurnNums, setSavedEncounters, handleNewEncounter, handleRefresh, refreshCheck, autoRefresh, handleAutoRollInitiative, socket}) => {
    const [streamingEncounter, setStreamingEncounter] = useState({encounterName: null, encounterGuid: null})

    return (
        <>
            <EncounterListTopInfo streamingEncounter={streamingEncounter} setStreamingEncounter={setStreamingEncounter} savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} setSavedEncounters={setSavedEncounters} handleNewEncounter={handleNewEncounter} socket={socket}/>
            <EncounterControls streamingEncounter={streamingEncounter} setStreamingEncounter={setStreamingEncounter} setNameChange={setNameChange} refreshLoading={refreshLoading} setPlayerViewBackground={setPlayerViewBackground} handleTurnNums={handleTurnNums} handleRefresh={handleRefresh} refreshCheck={refreshCheck} autoRefresh={autoRefresh} handleAutoRollInitiative={handleAutoRollInitiative} socket={socket}/>
        </>
  );
}

export default EncounterColumnTop;
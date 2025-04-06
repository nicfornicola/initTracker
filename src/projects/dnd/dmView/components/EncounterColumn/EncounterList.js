import React, { useState, useEffect } from 'react';
import EncounterListItem from './EncounterListItem'

const EncounterList = ({currentEncounter, setCurrentEncounter, handleSaveEncounter, turnNum, handleUploadMonsterImage, selectedIndex, setSelectedIndex, handleRemoveFromSelectedIndex, clickEncounterCreatureX, resort, socket}) => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState(currentEncounter.creatures);

    useEffect(() => {
        setCurrentEncounterCreatures([...currentEncounter.creatures])
    }, [currentEncounter.creatures])

    useEffect(() => {
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [currentEncounterCreatures])

    const setPlayerViewOnCreatureChange = () => {
        handleSaveEncounter()
    }

    return (
        <div className='encounterCreaturesList'>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.creatureGuid + index} creatureListItem={creatureListItem} setCurrentEncounter={setCurrentEncounter} index={index} isTurn={index+1 === turnNum} handleUploadMonsterImage={handleUploadMonsterImage} resort={resort} setPlayerViewOnCreatureChange={setPlayerViewOnCreatureChange} selectedIndex={selectedIndex} handleRemoveFromSelectedIndex={handleRemoveFromSelectedIndex} clickEncounterCreatureX={clickEncounterCreatureX} socket={socket}/>
            ))}
        </div>
    );
}

export default EncounterList;
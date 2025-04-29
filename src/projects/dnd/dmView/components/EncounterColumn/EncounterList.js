import React, { useState, useEffect } from 'react';
import EncounterListItem from './EncounterListItem'
import { useEncounter } from '../../../../../providers/EncounterProvider';

const EncounterList = ({handleSaveEncounter, turnNum, handleUploadMonsterImage, selectedIndex, handleRemoveFromSelectedIndex, clickEncounterCreatureX, resort, socket}) => {
    const {currentEncounter} = useEncounter();

    useEffect(() => {
        handleSaveEncounter()
        // eslint-disable-next-line
    }, [currentEncounter])

    return (
        <div className='encounterCreaturesList'>
            {currentEncounter.creatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.creatureGuid + index} creatureListItem={creatureListItem} index={index} isTurn={index+1 === turnNum} handleUploadMonsterImage={handleUploadMonsterImage} resort={resort} selectedIndex={selectedIndex} handleRemoveFromSelectedIndex={handleRemoveFromSelectedIndex} clickEncounterCreatureX={clickEncounterCreatureX} socket={socket}/>
            ))}
        </div>
    );
}

export default EncounterList;
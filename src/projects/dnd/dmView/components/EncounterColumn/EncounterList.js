import React, { useState, useEffect } from 'react';
import EncounterListItem from './EncounterListItem'
import {sortCreatureArray} from '../../constants'

const EncounterList = ({currentEncounter, setCurrentEncounter, handleSaveEncounter, turnNum, handleUploadMonsterImage, setSelectedIndex, clickEncounterCreatureX, socket}) => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState(currentEncounter.creatures);

    useEffect(() => {
        setCurrentEncounterCreatures([...currentEncounter.creatures])
    }, [currentEncounter.creatures])

    const resort = (c) => {
        const updatedCreatures = currentEncounterCreatures.map(creature =>
            creature.creatureGuid === c.creatureGuid ? c : creature
        );
        setCurrentEncounter(prev => ({...prev, creatures: [...sortCreatureArray(updatedCreatures)]}));
    }

    const setPlayerViewOnCreatureChange = () => {
        handleSaveEncounter()
    }

    useEffect(() => {
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [currentEncounterCreatures])

    return (
        <div className='encounterCreaturesList'>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.creatureGuid + index} creatureListItem={creatureListItem} setCurrentEncounter={setCurrentEncounter} index={index} isTurn={index+1 === turnNum} handleUploadMonsterImage={handleUploadMonsterImage} resort={resort} setPlayerViewOnCreatureChange={setPlayerViewOnCreatureChange} setSelectedIndex={setSelectedIndex} clickEncounterCreatureX={clickEncounterCreatureX} socket={socket}/>
            ))}
        </div>
    );
}

export default EncounterList;
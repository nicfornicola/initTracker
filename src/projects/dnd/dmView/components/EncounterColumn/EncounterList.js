import React, { useState, useEffect } from 'react';
import EncounterListItem from './EncounterListItem'
import {sortCreatureArray} from '../../constants'

function findCreatureIndexes(currentEncounterCreatures, reassignSelected) {
    return reassignSelected.map(guid =>
        currentEncounterCreatures.findIndex(c => c.creatureGuid === guid)
    ).filter(index => index !== -1); // Filter out any not found
}

const EncounterList = ({currentEncounter, setCurrentEncounter, handleSaveEncounter, turnNum, handleUploadMonsterImage, selectedIndex, setSelectedIndex, handleRemoveFromSelectedIndex, clickEncounterCreatureX, socket}) => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState(currentEncounter.creatures);

    useEffect(() => {
        setCurrentEncounterCreatures([...currentEncounter.creatures])
    }, [currentEncounter.creatures])

    useEffect(() => {
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [currentEncounterCreatures])

    const resort = (c) => {

        let reassignSelected = []
        if(selectedIndex.length !== 0) {
            selectedIndex.forEach(indexObj => {
                reassignSelected.push(currentEncounter.creatures[indexObj.index].creatureGuid)
            });
        }
        console.log("reassignSelected", reassignSelected)

        const updatedCreatures = currentEncounterCreatures.map(creature =>
            creature.creatureGuid === c.creatureGuid ? c : creature
        );

        const sortedCreatures = sortCreatureArray(updatedCreatures)
        setCurrentEncounter(prev => ({...prev, creatures: [...sortedCreatures]}));
        
        // This handles open statblocks while the index of creatures change
        const postSortedIndices = findCreatureIndexes(sortedCreatures, reassignSelected);
        console.log("postSortedIndices", postSortedIndices)

        setSelectedIndex((prev) => {
            prev.forEach((indexObj, i) => {
                indexObj.index = postSortedIndices[i]
            })
            return prev
        })


    
    }

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
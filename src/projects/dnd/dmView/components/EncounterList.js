import React from 'react';
import EncounterListItem from './EncounterListItem'

const EncounterList = ({handleSaveEncounter, handleUploadMonsterImage, setCurrentEncounterCreatures, currentEncounterCreatures, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX}) => {

    const resort = () => {
        currentEncounterCreatures.sort((a, b) =>  b.open5e.initiative - a.open5e.initiative);
        setCurrentEncounterCreatures([...currentEncounterCreatures]);
        setPlayerViewOnCreatureChange()
    }

    const setPlayerViewOnCreatureChange = () => {
        handleSaveEncounter()
    }

    return (
        <ul className='encounterCreaturesList'>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.guid + index} index={index} handleUploadMonsterImage={handleUploadMonsterImage} resort={resort} setPlayerViewOnCreatureChange={setPlayerViewOnCreatureChange} creatureListItem={creatureListItem} encounterSelectedCreature={encounterSelectedCreature} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX}/>
            ))}
        </ul>
  );
}

export default EncounterList;
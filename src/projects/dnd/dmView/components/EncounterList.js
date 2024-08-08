import React from 'react';
import EncounterListItem from './EncounterListItem'

const EncounterList = ({setCurrentEncounterCreatures, currentEncounterCreatures, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX}) => {

    const resort = () => {
        currentEncounterCreatures.sort((a, b) =>  b.open5e.initiative - a.open5e.initiative);
        setCurrentEncounterCreatures([...currentEncounterCreatures]);
    }

    return (
        <ul className='encounterCreaturesList'>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.guid + index} index={index} resort={resort} creatureListItem={creatureListItem} encounterSelectedCreature={encounterSelectedCreature} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX}/>
            ))}
        </ul>
  );
}

export default EncounterList;
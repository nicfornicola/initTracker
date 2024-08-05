import React from 'react';
import EncounterListItem from './EncounterListItem'

const EncounterList = ({currentEncounterCreatures, setEncounterSelectedCreature, clickEncounterCreatureX}) => {

    return (
        <ul className='encounterCreaturesList'>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.guid + index} index={index} creatureListItem={creatureListItem} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX} />
            ))}
        </ul>
  );
}

export default EncounterList;
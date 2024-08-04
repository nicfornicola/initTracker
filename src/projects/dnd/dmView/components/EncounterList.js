import React from 'react';


const EncounterList = ({currentEncounterCreatures, setEncounterSelectedCreature, clickEncounterCreatureX}) => {
    return (
        <ul className='encounterCreaturesList'>
            {currentEncounterCreatures.map((creature, index) => (
                <li className='encounterCreaturesListItem animated-box'
                    key={creature.guid + index} // Add index so it forces a re render
                    onClick={() => setEncounterSelectedCreature(creature)}
                >
                    <img className="monsterSearchIcon" src={creature.avatarUrl} alt={"list Icon"} />
                    <span>{creature.name}</span>
                    {creature.open5e.hit_points !== null  ? 
                        <>
                            <div className='encounterCreaturesHp'>
                                {creature.open5e.hit_points}
                                <span>/</span>
                                {creature.open5e.hit_points}
                            </div>
                            <span>{creature.open5e.armor_class}</span>
                        </>
                    :
                        <div className='encounterCreaturesHp'/>
                    }
                    <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                    X
                    </button>
                </li>
            ))}
        </ul>
  );
}

export default EncounterList;
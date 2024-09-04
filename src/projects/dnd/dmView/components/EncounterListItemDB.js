import React, {useState, useEffect} from 'react';
import uploadImage from '../pics/uploadImage.png'


const EncounterListItem = ({index, handleUploadMonsterImage, creatureListItem, isTurn, setCurrentEncounterCreatures, clickEncounterCreatureX, resort}) => {
    const [creature, setCreature] = useState(creatureListItem)
    const [currentHP, setCurrentHP] = useState(creatureListItem.dnd_b.hit_points_current)

    useEffect(() => {
        // If creature change then update it in the list to cause a rerender
        setCurrentEncounterCreatures((prevCreatures) => 
            prevCreatures.map((oldCreature) => 
                oldCreature.guid === creature.guid ? creature : oldCreature
            )
        );

        // eslint-disable-next-line
    }, [creature]);
    
    useEffect(() => {
        setCurrentHP(creatureListItem.dnd_b.hit_points_current)
    }, [creatureListItem.dnd_b.hit_points_current])

    const handleInitiativeChange = (event) => {
        if(event.target.value === "-") {
            creature.dnd_b.initiative = "-"
            setCreature({...creature})
        } else {
            let init = parseInt(event.target.value)
            if(creature.dnd_b.initiative !== init) {
                creature.dnd_b.initiative = isNaN(init) ? "" : init       
                setCreature({...creature})
            }
        }
    }
    
    const handleInitiativeCheck = (event) => {
        let init = parseInt(event.target.value)
        if(isNaN(init)) {
            creature.dnd_b.initiative = 0
            setCreature({...creature})
        }
        resort()
    }

    const handleHighlight = (e) => {
        e.target.select();
    };

    return (
            <li className='listItem' style={{border: isTurn ? '5px solid rgba(11, 204, 255)' : ''}}>   
                <div className='encounterCreatureContainer animated-box'>
                    <div className='initiativeInputContainer'>
                        <input className='inputButton' onFocus={handleHighlight} onBlur={handleInitiativeCheck} type='text' value={creature.dnd_b.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                    </div>
                    <div className="monsterEncounterIconContainer" onClick={() => handleUploadMonsterImage(creature)}>
                        <img className="monsterEncounterIcon" src={creature.avatarUrl} alt={"list Icon"} />
                        <div className='uploadIconContainer'>
                            <img className="uploadIcon" src={uploadImage} alt={"list Icon"} />
                        </div>
                    </div>
                    
                    <div className='listItemMiddleStats'>
                        <div className='nameInputContainer'>
                            <input disabled className='nameInput' type='text' defaultValue={creature.dnd_b.name} onClick={(event) => event.stopPropagation()}/>
                        </div>
                        <div className='armorClassContainer'>
                            <div>
                                <label htmlFor='ac'>AC</label>
                                <input disabled={true} id='ac' className='middleStatsInput' type='text' defaultValue={'+0'} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            <div>
                                <label htmlFor='init'>Init Bonus</label>
                                <input disabled={true} id='init'className='middleStatsInput' type='text' defaultValue={'+0'} onClick={(event) => event.stopPropagation()}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                            X
                        </button>
                    </div>
                    {creature.dnd_b.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            <button disabled className='encounterCreaturesHp' >
                                {currentHP}
                                <span>/</span>
                                {creature.dnd_b.hit_points}
                                {creature.dnd_b.hit_points_temp !== 0 && (
                                    <span className='tempHp'> (+{creature.dnd_b.hit_points_temp}) </span>
                                )}
                            </button>
                        </div>
                    :
                        <div className='encounterCreaturesHp'/>
                    }
                </div>
            </li>
           
  );
}

export default EncounterListItem;
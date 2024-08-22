import React, {useState} from 'react';
import uploadImage from '../pics/uploadImage.png'


const EncounterListItem = ({index, handleUploadMonsterImage, creatureListItem, setEncounterSelectedCreature, clickEncounterCreatureX, resort}) => {
    const [creature, setCreature] = useState(creatureListItem)


    const handleInitiativeChange = (event) => {
        let init = parseInt(event.target.value)
        if(creature.dnd_b.initiative !== init) {
            creature.dnd_b.initiative = isNaN(init) ? '0' : init
            setCreature({...creature})
            resort()
        }      
    }

    const handleHighlight = (e) => {
        e.target.select();
    };

    return (
            <li className='listItem'>   
                <div className='encounterCreatureContainer animated-box'>
                    <div className='initiativeInputContainer'>
                        <input className='inputButton' onFocus={handleHighlight} type='text' value={creature.dnd_b.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
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

                    {creature.dnd_b.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            <button disabled className='encounterCreaturesHp' >
                                {creature.dnd_b.hit_points_current}
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
                    <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                        X
                    </button>
                </div>
            </li>
           
  );
}

export default EncounterListItem;
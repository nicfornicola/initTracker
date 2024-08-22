import React, {useEffect, useState, useRef} from 'react';
import uploadImage from '../pics/uploadImage.png'


const EncounterListItem = ({index, listSizeRect, scrollPosition, handleUploadMonsterImage, setPlayerViewOnCreatureChange, creatureListItem, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX, resort}) => {
    const [openEditWidget, setOpenEditWidget] = useState(false);
    const [hpChange, setHpChange] = useState(0);
    const [creature, setCreature] = useState(creatureListItem)
    const [isInside, setIsInside] = useState(true)
    const [widgetPosition, setWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})
    const buttonRef = useRef(null)

    useEffect(() => {
        if(encounterSelectedCreature !== null && creature.guid === encounterSelectedCreature.guid)
            setEncounterSelectedCreature(creature)
        
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [creature]);


    useEffect(() => {
       if(openEditWidget && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setWidgetPosition(rect)
            setIsInside(listSizeRect.top < rect.bottom - rect.height/2 && listSizeRect.bottom > rect.top + rect.height/2)

       }
    }, [openEditWidget, scrollPosition, listSizeRect]);

    const openEditCreatureStats = (event) => {
        event.stopPropagation()
        setOpenEditWidget(!openEditWidget)
    }

    const handleChangeHpCreature = (type) => {
        let hpNum = hpChange;
        if(type === 'damage') {

            if(creature.open5e.hit_points_temp > 0) {
                let tempHpRemainder = creature.open5e.hit_points_temp - hpChange
                if(tempHpRemainder <= 0) {
                    hpNum = Math.abs(tempHpRemainder)
                    creature.open5e.hit_points_temp = 0
                } else {
                    hpNum = 0
                    creature.open5e.hit_points_temp = tempHpRemainder
                }

            }

            hpNum *= -1                
        }
        creature.open5e.hit_points_current = creature.open5e.hit_points_current + hpNum

        if(creature.open5e.hit_points_current > creature.open5e.hit_points)
            creature.open5e.hit_points_current = creature.open5e.hit_points

        setOpenEditWidget(!openEditWidget)
        setCreature({...creature})
    }

    const handleOverrideHp = (event) => {
        let override = parseInt(event.target.value) || 0
        
        // Set override in creature
        creature.open5e.hit_points_override = override
        // Find old diff between current and max
        let dif = creature.open5e.hit_points - creature.open5e.hit_points_current
        creature.open5e.hit_points = override === 0 ? creature.open5e.hit_points_default : override
        creature.open5e.hit_points_current = creature.open5e.hit_points - dif
        
        setCreature({...creature})

    }

    const handleChangeName = (event) => {
        let newName = event.target.value
        if(creature.open5e.name !== newName) {
            creature.open5e.name = event.target.value
            setCreature({...creature})
        }
         
    }

    const handleTempHp = (event) => {
        let tempHp = parseInt(event.target.value)
        creature.open5e.hit_points_temp = isNaN(tempHp) ? 0 : tempHp
        setCreature({...creature})
    }

    const handleInitiativeChange = (event) => {
        let init = parseInt(event.target.value)
        if(creature.open5e.initiative !== init) {
            creature.open5e.initiative = isNaN(init) ? '0' : init
            setCreature({...creature})
            resort()
        }
            
    }

    const handleArmorClassChange = (event) => {
        let ac = parseInt(event.target.value)
        creature.open5e.armor_class = isNaN(ac) ? '0' : ac
        setCreature({...creature})
    }

    const handleHighlight = (e) => {
        e.target.select();
    };

    return (
            <li className='listItem'
                onClick={() => setEncounterSelectedCreature(creature)}
            >   
                <div className='encounterCreatureContainer animated-box'>
                    <div className='initiativeInputContainer'>
                        <input className='inputButton' onFocus={handleHighlight} type='text' value={creature.open5e.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                    </div>
                    <div className="monsterEncounterIconContainer" onClick={() => handleUploadMonsterImage(creature)}>
                        <img className="monsterEncounterIcon" src={creature.avatarUrl} alt={"list Icon"} />
                        <div className='uploadIconContainer'>
                            <img className="uploadIcon" src={uploadImage} alt={"list Icon"} />
                        </div>
                    </div>

                    
                    <div className='listItemMiddleStats'>
                        <div className='nameInputContainer'>
                            <input className='nameInput' type='text' defaultValue={creature.open5e.name} onBlur={handleChangeName} onClick={(event) => event.stopPropagation()}/>
                        </div>
                        <div className='armorClassContainer'>
                            <div>
                                <label htmlFor='ac'>AC</label>
                                <input id='ac' className='middleStatsInput' onFocus={handleHighlight} type='text' defaultValue={creature.open5e.armor_class} onChange={handleArmorClassChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            <div>
                                <label htmlFor='init'>Init Bonus</label>
                                <input id='init'className='middleStatsInput' onFocus={handleHighlight} disabled={true}  type='text' defaultValue={creature.open5e.dexterity_save ? '+' + creature.open5e.dexterity_save : '+0'} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                        </div>
                    </div>

                    {creature.open5e.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            <button className='encounterCreaturesHp' onClick={(event) => openEditCreatureStats(event)}  ref={buttonRef}>
                                {creature.open5e.hit_points_current}
                                <span>/</span>
                                {creature.open5e.hit_points}
                                {creature.open5e.hit_points_temp !== 0 && (
                                    <span className='tempHp'> (+{creature.open5e.hit_points_temp}) </span>
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
                {openEditWidget && isInside && ( 
                    <div className='editStatsContainer editHpGrow' onClick={(event) => event.stopPropagation()} style={{ top: widgetPosition.top - 10, left: widgetPosition.right + 20, height: widgetPosition.height*4}}>
                        <div className="infoContainerFlag"/>
                        <div className='hpChanges'>
                            <div className='editHpContainer'>
                                <button className='editHpButton healButton' onClick={() => handleChangeHpCreature("heal")}>HEAL</button>
                                <input className='editStatsInput' type='number' value={hpChange} onFocus={handleHighlight} onChange={(event) => setHpChange(parseInt(event.target.value))} autoFocus/>
                                <button className='editHpButton damageButton' onClick={() => handleChangeHpCreature("damage")}>DAMAGE</button>
                            </div>
                            <div className='extraHpContainer'>
                                <div className='extraHpInputs' >
                                    <label className='hpTitle tempHp' style={{color: creature.open5e.hit_points_temp === 0 ? 'grey' : ''}} htmlFor='temphp'><strong>Temp HP</strong></label>
                                    <input id='temphp' type='number' className='editStatsInputExtra tempHp' value={creature.open5e.hit_points_temp} style={{color: creature.open5e.hit_points_temp === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleTempHp}/>
                                </div>
                                <div className='extraHpInputs'>
                                    <label className='hpTitle' htmlFor='override' style={{color: creature.open5e.hit_points_override === 0 ? 'grey' : ''}}><strong>Override HP</strong></label>
                                    <input id='override' type='number' className='editStatsInputExtra' value={creature.open5e.hit_points_override} style={{color: creature.open5e.hit_points_override === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleOverrideHp}/>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </li>
           
  );
}

export default EncounterListItem;
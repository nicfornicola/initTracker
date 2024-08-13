import React, {useEffect, useState, useRef} from 'react';
import uploadImage from '../pics/uploadImage.png'


const EncounterListItem = ({index, listSizeRect, scrollPosition, handleUploadMonsterImage, setPlayerViewOnCreatureChange, creatureListItem, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX, resort}) => {
    const [openEditWidget, setOpenEditWidget] = useState(false);
    const [hpChange, setHpChange] = useState(0);
    const [tempHp, setTempHp] = useState(creatureListItem.open5e.hit_points_temp);
    const [overrideHp, setOverrideHp] = useState(creatureListItem.open5e.hit_points_override || 0);
    const [creature, setCreature] = useState(creatureListItem)
    const [isInside, setIsInside] = useState(true)
    const [widgetPosition, setWidgetPosition] = useState({})
    const buttonRef = useRef(null)

    useEffect(() => {
        if(encounterSelectedCreature !== null && creature.guid === encounterSelectedCreature.guid)
            setEncounterSelectedCreature(creature)
        
        console.log("reload")
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [creature]);


    useEffect(() => {
        console.log(openEditWidget, buttonRef.current)
       if(openEditWidget && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setWidgetPosition(rect)
            setIsInside(listSizeRect.top < rect.bottom - rect.height/2 && listSizeRect.bottom > rect.top + rect.height/2)

       }
    }, [openEditWidget, scrollPosition, listSizeRect]);

    console.log(widgetPosition)
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

                setTempHp(creature.open5e.hit_points_temp)
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
        let override = parseInt(event.target.value)
        // Set override in creature
        creature.open5e.hit_points_override = override
        // Find old diff between current and max
        let dif = creature.open5e.hit_points - creature.open5e.hit_points_current

        if(override === 0 || isNaN(override)) {
            creature.open5e.hit_points = creature.open5e.hit_points_default
        } else {
            // Change max to override, make current the same dif
            creature.open5e.hit_points = override
        }

        creature.open5e.hit_points_current = creature.open5e.hit_points - dif
        setOverrideHp(override)
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
        setTempHp(creature.open5e.hit_points_temp)
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

    const handleHightlight = (e) => {
        e.target.select();
    };

    return (
            <li className='listItem'
                onClick={() => setEncounterSelectedCreature(creature)}
            >   
                <div className='encounterCreatureContainer animated-box'>
                    <div className='initiativeInputContainer'>
                        <input className='inputButton' onFocus={handleHightlight} type='text' value={creature.open5e.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
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
                                <input id='ac' className='middleStatsInput' onFocus={handleHightlight} type='text' defaultValue={creature.open5e.armor_class} onChange={handleArmorClassChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            <div>
                                <label htmlFor='init'>Init Bonus</label>
                                <input id='init'className='middleStatsInput' onFocus={handleHightlight} disabled={true}  type='text' defaultValue={creature.open5e.dexterity_save ? '+' + creature.open5e.dexterity_save : '+0'} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                        </div>
                    </div>

                    {creature.open5e.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            <button className='encounterCreaturesHp' onClick={(event) => openEditCreatureStats(event)}  ref={buttonRef}>
                                {creature.open5e.hit_points_current}
                                <span>/</span>
                                {creature.open5e.hit_points}
                                {tempHp !== 0 && (
                                    <span className='tempHp'> (+{tempHp}) </span>
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
                    <div className='editStatsContainer editHpGrow' style={{ top: widgetPosition.top - 10, left: widgetPosition.right + 20, height: widgetPosition.height+20}}>
                        <div className="infoContainerFlag"/>
                        <div className='hpChanges'>
                            <div className='editHpContainer'>
                                <button className='editHpButton healButton' onClick={() => handleChangeHpCreature("heal")}>HEAL</button>
                                <input className='editStatsInput' type='text' placeholder={"0"} onChange={(event) => setHpChange(parseInt(event.target.value))}  autoFocus/>
                                <button className='editHpButton damageButton' onClick={() => handleChangeHpCreature("damage")}>DAMAGE</button>
                            </div>
                            <div className='extraHpContainer'>
                                <div className='extraHpInputs'>
                                    <label className='hpTitle' htmlFor='temphp'>Temp.</label>
                                    <input id='temphp' type='text' className='editStatsInput' value={tempHp || 0} onChange={handleTempHp}/>
                                </div>
                                <div className='extraHpInputs'>
                                    <label className='hpTitle' htmlFor='override'>Override</label>
                                    <input id='override' type='text' className='editStatsInput' defaultValue={overrideHp || 0} onChange={handleOverrideHp}/>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </li>
           
  );
}

export default EncounterListItem;
import React, {useEffect, useState} from 'react';


const EncounterListItem = ({index, setPlayerViewOnCreatureChange, creatureListItem, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX, resort}) => {
    const [openEditWidget, setOpenEditWidget] = useState(false);
    const [hpChange, setHpChange] = useState(0);
    const [tempHp, setTempHp] = useState(creatureListItem.open5e.hit_points_temp);
    const [overrideHp, setOverrideHp] = useState(creatureListItem.open5e.hit_points_override || 0);
    const [creature, setCreature] = useState(creatureListItem)
    
    useEffect(() => {
        if(encounterSelectedCreature !== null && creature.guid === encounterSelectedCreature.guid)
            setEncounterSelectedCreature(creature)
        
        console.log("reload")
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [creature]);

    const openEditCreatureStats = (event) => {
        event.stopPropagation(); 
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
        creature.open5e.name = event.target.value
        setCreature({...creature})
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
        <>
            <li className='listItem animated-box'
                onClick={() => setEncounterSelectedCreature(creature)}
            >   
                <div className='encounterCreatureContainer'>
                    <div className='initiativeInputContainer'>
                        <input className='inputButton' onFocus={handleHightlight} type='text' value={creature.open5e.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                    </div>
                    <div className="monsterEncounterIconContainer">
                        <img className="monsterEncounterIcon" src={creature.avatarUrl} alt={"list Icon"} />
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
                            <button className='encounterCreaturesHp' onClick={(event) => openEditCreatureStats(event)}>
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
                </div>
                <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                    X
                </button>
            </li>
           
            {openEditWidget && ( 
                <div className='editStatsContainer shadowBox editHpGrow '>
                    <div className="infoContainerFlag"/>

                    <div className='overHpContainer'>
                        <label className='hpTitle' htmlFor='temphp'>Temp HP</label>
                        <input id='temphp' type='text' className='editStatsInput' value={tempHp || 0} onChange={handleTempHp}/>
                        <label className='hpTitle' htmlFor='override'>Override HP </label>
                        <input id='override' type='text' className='editStatsInput' defaultValue={overrideHp || 0} onChange={handleOverrideHp}/>
                    </div>

                    <div className='editHpContainer'>
                        <button className='editHpButton healButton' onClick={() => handleChangeHpCreature("heal")}>HEAL</button>
                        <input className='editStatsInput' type='text' placeholder={"0"} onChange={(event) => setHpChange(parseInt(event.target.value))} autoFocus/>
                        <button className='editHpButton damageButton' onClick={() => handleChangeHpCreature("damage")}>DAMAGE</button>
                    </div>
                </div>
            )}
        </>
  );
}

export default EncounterListItem;
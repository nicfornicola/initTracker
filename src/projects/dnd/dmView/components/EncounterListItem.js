import React, {useEffect, useState, useRef} from 'react';
import uploadImage from '../pics/uploadImage.png'
import eyeClosed from '../../playerView/pics/icons/eyeClosed.png'; 
import eyeOpen from '../../playerView/pics/icons/eyeOpen.png'; 
import OptionButton from '../../dmView/components/OptionButton';

const EncounterListItem = ({index, creatureListItem, listSizeRect, isTurn, setCurrentEncounter, scrollPosition, handleUploadMonsterImage, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX, resort}) => {
    const [openEditWidget, setOpenEditWidget] = useState(false);
    const [hpChange, setHpChange] = useState(0);
    const [hidden, setHidden] = useState(creatureListItem.hidden);
    const [creature, setCreature] = useState(creatureListItem)
    const [isInside, setIsInside] = useState(true)
    const [widgetPosition, setWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})
    const buttonRef = useRef(null)


    useEffect(() => {
        setCreature(creatureListItem)

        // eslint-disable-next-line
    }, [creatureListItem]);

    useEffect(() => {
        if(encounterSelectedCreature !== null && creature.guid === encounterSelectedCreature.guid)
            setEncounterSelectedCreature(creature)

        // If creature change then update it in the list to cause a rerender
        setCurrentEncounter(prev => ({
                ...prev,
                currentEncounterCreatures: [
                    ...prev.currentEncounterCreatures.map(
                        oldCreature => oldCreature.guid === creature.guid ? creature :oldCreature)
                ]
            })
        );

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

            if(creature.hit_points_temp > 0) {
                let tempHpRemainder = creature.hit_points_temp - hpChange
                if(tempHpRemainder <= 0) {
                    hpNum = Math.abs(tempHpRemainder)
                    creature.hit_points_temp = 0
                } else {
                    hpNum = 0
                    creature.hit_points_temp = tempHpRemainder
                }

            }

            hpNum *= -1                
        }
        creature.hit_points_current = creature.hit_points_current + hpNum

        if(creature.hit_points_current > creature.hit_points)
            creature.hit_points_current = creature.hit_points

        setOpenEditWidget(!openEditWidget)
        setCreature({...creature})
    }

    const handleOverrideHp = (event) => {
        let override = parseInt(event.target.value) || 0
        
        // Set override in creature
        creature.hit_points_override = override
        // Find old diff between current and max
        let dif = creature.hit_points - creature.hit_points_current
        creature.hit_points = override === 0 ? creature.hit_points_default : override
        creature.hit_points_current = creature.hit_points - dif
        
        setCreature({...creature})

    }

    const handleChangeName = (event) => {
        let newName = event.target.value
        if(creature.name !== newName) {
            creature.name = event.target.value
            setCreature({...creature})
        }
    }

    const handleTempHp = (event) => {
        let tempHp = parseInt(event.target.value)
        creature.hit_points_temp = isNaN(tempHp) ? 0 : tempHp
        setCreature({...creature})
    }

    const handleInitiativeChange = (event) => {
        if(event.target.value === "-") {
            creature.initiative = "-"
            setCreature({...creature})
        } else {
            let init = parseInt(event.target.value)
            if(creature.initiative !== init) {
                creature.initiative = isNaN(init) ? "" : init       
                setCreature({...creature})
            }
        }
    }
    
    const handleInitiativeCheck = (event) => {
        let init = parseInt(event.target.value)
        if(isNaN(init)) {
            creature.initiative = 0
            setCreature({...creature})
        }
        resort()
    }    
    
    const handleHideEnemy = (event) => {
        event.stopPropagation()
        setHidden(!hidden)
        setCreature({...creature, hidden: !hidden})
    }

    const handleArmorClassChange = (event) => {
        let ac = parseInt(event.target.value)
        creature.armor_class = isNaN(ac) ? '0' : ac
        setCreature({...creature})
    }

    const handleHighlight = (e) => {
        e.target.select();
    };

    let isDead = creature.hit_points_current <= 0
    let isBloodied = creature.hit_points_current/creature.hit_points < .55
    let color = ""
    if(isDead) {
        color = "red"
    } else if(isBloodied) {
        color = "orange"
    }
    
    let hpStyle = {color: color, borderColor: color}


    return (
            <li className='listItem'
                onClick={() => setEncounterSelectedCreature(creature)}
                style={{border: isTurn ? '5px solid rgba(11, 204, 255)' : ''}}
            >   
                <div className='encounterCreatureContainer animated-box'>
                    <div className='initiativeInputContainer'>
                        <input className='inputButton' onFocus={handleHighlight} onBlur={handleInitiativeCheck} type='text' value={creature.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                    </div>
                    <div className="monsterEncounterIconContainer" onClick={() => handleUploadMonsterImage(creature)}>
                        <img className="monsterEncounterIcon" src={creature.avatarUrl} alt={"list Icon"} />
                        <div className='uploadIconContainer'>
                            <img className="uploadIcon" src={uploadImage} alt={"list Icon"} />
                        </div>
                    </div>

                    
                    <div className='listItemMiddleStats'>
                        <div className='nameInputContainer'>
                            <input className='nameInput' type='text' defaultValue={creature.name} onBlur={handleChangeName} onClick={(event) => event.stopPropagation()}/>
                        </div>
                        <div className='armorClassContainer'>
                            <div>
                                <label htmlFor='ac'>AC</label>
                                <input id='ac' className='middleStatsInput' onFocus={handleHighlight} type='text' defaultValue={creature.armor_class} onChange={handleArmorClassChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            <div>
                                <label htmlFor='init'>Init Bonus</label>
                                <input id='init'className='middleStatsInput' onFocus={handleHighlight} disabled={true}  type='text' defaultValue={creature.dexterity_save ? '+' + creature.dexterity_save : '+0'} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                        </div>
                        
                    </div>

                    <OptionButton src={hidden ? eyeClosed : eyeOpen}  message={(hidden ? "Show" : "Hide")} onClickFunction={handleHideEnemy} />

                    <div>
                        <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                            X
                        </button>
                    </div>
                    
                   
                    {creature.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            
                            <button className='encounterCreaturesHp' style={hpStyle} onClick={(event) => openEditCreatureStats(event)}  ref={buttonRef}>
                                {creature.hit_points_current}
                                <span>/</span>
                                {creature.hit_points}
                                {creature.hit_points_temp !== 0 && (
                                    <span className='tempHp'> (+{creature.hit_points_temp}) </span>
                                )}
                            </button>
                        </div>
                    :
                        <div className='encounterCreaturesHp'/>
                    }
                    
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
                                    <label className='hpTitle tempHp' style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} htmlFor='temphp'><strong>Temp HP</strong></label>
                                    <input id='temphp' type='number' className='editStatsInputExtra tempHp' value={creature.hit_points_temp} style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleTempHp}/>
                                </div>
                                <div className='extraHpInputs'>
                                    <label className='hpTitle' htmlFor='override' style={{color: creature.hit_points_override === 0 ? 'grey' : ''}}><strong>Override HP</strong></label>
                                    <input id='override' type='number' className='editStatsInputExtra' value={creature.hit_points_override} style={{color: creature.hit_points_override === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleOverrideHp}/>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </li>
           
  );
}

export default EncounterListItem;
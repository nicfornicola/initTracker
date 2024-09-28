import React, {useEffect, useState, useRef} from 'react';
import uploadImage from '../../pics/uploadImage.png'
import eyeClosed from '../../pics/icons/eyeClosed.png'; 
import eyeOpen from '../../pics/icons/eyeOpen.png'; 
import OptionButton from '../EncounterColumn/OptionButton';
import TeamFlag from '../../pics/icons/team.png';
import FlagPole from './FlagPole';
import Compact from '@uiw/react-color-compact';

const EncounterListItem = ({index, creatureListItem, listSizeRect, isTurn, setCurrentEncounter, scrollPosition, handleUploadMonsterImage, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX, resort}) => {
    const [hidden, setHidden] = useState(creatureListItem.hidden);
    const [creature, setCreature] = useState(creatureListItem)

    const [hpChange, setHpChange] = useState(0);
    const [openHpWidget, setOpenHpWidget] = useState(false);
    const [isHpWidgetInside, setIsHpWidgetInside] = useState(true);
    const [hpWidgetPosition, setHpWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})

    const [openTeamWidget, setOpenTeamWidget] = useState(false);
    const [isTeamWidgetInside, setIsTeamWidgetInside] = useState(true)
    const [teamWidgetPosition, setTeamWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})
    const [teamColor, setTeamColor] = useState(creature.border)
    
    const hpButtonRef = useRef(null)
    const teamButtonRef = useRef(null)

    useEffect(() => {
        console.log("1")
        setCreature(creatureListItem)
        // eslint-disable-next-line
    }, [creatureListItem]);

    useEffect(() => {
        console.log("2")

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
        console.log("3")

        if(openHpWidget && hpButtonRef.current) {
            const rect = hpButtonRef.current.getBoundingClientRect();
            setHpWidgetPosition(rect)
            setIsHpWidgetInside(listSizeRect.top < rect.bottom - rect.height/2 && listSizeRect.bottom > rect.top + rect.height/2)
        }

        if(openTeamWidget && teamButtonRef.current) {
            const rect = teamButtonRef.current.getBoundingClientRect();
            setTeamWidgetPosition(rect)
            setIsTeamWidgetInside(listSizeRect.top < rect.bottom - rect.height/2 && listSizeRect.bottom > rect.top + rect.height/2)
        }

    }, [openHpWidget, openTeamWidget, scrollPosition, listSizeRect]);

    const openEditCreatureStats = (event) => {
        event.stopPropagation()
        setOpenHpWidget(!openHpWidget)
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

        setOpenHpWidget(!openHpWidget)
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
    
    const handleAlignmentChange = (team) => {
        console.log(team)
        creature.alignment = team;
        setCreature({...creature})
    };

    const handleTeamColorChange = (newTeamColor) => {
        if(teamColor.hex !== teamColor) {
            setTeamColor(newTeamColor.hex)
            creature.border = newTeamColor.hex;
            setCreature({...creature})
        }
        
    };

    const handleTeamChangeWidget = (event) => {
        console.log("team change")
        event.stopPropagation();
        setOpenTeamWidget(!openTeamWidget)
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

    console.log(teamColor)

    return (
            <li className='listItem'
                onClick={() => setEncounterSelectedCreature(creature)}
                style={{border: isTurn ? '4px solid rgba(11, 204, 255)' : '', borderRadius: 0}}
            >   
                <div className='encounterCreatureContainer animated-box'>
                    <div className='encounterCreatureLeftContainer'>
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
                            <div className='middleStatsContainer'>
                                    <label htmlFor='ac' className='middleStatsLabel'>AC</label>
                                    <input id='ac' className='middleStatsInput' onFocus={handleHighlight} type='text' defaultValue={creature.armor_class} onChange={handleArmorClassChange} onClick={(event) => event.stopPropagation()}/>
                                    <label htmlFor='init' className='middleStatsLabel'>Init Mod</label>
                                    <input id='init'className='middleStatsInput' onFocus={handleHighlight} disabled={true}  type='text' defaultValue={creature.dexterity_save ? '+' + creature.dexterity_save : '+0'} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            
                        </div>
                    </div>

                    <div>
                        <OptionButton src={hidden ? eyeClosed : eyeOpen}  message={(hidden ? "Show" : "Hide")} onClickFunction={handleHideEnemy} imgClassName={'option-no-margin'} />
                        <FlagPole flagColor={teamColor} handleTeamChangeWidget={handleTeamChangeWidget} ref={teamButtonRef} isWidgetOpen={openTeamWidget} />
                    </div>

                    <div>
                        <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                            X
                        </button>
                    </div>
                    
                   
                    {creature.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            
                            <button className='encounterCreaturesHp' style={hpStyle} onClick={(event) => openEditCreatureStats(event)}  ref={hpButtonRef}>
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
                {openTeamWidget && isTeamWidgetInside && ( 
                    <div className='editTeamContainer editHpGrow' onClick={(event) => event.stopPropagation()} style={{ top: teamWidgetPosition.top + teamWidgetPosition.height*1.5, left: teamWidgetPosition.left - teamWidgetPosition.width*6}}>
                        <div className="teamContainerFlag"/>
                        <Compact
                            color={teamColor}
                            onChange={handleTeamColorChange}
                        />
                        <div className='teamChoices'>
                            <button className="editTeamColorButton" style={{color: "green"}} onClick={() => handleAlignmentChange('ally')}> {creature.alignment === "ally" ? <strong>Ally</strong> : <small>Ally</small>} </button>
                            <button className="editTeamColorButton" style={{color: "black"}} onClick={() => handleAlignmentChange('neutral')}> {creature.alignment === "neutral" ? <strong>Neutral</strong> : <small>Neutral</small>} </button>
                            <button className="editTeamColorButton" style={{color: "red"}} onClick={() => handleAlignmentChange('enemy')}> {creature.alignment === "enemy" ? <strong>Enemy</strong> : <small>Enemy</small>} </button>
                        </div>
                    </div>
                )}
                {openHpWidget && isHpWidgetInside && ( 
                    <div className='editStatsContainer editHpGrow' onClick={(event) => event.stopPropagation()} style={{ top: hpWidgetPosition.top - 10, left: hpWidgetPosition.right + 20, height: hpWidgetPosition.height*4}}>
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
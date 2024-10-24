import React, {useEffect, useState, useRef} from 'react';
import uploadImage from '../../pics/uploadImage.png'
import eyeClosed from '../../pics/icons/eyeClosed.png'; 
import eyeOpen from '../../pics/icons/eyeOpen.png'; 
import OptionButton from '../EncounterColumn/OptionButton';
import isPlayerImg from '../../pics/icons/isPlayerImg.png';
import FlagPole from './FlagPole';
import EffectImg from '../../pics/icons/effectImg.png';
import Compact from '@uiw/react-color-compact';
import { effectObjs } from '../../constants.js';
import Effect from './Effect.js';

const EncounterListItem = ({index, creatureListItem, listSizeRect, isTurn, setCurrentEncounter, scrollPosition, handleUploadMonsterImage, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX, resort, socket}) => {
    const [hidden, setHidden] = useState(creatureListItem.hidden);
    const [creature, setCreature] = useState(creatureListItem)
    const [isHovered, setIsHovered] = useState(false);

    const [hpChange, setHpChange] = useState(0);
    const [openHpWidget, setOpenHpWidget] = useState(false);
    const [isHpWidgetInside, setIsHpWidgetInside] = useState(true);
    const [hpWidgetPosition, setHpWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})

    const [openTeamWidget, setOpenTeamWidget] = useState(false);
    const [isTeamWidgetInside, setIsTeamWidgetInside] = useState(true)
    const [teamWidgetPosition, setTeamWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})

    const [openEffectWidget, setOpenEffectWidget] = useState(false);
    const [isEffectWidgetInside, setIsEffectWidgetInside] = useState(true)
    const [effectWidgetPosition, setEffectWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})

    const [isPlayer, setIsPlayer] = useState(creature.type === "player");
    const [alignment, setAlignment] = useState(creature.alignment);
    const [borderColor, setBorderColor] = useState(creature.border);
    const [effects, setEffects] = useState(creature.effects);

    // Handler to toggle the checkbox state

    const hpButtonRef = useRef(null)
    const hpWidgetRef = useRef(null);

    const teamWidgetRef = useRef(null);
    const teamButtonRef = useRef(null);

    const effectWidgetRef = useRef(null);
    const effectButtonRef = useRef(null);

    // Close the widgets if clicked outside
    const handleClickOutside = (event) => {
        if (hpWidgetRef.current && !hpWidgetRef.current.contains(event.target) &&
            hpButtonRef.current && !hpButtonRef.current.contains(event.target)) {
                setTimeout(() => { // set timeout to give onBlur to trigger
                    setOpenHpWidget(false); 
                }, 0);
        }
        
        if (teamWidgetRef.current && !teamWidgetRef.current.contains(event.target) &&
            teamButtonRef.current && !teamButtonRef.current.contains(event.target)) {
                setOpenTeamWidget(false); 
        }

        if (effectWidgetRef.current && !effectWidgetRef.current.contains(event.target) &&
            effectButtonRef.current && !effectButtonRef.current.contains(event.target)) {
                setOpenEffectWidget(false); 
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        setCreature(creatureListItem)
        // eslint-disable-next-line
    }, [creatureListItem]);

    useEffect(() => {
        if(encounterSelectedCreature !== null && creature.creatureGuid === encounterSelectedCreature.creatureGuid)
            setEncounterSelectedCreature(creature)

        // If creature change then update it in the list to cause a rerender
        setCurrentEncounter(prev => ({
                ...prev,
                currentEncounterCreatures: [
                    ...prev.currentEncounterCreatures.map(
                        (oldCreature) => {
                            return oldCreature.creatureGuid === creature.creatureGuid ? creature : oldCreature;
                        }
                    )
                ]
            })
        );

        // eslint-disable-next-line
    }, [creature]);

    useEffect(() => {
        if(openHpWidget && hpButtonRef.current) {
            const rect = hpButtonRef.current.getBoundingClientRect();
            setHpWidgetPosition(rect)
            setIsHpWidgetInside(listSizeRect.top-30 < rect.top && listSizeRect.bottom+20 > rect.bottom)
        }

        if(openTeamWidget && teamButtonRef.current) {
            const rect = teamButtonRef.current.getBoundingClientRect();
            setTeamWidgetPosition(rect)
            const isInsideVertically = rect.top >= listSizeRect.top-30 && rect.bottom <= listSizeRect.bottom-30;
            setIsTeamWidgetInside(isInsideVertically)
        }

        if(openEffectWidget && effectButtonRef.current) {
            const rect = effectButtonRef.current.getBoundingClientRect();
            setEffectWidgetPosition(rect)
            const isInsideVertically = rect.top >= listSizeRect.top-30 && rect.bottom <= listSizeRect.bottom-30;
            setIsEffectWidgetInside(isInsideVertically)
        }

    }, [openHpWidget, openTeamWidget, openEffectWidget, scrollPosition, listSizeRect]);

    useEffect(() => {
        // Specifically check for these changes because they change how the playerview behaves
        setCreature({
                    ...creature, 
                    alignment: alignment,
                    type: isPlayer ? 'player' : 'monster',
                    border: borderColor,
                    hidden: hidden,
                    effects: [...effects]
        })
    // eslint-disable-next-line
    }, [alignment, isPlayer, borderColor, hidden, effects]);

    const openEditHpWidget = (event) => {
        event.stopPropagation()
        setOpenHpWidget(!openHpWidget)
    }

    const handleChangeHpCreature = (type, event) => {
        event.stopPropagation()
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

        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {hit_points_current: creature.hit_points_current, hit_points_temp: creature.hit_points_temp}, creature.creatureGuid, "dm");

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

    const submitOverRideHpChange = () => {
        console.log('submitOverRideHpChange', creature.hit_points, creature.hit_points_current, creature.hit_points_override)
        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {
            hit_points: creature.hit_points,
            hit_points_current: creature.hit_points_current,
            hit_points_override: creature.hit_points_override,
        }, creature.creatureGuid, "dm");

    }

    const handleChangeName = (event) => {
        let newName = event.target.value
        if(creature.name !== newName) {
            creature.name = event.target.value
            setCreature({...creature})
            socket.emit("creatureNameChange", newName, creature.creatureGuid, "dm")
        }
    }

    const handleTempHp = (event) => {
        let tempHp = parseInt(event.target.value)
        creature.hit_points_temp = isNaN(tempHp) ? 0 : tempHp
        setCreature({...creature})
    }

    // on blur is not wokring
    const submitTempHpChange = () => {
            console.log('submitOverRideHpChange', creature.hit_points_temp)
            //hit_points | hit_points_current | hit_points_temp | hit_points_override
            socket.emit('playerHpChange', {hit_points_temp: creature.hit_points_temp}, creature.creatureGuid, "dm");
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
        socket.emit('creatureInitiativeChange', creature.initiative, creature.creatureGuid, "dm");
        resort()
    }    
    
    const handleHideEnemy = (event) => {
        event.stopPropagation()
        socket.emit('creatureHiddenToggle', !hidden, creature.creatureGuid, "dm");
        setHidden(!hidden)

    }  
    
    const handleAlignmentChange = (team) => {
        if(team !== alignment) {
            setAlignment(team);
            socket.emit('creatureAlignmentChange', team, creature.creatureGuid, "dm");
        }
    };

    const handleTeamColorChange = (newBorderColor) => {
        if(newBorderColor.hex !== borderColor) {
            setBorderColor(newBorderColor.hex)
            // I dont think this is in the database
            socket.emit('creatureBorderColorChange', newBorderColor.hex, creature.creatureGuid, "dm");

        }
    };

    const handleCheckboxChange = (event) => {
        let checked = event.target.checked
        setIsPlayer(checked);
        socket.emit('creatureIsPlayerChange', checked, creature.creatureGuid, "dm");
    };

    const handleTeamChangeWidget = (event) => {
        event.stopPropagation();
        setOpenTeamWidget(!openTeamWidget)
    }

    const handleArmorClassChange = (event) => {
        let ac = parseInt(event.target.value)
        creature.armor_class = isNaN(ac) ? '0' : ac
        setCreature({...creature});
    }

    const handleArmorClassChangeSubmit = (event) => {
        if(!isNaN(creature.armor_class))
            socket.emit('creatureArmorClassChange', creature.armor_class, creature.creatureGuid, "dm");
    }

    const handleOpenEffectWidget = (event) => {
        setOpenEffectWidget(!openEffectWidget)
    }

    const handleHighlight = (e) => {
        e.target.select();
    };

    const updateCreatureEffects = (event, effectObj) => {
        event.stopPropagation(); // Prevent propagation to parent
        const alreadyExists = effects.some(eObj => eObj.effect === effectObj.effect);
        let type = "add"
        if(alreadyExists) {
            setEffects(effects.filter(eObj => eObj.effect !== effectObj.effect))
            type = "remove"
        } else {
            setEffects([...effects, effectObj])

        }
        socket.emit('changeCreatureEffect', effectObj, type, creature.creatureGuid, "dm");

    };

    let isDead = creature.hit_points_current <= 0
    let isBloodied = creature.hit_points_current/creature.hit_points < .55
    let color = "rgb(62, 172, 74)"
    if(isDead) {
        color = "red"
    } else if(isBloodied) {
        color = "orange"
    }
    
    let hpStyle = {color: color, borderColor: color}
    let effectsCount = effects.length > 0 ? `x${effects.length}` : ''

    return (
            <li className='listItem'
                onClick={() => setEncounterSelectedCreature(creature)}
                style={{border: isTurn ? '2px solid rgba(11, 204, 255)' : '',
                        // boxShadow: 'inset 0px 0px 6px 0px #434343'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >   
                <div 
                    className='encounterCreatureContainer animated-box'
                    style={{
                        backgroundImage: `linear-gradient(45deg, ${borderColor} 25%, ${isHovered ? `#bfbba6` : `#cfc9a8`} 50%)`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: isHovered ? '20% 20%':'50% 50%',
                        boxShadow: `${isHovered ? 'inset 0px 0px 0px 0px #434343' : 'inset 0px 0px 6px 0px #434343'}`,
                        transition: 'background-position .5s, box-shadow 0.15s ease',
                    }} 
                >
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
                                    <input id='ac' className='middleStatsInput' onFocus={handleHighlight} type='text' defaultValue={creature.armor_class} onChange={handleArmorClassChange} onBlur={handleArmorClassChangeSubmit} onClick={(event) => event.stopPropagation()}/>
                                    <label htmlFor='init' className='middleStatsLabel'>Init.</label>
                                    <input id='init'className='middleStatsInput' onFocus={handleHighlight} disabled={true}  type='text' defaultValue={creature.dexterity_save ? '+' + creature.dexterity_save : '+0'} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            
                        </div>
                    </div>

                    <div className='listItemOptions'>
                        <div>
                            <OptionButton src={hidden ? eyeClosed : eyeOpen}  message={(hidden ? "Hidden" : "Visible")} onClickFunction={handleHideEnemy} imgClassName={'option-no-margin'} />
                        </div>
                        <div>
                            <FlagPole flagColor={borderColor} handleTeamChangeWidget={handleTeamChangeWidget} ref={teamButtonRef} alignment={alignment} isWidgetOpen={openTeamWidget} />
                        </div>
                        <div ref={effectButtonRef} style={{position:"relative"}} onClick={(event) => handleOpenEffectWidget(event)}>
                            <OptionButton src={EffectImg} message={`Effects ${effectsCount}`} imgStyle={{margin: 0,animation: effectsCount ? 'shadowPulse 4s ease-in-out infinite' : ''}}/>
                            {effectsCount &&
                                <div className='effectsCounter'>{effectsCount}</div>
                            }
                        </div>
                        <div>
                            <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature, index)}>
                                X
                            </button>
                        </div>
                    </div>
                   
                    {creature.hit_points !== null  ? 
                        <div className='encounterCreaturesHpContainer'>
                            <button 
                                className='encounterCreaturesHp'
                                onClick={(event) => openEditHpWidget(event)}  ref={hpButtonRef}
                                style={{
                                    backgroundImage: `linear-gradient(to top, ${hpStyle.color} 20%, white 50%)`,
                                    backgroundSize: '200% 200%',
                                    backgroundPosition: openHpWidget ? '50% 50%':'30% 30%',
                                    transition: 'background-position .5s ease, color .5s ease',
                                    ...hpStyle
                                }}
                            >
                                {creature.hit_points_current}
                                <span>/</span>
                                {creature.hit_points}
                                {creature.hit_points_temp !== 0 && (
                                    <span className='tempHp'> (+{creature.hit_points_temp}) </span>
                                )}
                            </button>
                            {creature.type === "player" && 
                                <OptionButton src={isPlayerImg} message={'Player Token'} wrapperClassName={'hpButtonPlayerOverlay'} imgStyle={{margin: 0}} onClickFunction={(event) => openEditHpWidget(event)}/>
                            }
                        </div>
                    :
                        <div className='encounterCreaturesHp'/>
                    }
                    
                </div>
                {openTeamWidget && isTeamWidgetInside && ( 
                    <div className='editTeamContainer editHpGrow' ref={teamWidgetRef} onClick={(event) => event.stopPropagation()} style={{ top: teamWidgetPosition.top + teamWidgetPosition.height*1.5, left: teamWidgetPosition.left - teamWidgetPosition.width*5.8}}>
                        <div className="teamContainerFlag"/>
                        <Compact
                            color={borderColor}
                            onChange={handleTeamColorChange}
                        />
                        <div className='teamChoices'>
                            <button className="editTeamColorButton" style={{color: "green"}} onClick={() => handleAlignmentChange('ally')}> {alignment === "ally" ? <strong><u>Ally</u></strong> : <small>Ally</small>} </button>
                            <button className="editTeamColorButton" style={{color: "black"}} onClick={() => handleAlignmentChange('neutral')}> {alignment === "neutral" ? <strong><u>Neutral</u></strong> : <small>Neutral</small>} </button>
                            <button className="editTeamColorButton" style={{color: "red"}} onClick={() => handleAlignmentChange('enemy')}> {alignment === "enemy" ? <strong><u>Enemy</u></strong> : <small>Enemy</small>} </button>
                            <div className='editIsPlayerButtonContainer'>
                                <div className='editIsPlayerText'>{isPlayer ? "Player" : "Non-Player"}</div>
                                <input
                                    type="checkbox"
                                    className='editIsPlayerButton'
                                    checked={isPlayer}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {openEffectWidget && isEffectWidgetInside && ( 
                    <div className='effectsBarContainer editHpGrow' ref={effectWidgetRef} onClick={(event) => event.stopPropagation()} style={{ top: effectWidgetPosition.bottom + 10, left: effectWidgetPosition.left - effectWidgetPosition.width*17.8}}>
                        {/* <img className='effectsBarPlayerAvatar'
                            src={creature.avatarUrl}
                            alt={"avatar"}
                        /> */}
                        <div className="effectContainerFlag"/>
                        <div className="effectsBar" onClick={(event) => event.stopPropagation()} >
                            {effectObjs.map((effectObj) => (
                                <Effect key={creature.creatureGuid + effectObj.effect} currentEffects={effects} effectObj={effectObj} updateCreatureEffects={updateCreatureEffects} />
                            ))}
                        </div>
                    </div>
                )}
                {openHpWidget && isHpWidgetInside && ( 
                    <div className='editStatsContainer editHpGrow' ref={hpWidgetRef} onClick={(event) => event.stopPropagation()} style={{ top: hpWidgetPosition.top - 10, left: hpWidgetPosition.right + 20, height: hpWidgetPosition.height*4}}>
                        <div className="infoContainerFlag"/>
                        <div className='hpChanges'>
                            <div className='editHpContainer'>
                                <button className='editHpButton healButton' onClick={(event) => handleChangeHpCreature("heal", event)}>HEAL</button>
                                <input className='editStatsInput' type='number' value={hpChange} onFocus={handleHighlight} onChange={(event) => setHpChange(parseInt(event.target.value))} autoFocus/>
                                <button className='editHpButton damageButton' onClick={(event) => handleChangeHpCreature("damage", event)}>DAMAGE</button>
                            </div>
                            <div className='extraHpContainer'>
                                <div className='extraHpInputs' >
                                    <label className='hpTitle tempHp' style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} htmlFor='temphp'><strong>Temp HP</strong></label>
                                    <input id='temphp' type='number' className='editStatsInputExtra tempHp' value={creature.hit_points_temp} style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleTempHp} onBlur={submitTempHpChange}/>
                                </div>
                                <div className='extraHpInputs'>
                                    <label className='hpTitle' htmlFor='override' style={{color: creature.hit_points_override === 0 ? 'grey' : ''}}><strong>Override HP</strong></label>
                                    <input id='override' type='number' className='editStatsInputExtra' value={creature.hit_points_override} style={{color: creature.hit_points_override === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleOverrideHp} onBlur={submitOverRideHpChange}/>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </li>
           
  );
}

export default EncounterListItem;
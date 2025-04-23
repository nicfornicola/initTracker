import React, {useEffect, useState} from 'react';
import eyeClosed from '../../pics/icons/eyeClosed.png'; 
import eyeOpen from '../../pics/icons/eyeOpen.png'; 
import OptionButton from '../EncounterColumn/OptionButton';
import isPlayerImg from '../../pics/icons/isPlayerImg.png';
import isPetImg from '../../pics/icons/pet.PNG';
import FlagPole from './FlagWidget/FlagPole.js';
import EffectImg from '../../pics/icons/effectImg.png';
import { effectImgMap, addSign, COLOR_GREEN, COLOR_RED} from '../../constants.js';
import Effect from './Effect.js';
import EditAvatar from '../Statblock/EditAvatar.js';
import WidgetPopUp from './WidgetPopUp.js';
import TeamWidgetPopup from './FlagWidget/TeamWidgetPopup.js';

const colors = {
    0: "green",
    1: "orange",
    2: "brown",
}


const EncounterListItem = ({index, currentEncounter, creatureListItem, isTurn, setCurrentEncounter, handleUploadMonsterImage, selectedIndex, handleRemoveFromSelectedIndex, clickEncounterCreatureX, resort, socket}) => {
    
    const [hidden, setHidden] = useState(creatureListItem.hidden);
    const [creature, setCreature] = useState(creatureListItem)
    const [isHovered, setIsHovered] = useState(false);

    const [maxHp, setMaxHp] = useState(creatureListItem.hit_points);
    const [currentHp, setCurrentHp] = useState(creatureListItem.hit_points_current);

    const [hpChange, setHpChange] = useState(0);
    const [openHpWidget, setOpenHpWidget] = useState(false);

    const [openTeamWidget, setOpenTeamWidget] = useState(false);

    const [isPlayer, setIsPlayer] = useState(creature.type === "player");
    const [isPet, setIsPet] = useState(creature.alignment === "pet");
    const [alignment, setAlignment] = useState(creature.alignment);
    const [borderColor, setBorderColor] = useState(creature.border);
    const [effects, setEffects] = useState(creature.effects);
    const [selected, setSelected] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState(-1)

    useEffect(() => {
        const selectedIndexOf = selectedIndex.findIndex(obj => obj.index === index);
        setSelectedPlace(selectedIndexOf)
        setSelected(selectedIndexOf !== -1)
    }, [selectedIndex])

    useEffect(() => {
        setCreature(creatureListItem)
        // eslint-disable-next-line
    }, [creatureListItem]);

    const handleCreatureChange = () => {
        setCurrentEncounter(prev => ({
            ...prev,
            creatures: [...prev.creatures.map((oldCreature) => {
                return oldCreature.creatureGuid === creature.creatureGuid ? creature : oldCreature;
            })]
        }));
    }

    // This useeffect is for checking changes from the statblock edit
    useEffect(() => {
        if(creatureListItem.hit_points !== creature.hit_points || creatureListItem.hit_points_current !== creature.hit_points_current) {
            setMaxHp(creatureListItem.hit_points)
            setCurrentHp(creatureListItem.hit_points_current)
        }
    // eslint-disable-next-line
    }, [creatureListItem.hit_points, creatureListItem.hit_points_current]);

    useEffect(() => {
        let newCreature = {
                ...creature, 
                alignment: alignment,
                type: isPlayer ? 'player' : 'monster',
                border: borderColor,
                hidden: hidden,
                effects: [...effects]
        }

        setCurrentEncounter(prev => ({
            ...prev,
            creatures: [...prev.creatures.map((oldCreature) => {
                return oldCreature.creatureGuid === newCreature.creatureGuid ? newCreature : oldCreature;
            })]
        }));
        
    // eslint-disable-next-line
    }, [alignment, isPlayer, isPet, borderColor, hidden, effects]);

    const openEditHpWidget = (openHp) => {
        setOpenHpWidget(!openHp)
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
        
        creature.hit_points_current = parseInt(creature.hit_points_current) + hpNum

        if(creature.hit_points_current > creature.hit_points)
            creature.hit_points_current = creature.hit_points

        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {hit_points_current: creature.hit_points_current, hit_points_temp: creature.hit_points_temp}, creature.creatureGuid, "dm");

        setOpenHpWidget(!openHpWidget)
        setCurrentHp(creature.hit_points_current)
        setCreature({...creature})
    }

    const handleOverrideHp = (event) => {
        if(!isNaN(event.target.value)) {
            let override = parseInt(event.target.value) || 0
        
            // Set override in creature
            creature.hit_points_override = override
            // Find old diff between current and max
            let dif = creature.hit_points - creature.hit_points_current
            creature.hit_points = override === 0 ? creature.hit_points_default : override
            creature.hit_points_current = creature.hit_points - dif
            
            setMaxHp(creature.hit_points)
            setCurrentHp(creature.hit_points_current)
            setCreature({...creature})
        }
    }

    const submitOverRideHpChange = () => {
        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {
            hit_points: creature.hit_points,
            hit_points_current: creature.hit_points_current,
            hit_points_override: creature.hit_points_override,
        }, creature.creatureGuid, "dm");
        handleCreatureChange()
    }

    const handleChangeName = (event, send = false) => {
        let newName = event.target.value
        if(creature.name !== newName) {
            setCreature({...creature, name: newName})
        }

        if(send) {
            socket.emit("creatureNameChange", newName, creature.creatureGuid, "dm")
            currentEncounter.creatures[index].name = newName
            resort()
        }
    }

    const handleTempHp = (event) => {
        if(!isNaN(event.target.value)) {
            let tempHp = parseInt(event.target.value)
            creature.hit_points_temp = isNaN(tempHp) ? 0 : tempHp
            setCreature({...creature})
        }
    }

    const submitTempHpChange = () => {
        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {hit_points_temp: creature.hit_points_temp}, creature.creatureGuid, "dm");
        handleCreatureChange()
    }

    const handleHpChange = (event) => {

        if(!isNaN(event.target.value)) { 
            let input = event.target.value; 
            setHpChange(input === '' ? '' :  parseInt(event.target.value)) 
        }
    }

    const handleInitiativeChange = (event) => {
        if(!isNaN(event.target.value)) {
            let init = parseInt(event.target.value)
            if(creature.initiative !== init) {
                creature.initiative = isNaN(init) ? "" : init       
                setCreature({...creature})
            }
        }
    }
    
    const handleInitiativeCheck = () => {
        socket.emit('creatureInitiativeChange', creature.initiative, creature.creatureGuid, "dm");
        currentEncounter.creatures[index].initiative = creature.initiative
        resort()
    }    
    
    const handleHideEnemy = (event) => {
        event.stopPropagation()
        socket.emit('creatureHiddenToggle', !hidden, creature.creatureGuid, "dm");
        setHidden(!hidden)
    }  
    
    const handleAlignmentChange = (team) => {
        // If the creature is a pet and the new team is 'neutral' or 'enemy'
        if (team === 'neutral' || team === 'enemy') {
            setIsPet(false); // Remove pet status
        }

        // Only allow ally click if its not a pet
        if ((!isPet && team === 'ally') || team === 'neutral' || team === 'enemy') {
            setAlignment(team);
            socket.emit('creatureAlignmentChange', team, creature.creatureGuid, "dm");
        }
    };

    const handleTeamColorChange = (newBorderColor) => {
        if(newBorderColor.hex !== borderColor) {
            setBorderColor(newBorderColor.hex)
            socket.emit('creatureBorderColorChange', newBorderColor.hex, creature.creatureGuid, "dm");
        }
    };

    const handleCheckboxChange = (event) => {
        let checked = event.target.checked
        setIsPlayer(checked);

        if(checked && creature.alignment === 'pet') {
            setIsPet(false)
            setAlignment('ally')
            socket.emit('creatureAlignmentChange', 'ally', creature.creatureGuid, "dm");
        }

        socket.emit('creatureIsPlayerChange', checked, creature.creatureGuid, "dm");
        handleCreatureChange()
    };

    const handlePetCheckboxChange = (event) => {
        let checked = event.target.checked
        let team = checked ? 'pet' : 'ally'

        setIsPet(checked);
        if(checked && isPlayer) {
            setIsPlayer(false)
            socket.emit('creatureIsPlayerChange', false, creature.creatureGuid, "dm");
        }

        setAlignment(team);
        socket.emit('creatureAlignmentChange', team, creature.creatureGuid, "dm");
    };

    const handleTeamChangeWidget = (openReturned) => {
        setOpenTeamWidget(openReturned)
    }

    const handleArmorClassChange = (event, send = false) => {
        if(!isNaN(event.target.value)) {
            setCreature({...creature, armor_class: event.target.value});
            if(send) {
                socket.emit('creatureArmorClassChange', creature.armor_class, creature.creatureGuid, "dm");
                handleCreatureChange()
            }
        }
    }
    
    const handleInitiativeBonusChange = (event, send = false) => {
        if(!isNaN(event.target.value)) {
            setCreature({...creature, dexterity_save: event.target.value});
            if(send) {
                handleCreatureChange()
                socket?.emit('statBlockEdit', creature.creatureGuid, 'dexterity_save', event.target.value);
            }
        }
    }

    const handleHighlight = (e) => {
        e.target.select();
    };

    const updateCreatureEffects = (event, effect) => {
        event.stopPropagation(); 
        const alreadyExists = effects.some(e => e === effect);
        let updatedEffects = []
        if(alreadyExists) {
            updatedEffects = effects.filter(e => e !== effect)
        } else {
            updatedEffects = [...effects, effect]
        }

        setEffects(updatedEffects)
        setCurrentEncounter(prev => ({
            ...prev,
            creatures: [...prev.creatures.map((oldCreature) => {
                return oldCreature.creatureGuid === creature.creatureGuid ? {...creature, effects: updatedEffects} : oldCreature;
            })]
        }));

        socket.emit('creatureEffectChange', effect, alreadyExists ? "remove" : "add", creature.creatureGuid, "dm");
    };

    const handleClick = (index) => {
        if(!creatureListItem?.dnd_b_player_id)
            handleRemoveFromSelectedIndex(index, true); // Remove last column
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
    let teamColor = COLOR_GREEN
    if (alignment === "enemy") teamColor = COLOR_RED
    else if (alignment === "neutral") teamColor = '#999999'

    let invis = false;
    if(creature.type !== "player") {
        if(creature.alignment === "ally" || creature.alignment === "pet") {
            invis = hidden
        } else {
            invis = hidden || currentEncounter.hideEnemies;
        }
    }

    return (
            <li className='listItem'
                onClick={() => handleClick(index)}
                style={{
                    border: isTurn ? '2px solid rgba(0, 122, 130)' : '',
                    animation: isTurn ? 'shadowPulseTurn 2s ease-in-out infinite' : '',
                    opacity: invis ? '.5' : '1'
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
                    <div className='encounterCreatureLeftContainer' >
                        <div className='initiativeInputContainer'>
                            <input style={{borderLeft: `6px solid ${teamColor}`}} className='inputButton' onFocus={handleHighlight} onBlur={handleInitiativeCheck} type='text' value={creature.initiative} onChange={handleInitiativeChange} onClick={(event) => event.stopPropagation()}/>
                        </div>
                        <EditAvatar handleUploadMonsterImage={handleUploadMonsterImage} creature={creature} column={"encounter"}/>
                        <div className='listItemMiddleStats'>
                            <div className='nameInputContainer'>
                                <input className='nameInput' type='text' value={creature.name} onChange={handleChangeName} onBlur={(e) => handleChangeName(e, true)} onClick={(event) => event.stopPropagation()}/>
                            </div>
                            <div className='middleStatsContainer'>
                                <label htmlFor='ac' className='middleStatsLabel'>AC</label>
                                <input id='ac' className='middleStatsInput' onFocus={handleHighlight} type='numeric' value={creature.armor_class} onChange={handleArmorClassChange} onBlur={(e) => handleArmorClassChange(e, true)} onClick={(event) => event.stopPropagation()}/>
                                {creature.type !== 'player' && 
                                    <>
                                        <label htmlFor='init' className='middleStatsLabel'>Init</label>
                                        <input id='init'className='middleStatsInput' onFocus={handleHighlight} type='numeric' value={addSign(creature.dexterity_save)} onChange={handleInitiativeBonusChange} onBlur={(e) => handleInitiativeBonusChange(e, true)} onClick={(event) => event.stopPropagation()}/>
                                    </>
                                }
                            </div>
                            
                        </div>
                    </div>
                    {selected && <div className='selectedIndicater siListItem' style={{backgroundColor: colors[selectedPlace]}}>{selectedPlace+1}</div>}

                    <div className='listItemOptions'>
                        <div className='eyeball'>
                            <OptionButton src={hidden ? eyeClosed : eyeOpen}  message={(hidden ? "Hidden" : "Visible")} onClickFunction={handleHideEnemy} imgClassName={'option-no-margin'} />
                        </div>
                        <div>
                            <WidgetPopUp 
                                onOpenChange={handleTeamChangeWidget} 
                                trigger={
                                    <FlagPole flagColor={borderColor} teamColor={teamColor} isWidgetOpen={openTeamWidget} />
                                }
                                popUp={
                                    <TeamWidgetPopup borderColor={borderColor} handleTeamColorChange={handleTeamColorChange} handleAlignmentChange={handleAlignmentChange} isPlayer={isPlayer} handleCheckboxChange={handleCheckboxChange} isPet={isPet} handlePetCheckboxChange={handlePetCheckboxChange} alignment={alignment}/>
                                }
                                popOverClass={'editTeamContainer'}
                                alignOffset={-4}
                                sideOffset={8}
                            />
                        </div>
                        <div>
                            <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature, index)}>
                            ❌
                            </button>
                        </div>
                        <div>
                            {effectsCount &&
                                <div className='effectsCounter'>{effectsCount}</div>
                            }
                            <WidgetPopUp 
                                trigger={
                                    <OptionButton src={EffectImg} message={`Effects ${effectsCount}`} imgStyle={{margin: 0, animation: effectsCount ? 'shadowPulse 4s ease-in-out infinite' : ''}}/>
                                }
                                popUp={
                                    <>
                                        <div className="effectContainerFlag"/>
                                        <div className="effectsBar" onClick={(event) => event.stopPropagation()} >
                                            {Object.entries(effectImgMap).map(([effect, image]) => (
                                                <Effect 
                                                    key={creature.creatureGuid + effect} 
                                                    currentEffects={effects} 
                                                    updateCreatureEffects={updateCreatureEffects} 
                                                    effect={effect} 
                                                    image={image}
                                                />
                                            ))}
                                        </div>
                                    </>
                                }
                                popOverClass={'editTeamContainer'}
                                alignOffset={-4}
                                sideOffset={8}
                            />
                        </div>
                    </div>
                    {maxHp !== null ? 
                        <WidgetPopUp 
                            disabled={creature.dnd_b_player_id}
                            triggerClass={'hpButtonTrigger'}
                            trigger={
                                <div className='encounterCreaturesHpContainer'>
                                    <button 
                                        className='encounterCreaturesHp'
                                        style={{
                                            backgroundImage: `linear-gradient(to top, ${hpStyle.color} 20%, white 50%)`,
                                            backgroundSize: '200% 200%',
                                            backgroundPosition: openHpWidget ? '50% 50%':'30% 30%',
                                            transition: 'background-position .5s ease, color .5s ease',
                                            ...hpStyle
                                        }}
                                    >
                                        {currentHp}
                                        <span>/</span>
                                        {maxHp}
                                        {creature.hit_points_temp !== 0 && (
                                            <span className='tempHp'> (+{creature.hit_points_temp}) </span>
                                        )}
                                    </button>
                                    {creature.type === "player" ? 
                                        <OptionButton src={isPlayerImg} message={'Player Token'} wrapperClassName={'hpButtonPlayerOverlay'} imgStyle={{margin: 0}} onClickFunction={(event) => openEditHpWidget(event)}/>
                                    :
                                        <>
                                            {creature.alignment === "pet" && 
                                                <OptionButton src={isPetImg} message={'Pet Token'} wrapperClassName={'hpButtonPlayerOverlay'} imgStyle={{margin: 0}} onClickFunction={(event) => openEditHpWidget(event)}/>
                                            }
                                        </>
                                    }
                                    
                                </div>
                            }
                            popUp={
                                <>
                                    <div className="hpContainerFlag"/>
                                    <div>
                                        <div className='extraHpInputs' >
                                            <label className='hpTitle tempHp' style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} htmlFor='temphp'><strong>Temp HP</strong></label>
                                            <input id='temphp' type='number' className='editStatsInputExtra tempHp' value={creature.hit_points_temp} style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleTempHp} onBlur={submitTempHpChange}/>
                                        </div>
                                        <div className='extraHpInputs'>
                                            <label className='hpTitle' htmlFor='override' style={{color: creature.hit_points_override === 0 ? 'grey' : ''}}><strong>Override HP</strong></label>
                                            <input id='override' type='number' className='editStatsInputExtra' value={creature.hit_points_override} style={{color: creature.hit_points_override === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleOverrideHp} onBlur={submitOverRideHpChange}/>
                                        </div>
                                    </div>
                                    <div className='editHpContainer'>
                                        <button className='editHpButton healButton' onClick={(event) => handleChangeHpCreature("heal", event)}>HEAL</button>
                                        <input className='editStatsInput' value={hpChange} onChange={handleHpChange} autoFocus onFocus={handleHighlight}/>
                                        <button className='editHpButton damageButton' onClick={(event) => handleChangeHpCreature("damage", event)}>DAMAGE</button>
                                    </div>
                                </>
                            }
                            popOverClassContainer={'hpPopover'}
                            side='left'
                            sideOffset={10}
                            alignOffset={-15}
                        />
                    :
                        <div className='encounterCreaturesHp'/>
                    }
                </div>
            </li>
           
  );
}

export default EncounterListItem;
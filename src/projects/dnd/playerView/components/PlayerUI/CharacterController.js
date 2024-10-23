import React, {useRef, useState} from 'react';
import '../../../dmView/style/App.css';
import './App.css';
import OptionButton from '../../../dmView/components/EncounterColumn/OptionButton.js';
import EffectImg from '../../../dmView/pics/icons/effectImg.png';
import Effect from '../../../dmView/components/EncounterColumn/Effect.js';
import { effectObjs } from '../../../dmView/constants.js';


const CharacterController = ({creature, isTurn, socket}) => {
    const [hpChange, setHpChange] = useState(0);
    const [tempHpChange, setTempHpChange] = useState(0);
    const [overRideHpChange, setOverRideHpChange] = useState(0);

    const [openHpWidget, setOpenHpWidget] = useState(false);
    const [effects, setEffects] = useState(creature.effects);

    // const [isHpWidgetInside, setIsHpWidgetInside] = useState(true);
    const [hpWidgetPosition, setHpWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})

    const [openEffectWidget, setOpenEffectWidget] = useState(false);
    // const [isEffectWidgetInside, setIsEffectWidgetInside] = useState(true)
    const [effectWidgetPosition, setEffectWidgetPosition] = useState({top: 0, left: 0, right: 0, height: 0})

    const effectWidgetRef = useRef(null);
    const effectButtonRef = useRef(null);
    const hpButtonRef = useRef(null);
    const hpWidgetRef = useRef(null);

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

        console.log('handleChangeHpCreature', creature.hit_points_current, creature.hit_points_temp)
        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {hit_points_current: creature.hit_points_current, hit_points_temp: creature.hit_points_temp, from: "player"});

        setOpenHpWidget(!openHpWidget)
    }

    const handleTempHp = (event) => {
        let tempHp = parseInt(event.target.value)
        creature.hit_points_temp = isNaN(tempHp) ? 0 : tempHp
        setTempHpChange(creature.hit_points_temp)
    }

    const submitTempHpChange = () => {
        console.log('submitOverRideHpChange', creature.hit_points_temp)

        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {hit_points_temp: creature.hit_points_temp, from: "player"});
    }

    const handleOverrideHp = (event) => {
        let override = parseInt(event.target.value) || 0
        
        // Set override in creature
        creature.hit_points_override = override
        // Find old diff between current and max
        let dif = creature.hit_points - creature.hit_points_current
        creature.hit_points = override === 0 ? creature.hit_points_default : override
        creature.hit_points_current = creature.hit_points - dif
        setOverRideHpChange(override)
    }

    const submitOverRideHpChange = () => {
        console.log('submitOverRideHpChange', creature.hit_points, creature.hit_points_current, null, creature.hit_points_override)
        //hit_points | hit_points_current | hit_points_temp | hit_points_override
        socket.emit('playerHpChange', {
            hit_points: creature.hit_points,
            hit_points_current: creature.hit_points_current,
            hit_points_override: creature.hit_points_override,
            from: "dm"
        });

    }

    const handleOpenEffectWidget = (event) => {
        setOpenEffectWidget(!openEffectWidget)
    }

    const updateCreatureEffects = (event, effectObj) => {
        event.stopPropagation(); // Prevent propagation to parent
        const alreadyExists = effects.some(eObj => eObj.effect === effectObj.effect);
        if(alreadyExists) {
            setEffects(effects.filter(eObj => eObj.effect !== effectObj.effect))
        } else {
            setEffects([...effects, effectObj])
        }
    };

    const handleHighlight = (e) => {
        e.target.select();
    };

    const openEditHpWidget = (event) => {
        event.stopPropagation()
        setOpenHpWidget(!openHpWidget)
    }

    let name;
    let lastName;

    [name, ...lastName] = creature.name.split(' ');
    lastName = lastName.join(' ') || '';

    let isDead = creature.hit_points_current <= 0
    let isBloodied = creature.hit_points_current/creature.hit_points < .55
    let color = "rgb(62, 172, 74)"
    if(isDead) {
        color = "red"
    } else if(isBloodied) {
        color = "orange"
    }
    let effectsCount = creature.effects.length > 0 ? `x${creature.effects.length}` : ''
    let hpStyle = {color: color, borderColor: color}

    return (
        <>
            <div
                className="chosenCard"
                style={{
                        boxShadow: '0px 0px 5px 5px ' + creature.border, 
                        background: isTurn ? 'linear-gradient(to top, rgba(11, 204, 255, 0.85), rgba(11, 204, 255, .5))' : '',
                    }}
            >
                <div>
                    <div className='image-container'>
                        <img className="image" src={'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/aberration.jpg'} alt={name} />
                        <div className="imageSmoke"/>                            
                    </div>

                    <div className="name">{name} {lastName}</div> 
                    <div ref={effectButtonRef} style={{position:"relative"}} onClick={(event) => handleOpenEffectWidget(event)}>
                            <OptionButton src={EffectImg} message={`Effects ${effectsCount}`} imgStyle={{margin: 0, animation: effectsCount ? 'shadowPulse 4s ease-in-out infinite' : ''}}/>
                            {effectsCount &&
                                <div className='effectsCounter'>{effectsCount}</div>
                            }
                    </div>
                </div>
            </div>
            <div className='controllerStatsContainer'>
                <div className='chosenHpContainer'>
                    <button 
                        className='chosenHp'
                        onClick={(event) => openEditHpWidget(event)} ref={hpButtonRef}
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
                </div>

                {/* {openHpWidget && (  */}
                    <div className='editHpContainer editHpGrow' ref={hpWidgetRef} onClick={(event) => event.stopPropagation()} style={{ top: hpWidgetPosition.top - 10}}>
                        <div className="hpContainerFlag"/>
                        <div className='hpOptionsContainer'>
                            <div className='editHpButtonsContainer'>
                                <button className='editHpButton healButton' onClick={(event) => handleChangeHpCreature("heal", event)}>HEAL</button>
                                <div className='hpInputsContainer'>

                                    <input className='editHpInput' type='number' value={hpChange} onFocus={handleHighlight} onChange={(event) => setHpChange(parseInt(event.target.value))} autoFocus/>
                                    <div className='extraHpButtonsContainer'>
                                        <div className='extraHpInputs' >
                                            <label className='extraInputTitle tempHp' style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} htmlFor='temphp'><strong>Temp HP</strong></label>
                                            <input id='temphp' type='number' className='editStatsInputExtra tempHp' value={creature.hit_points_temp} style={{color: creature.hit_points_temp === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleTempHp} onBlur={submitTempHpChange}/>
                                        </div>
                                        <div className='extraHpInputs'>
                                            <label className='extraInputTitle' htmlFor='override' style={{color: creature.hit_points_override === 0 ? 'grey' : ''}}><strong>Override HP</strong></label>
                                            <input id='override' type='number' className='editStatsInputExtra' value={creature.hit_points_override} style={{color: creature.hit_points_override === 0 ? 'grey' : ''}} onFocus={handleHighlight} onChange={handleOverrideHp} onBlur={submitOverRideHpChange}/>
                                        </div>
                                    </div>

                                </div>

                                
                                
                                <button className='editHpButton damageButton' onClick={(event) => handleChangeHpCreature("damage", event)}>DAMAGE</button>
                            </div>
                            
                        </div>

                    </div>
                {/* )} */}
            </div>


            {openEffectWidget && ( 
                <div className='effectsBarContainer editHpGrow' ref={effectWidgetRef} onClick={(event) => event.stopPropagation()} style={{ top: effectWidgetPosition.bottom + 10, left: effectWidgetPosition.left - effectWidgetPosition.width*17.8}}>
                    <div className="effectContainerFlag"/>
                    <div className="effectsBar" onClick={(event) => event.stopPropagation()} >
                        {effectObjs.map((effectObj) => (
                            <Effect key={creature.creatureGuid + effectObj.effect} currentEffects={effects} effectObj={effectObj} updateCreatureEffects={updateCreatureEffects} />
                        ))}
                    </div>
                </div>
            )}
        </>
        );
};

export default CharacterController;
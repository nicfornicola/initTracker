import React from 'react';
import '../style/App.css'; // Import your CSS file
import { v4 as uuidv4 } from 'uuid';

import skullpng from '../pics/imageOverlays/skulls/skull.png'; 
import bloodied1 from '../pics/imageOverlays/blood/blood1.png'; 
import bloodied2 from '../pics/imageOverlays/blood/blood2.png'; 
import bloodied3 from '../pics/imageOverlays/blood/blood3.png'; 
import bloodied4 from '../pics/imageOverlays/blood/blood4.png'; 
import bloodied5 from '../pics/imageOverlays/blood/blood5.png'; 
import bloodied6 from '../pics/imageOverlays/blood/blood6.png'; 
import Exhaustion from './Exhaustion'; 
import Tooltip from './Tooltip';
import DeathSaves from './DeathSaves';

// Grab the digits out of guid
function stringToInt(str) {
    const numericStr = str.replace(/\D/g, '');  
    return numericStr ? parseInt(numericStr, 10) : 1;
}

function setBloodImg(creature) {
    const bloodiedArr = [bloodied1, bloodied2, bloodied3, bloodied4, bloodied5, bloodied6]
    const randomNumber = (stringToInt(creature.guid) % 6); // Generates numbers from 0 to 5
    return bloodiedArr[randomNumber]
}

// ProfileCard Component
const Icon = ({creature, isTurn, setClickedCreature, hideDeadEnemies, enemyBloodToggle}) => {
    const isPlayer = creature.type === "player";
    const effectsFound = creature.effects.length > 0
    const foundHp = creature.maxHp !== null;
    const showIcon = creature.initiative >= 0
    const showInitiativeBox = creature.initiative !== null;
    const isExhausted = creature.exhaustionLvl > 0
    
    const handleImageClick = (event) => {
        event.stopPropagation(); // Prevent propagation to parent
        setClickedCreature(creature);
    };

    let showEnemyHp = false;
    let isBloodied = false;
    let bloodImg;
    let name = isPlayer ? "" : creature.name
    let lastName = ""

    let hpBoxShadow;
    const playerLowHpBoxShadow =  {boxShadow: '1px 1px 8px 5px rgba(150, 40, 27, 1)'};
    const playerMediumHpBoxShadow = {boxShadow: '1px 1px 8px 5px rgba(242, 177, 35, 1)'};
    const globalHpBoxShadow = {boxShadow: '1px 1px 8px 5px rgba(255, 255, 255)'};

    let cardBoxShadow;
    const monsterBoxShadow = {boxShadow: '0px 3px 8px 5px rgba(203, 38, 19, 1)'};
    const playerBoxShadow = {boxShadow: '0px 3px 8px 5px rgba(0, 230, 64, 1)'};
    if (isPlayer) {

        let namesArr = creature.name.split(' ');
        name = namesArr[0];
        if (namesArr.length > 1) {
            lastName = creature.name.substring(creature.name.indexOf(' ') + 1);
        }
        
        let hpPercent = creature.hit_points_current / creature.hit_points;
        if (hpPercent < 0.20) {
            isBloodied = true;
            hpBoxShadow = playerLowHpBoxShadow;
        } else if (hpPercent < 0.55) {
            isBloodied = true;
            hpBoxShadow = playerMediumHpBoxShadow;
        }

        if(isBloodied) {
            bloodImg = setBloodImg(creature)
        }

        cardBoxShadow = playerBoxShadow

    } else if(creature.type === "monster") { // it's a Monster
        cardBoxShadow = monsterBoxShadow;

        if (enemyBloodToggle === 2)
            showEnemyHp = true;

        let hpPercent = creature.hit_points_current / creature.hit_points;
        if (hpPercent < 0.55 && enemyBloodToggle !== 0) {
            isBloodied = true;
            bloodImg = setBloodImg(creature)
        }
    } else { // Global
        cardBoxShadow = globalHpBoxShadow;
    }

    let isGlobal = creature.type === "global"
    let isDead = (creature.hit_points_current <= 0 || creature.exhaustionLvl === 6) && !isGlobal
    let showHp = (isPlayer && foundHp) || (!isPlayer && showEnemyHp)
    let showDeathSaves = isPlayer && foundHp && (creature.deathSaves.successCount >= 0 && creature.deathSaves.failCount >= 0)

    if(hideDeadEnemies && !isPlayer  && isDead ) {
        return null
    }
    

    return (
        <>
            { showIcon && (
                    <div
                        className="card"
                        style={{...cardBoxShadow, background: isTurn ? 'linear-gradient(to top, rgba(11, 204, 255, 0.85), rgba(11, 204, 255, .5))' : ''}}
                        onClick={(event) => handleImageClick(event)}
                    >
                        <div>
                        <div className='image-container'>
                            <img className="image" src={creature.avatarUrl} alt={name} />
                            <div className="imageSmoke"/>                            
                            {isDead && !isGlobal && (
                                <>
                                    <img className="image overlay-skull" src={skullpng} alt="" />
                                    {showDeathSaves && (
                                        <DeathSaves deathSaves={creature.deathSaves} />
                                    )}
                                </>
                                
                            )}

                            {isBloodied && (
                                <img className="image overlay-blood" src={bloodImg} alt="" />
                            )}

                            {effectsFound && (
                                <div className='avatarEffectsBar'>    
                                    {creature.effects.map((obj) => (
                                        <label key={uuidv4()}>
                                            <img className='effect'
                                                src={obj.img}
                                                alt={obj.effect}
                                            />
                                            <Tooltip message={obj.effect}/>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="name">{name}</div> 
                        <div className='lastName'> {lastName}</div>

                        {showHp && ( 
                            <div className="hp-box" style={hpBoxShadow}>
                                <div className="hp">
                                    {creature.hit_points_current}/{creature.hit_points}
                                    
                                    {creature.hit_points_temp > 0 && ( 
                                        <span className='tempHp'>(+{creature.hit_points_temp})</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {isExhausted && ( 
                            <Exhaustion exhaustionLvl={creature.exhaustionLvl}/>
                        )}

                        {showInitiativeBox && 
                            <div className="initiative-box">
                                <div className='initiative'>{creature.initiative}</div>
                            </div>
                        }

                    </div>
                </div>
            ) }
        </>
    );
};

export default Icon;
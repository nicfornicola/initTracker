import React from 'react';
import '../../dmView/style/App.css'; // Import your CSS file

import skullpng from '../pics/imageOverlays/skulls/skull.png'; 
import bloodied1 from '../pics/imageOverlays/blood/blood1.png'; 
import bloodied2 from '../pics/imageOverlays/blood/blood2.png'; 
import bloodied3 from '../pics/imageOverlays/blood/blood3.png'; 
import bloodied4 from '../pics/imageOverlays/blood/blood4.png'; 
import bloodied5 from '../pics/imageOverlays/blood/blood5.png'; 
import bloodied6 from '../pics/imageOverlays/blood/blood6.png'; 
import Exhaustion from './Exhaustion'; 
import DeathSaves from './DeathSaves';
import { effectImgMap } from '../../dmView/constants'

// Grab the digits out of creatureGuid
function stringToInt(str) {
    const numericStr = str.replace(/\D/g, '');  
    return numericStr ? parseInt(numericStr, 10) : 1;
}

function getBloodImg(creature) {
    const bloodiedArr = [bloodied1, bloodied2, bloodied3, bloodied4, bloodied5, bloodied6]
    const randomNumber = (stringToInt(creature.creatureGuid) % 6); // Generates numbers from 0 to 5
    return bloodiedArr[randomNumber]
}

const Icon = ({creature, isTurn, hideDeadEnemies, enemyBloodToggle, iconSize}) => {
    const isPlayer = creature.type === "player";
    const isAlly = creature.alignment === "ally" || creature.type === "player";
    const effectsFound = creature.effects.length > 0
    const showInitiativeBox = creature.initiative !== null;
    const isExhausted = creature.exhaustionLvl > 0
    const lowHpBoxColor =  {boxShadow: '1px 1px 8px 5px rgba(150, 40, 27, 1)'};
    const mediumHpBoxColor = {boxShadow: '1px 1px 8px 5px rgba(242, 177, 35, 1)'};
    const hpPercent = creature.hit_points_current / creature.hit_points;

    let isDead = (creature.hit_points_current <= 0 || creature.exhaustionLvl === 6) && creature.type !== "global"
    let showHp = isAlly || (enemyBloodToggle === 2)
    let showDeathSaves = isPlayer && (creature.death_saves_success_count >= 0 && creature.death_saves_failure_count >= 0)
    let isBloodied = false;
    let name = isPlayer ? "" : creature.name
    let lastName = ""
    let hpBoxColor;

    if (hpPercent < 0.55 && (isAlly || enemyBloodToggle > 0)) {
        isBloodied = true;
        hpBoxColor = hpPercent > 0.55 ? {} : (hpPercent < 0.20 ? lowHpBoxColor : mediumHpBoxColor);
    }

    if (isPlayer) {
        [name, ...lastName] = creature.name.split(' ');
        lastName = lastName.join(' ') || '';
    }

    return (
        <>
            {(hideDeadEnemies && !isAlly && isDead) ? (
                null 
            ) : (
                <div className='iconImageDrop'>
                    <div className="card"
                        style={{
                            animation: isTurn ? 'playerViewIconShadowPulse 3s ease-in-out infinite' : '',
                            opacity: isDead && !isPlayer ? 0.5 : 1,
                            '--static-border': creature.border, 
                            boxShadow: `0px 0px 5px 5px ${creature.border}`, 
                            border: isTurn ? '2px solid #00ffff' : '2px solid #ffffff',
                            width: `${iconSize.width}px`,
                            height: `${iconSize.height}px`,
                            '--iconWidth': `${iconSize.width}px`, 

                        }}
                    >
                        <div className='image-container'>
                            <img className="image" src={creature.avatarUrl} alt={name} />
                            <div className="imageSmoke"/>                            
                            {isDead ? (
                                <>
                                    <img className="image overlay-skull" src={skullpng} alt="" />
                                    {showDeathSaves && (
                                        <DeathSaves pass={creature.death_saves_success_count} fail={creature.death_saves_failure_count} />
                                    )}
                                </>
                                
                            ) : (
                                <>{isBloodied && <img className="image overlay-blood" src={getBloodImg(creature)} alt="" />}</>
                            )}                            

                            {effectsFound && (
                                <div className='avatarEffectsBar'>    
                                    {creature.effects.map((effectName) => (
                                            <img className='effectPlayerView'
                                                key={effectName}
                                                src={effectImgMap[effectName]}
                                                alt={effectName}
                                            />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="name" style={{opacity: 1}}>{name}</div> 
                        <div className='lastName'> {lastName}</div>

                        {showHp && ( 
                            <div className="hp-box" style={hpBoxColor}>
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

            )}
        </>
    );
};

export default Icon;
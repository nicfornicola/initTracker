import React from 'react';
import '../../dmView/style/App.css'; // Import your CSS file
import { v4 as uuidv4 } from 'uuid';

import skullpng from '../pics/imageOverlays/skulls/skull.png'; 
import bloodied1 from '../pics/imageOverlays/blood/blood1.png'; 
import bloodied2 from '../pics/imageOverlays/blood/blood2.png'; 
import bloodied3 from '../pics/imageOverlays/blood/blood3.png'; 
import bloodied4 from '../pics/imageOverlays/blood/blood4.png'; 
import bloodied5 from '../pics/imageOverlays/blood/blood5.png'; 
import bloodied6 from '../pics/imageOverlays/blood/blood6.png'; 
import Exhaustion from './Exhaustion'; 
import DeathSaves from './DeathSaves';

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

const Icon = ({creature, isTurn, hideDeadEnemies, enemyBloodToggle}) => {
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
    let showDeathSaves = isPlayer && (creature.deathSaves.successCount >= 0 && creature.deathSaves.failCount >= 0)
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
                <div
                    className="card"
                    style={{boxShadow: '0px 0px 5px 5px ' + creature.border, 
                        background: isTurn ? 'linear-gradient(to top, rgba(11, 204, 255, 0.85), rgba(11, 204, 255, .5))' : '',
                        opacity: isDead && !isPlayer ? .5 : 1}}
                >
                    <div>
                        <div className='image-container'>
                            <img className="image" src={creature.avatarUrl} alt={name} />
                            <div className="imageSmoke"/>                            
                            {isDead ? (
                                <>
                                    <img className="image overlay-skull" src={skullpng} alt="" />
                                    {showDeathSaves && (
                                        <DeathSaves deathSaves={creature.deathSaves} />
                                    )}
                                </>
                                
                            ) : (
                                <>{isBloodied && <img className="image overlay-blood" src={getBloodImg(creature)} alt="" />}</>
                            )}                            

                            {effectsFound && (
                                <div className='avatarEffectsBar'>    
                                    {creature.effects.map((obj) => (
                                        <label key={uuidv4()}>
                                            <img className='effect'
                                                src={obj.img}
                                                alt={obj.effect}
                                            />
                                        </label>
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
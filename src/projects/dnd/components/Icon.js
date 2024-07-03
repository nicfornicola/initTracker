import React, { useState } from 'react';
import '../style/App.css'; // Import your CSS file
import skullpng from '../pics/skull.png'; 
import bloodied1 from '../pics/blood1.png'; 
import bloodied2 from '../pics/blood2.png'; 
import bloodied3 from '../pics/blood3.png'; 
import bloodied4 from '../pics/blood4.png'; 
import bloodied5 from '../pics/blood5.png'; 
import bloodied6 from '../pics/blood6.png'; 


// ProfileCard Component
const Icon = ({creature}) => {
    const foundHp = creature.maxHp !== null;
    const isPlayer = creature.type === "player";
    const [isImageVisible, setIsImageVisible] = useState(true);
    const showIcon = isImageVisible && creature.initiative >= 0
    const showInitiativeBox = creature.initiative !== null;

    const handleImageClick = (b) => {
        setIsImageVisible(b);
    };

    let currentHp;
    let isBloodied = false;
    let bloodImg;
    let name = ""
    let lastName = ""

    let hpBoxShadow;
    const playerLowHpBoxShadow =  {boxShadow: '1px 1px 8px 5px rgba(150, 40, 27, 1)'};
    const playerMediumHpBoxShadow = {boxShadow: '1px 1px 8px 5px rgba(242, 177, 35, 1)'};

    let cardBoxShadow;
    const monsterBoxShadow = {boxShadow: '0px 3px 8px 5px rgba(203, 38, 19, 1)'};
    const playerBoxShadow = {boxShadow: '0px 3px 8px 5px rgba(0, 230, 64, 1)'};

    if (isPlayer) {
        let namesArr = creature.name.split(' ');
        name = namesArr[0];
        if (namesArr.length > 1) {
            lastName = creature.name.substring(creature.name.indexOf(' ') + 1);
        }

        if (foundHp) {
            currentHp = creature.maxHp - creature.removedHp
            if (currentHp / creature.maxHp < 0.20) {
                hpBoxShadow = playerLowHpBoxShadow;
                isBloodied = true;
            } else if (currentHp / creature.maxHp < 0.55) {
                isBloodied = true;
                hpBoxShadow = playerMediumHpBoxShadow;
            }

            if(isBloodied) {
                const bloodiedArr = [bloodied1, bloodied2, bloodied3, bloodied4, bloodied5, bloodied6]
                const randomNumber = (creature.id % 6) + 1; // Generates numbers from 0 to 5

                bloodImg = bloodiedArr[randomNumber]
            }

        }

        cardBoxShadow = playerBoxShadow
    } else { // it's a Monster
        name = creature.name;
        currentHp = creature.monsterCurrentHp
        cardBoxShadow = monsterBoxShadow;
    }

    let isDead = currentHp <= 0
    return (
        <>
            { showIcon &&  (
                <div className="card" style={cardBoxShadow} onClick={() => handleImageClick(false)}>
                    <div>
                        <div className='image-container'>
                            <img className="image" src={creature.avatarUrl} alt={name} />
                            {isDead && (
                                <img className="image overlay-skull" src={skullpng} alt="" />
                            )}
                            {isBloodied && (
                                <img className="image overlay-blood" src={bloodImg} alt="" />
                            )}
                        </div>

                        <div className="name">{name}</div> <div className='lastName'> {lastName}</div>

                        {isPlayer && foundHp && (
                            <div className="hp-box" style={hpBoxShadow}>
                                <div className="hp">
                                    {currentHp}/{creature.maxHp}
                                    
                                    {creature.tempHp && ( 
                                        <>(+<a href='example.com' className='tempHp'>{creature.tempHp}</a>)</>
                                    )}
                                </div>
                            </div>
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
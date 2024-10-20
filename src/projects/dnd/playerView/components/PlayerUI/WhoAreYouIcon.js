import React from 'react';
import '../../../dmView/style/App.css';

const WhoAreYouIcon = ({creature, isTurn, handleSetSelectedCharacter}) => {

    let name;
    let lastName;

    [name, ...lastName] = creature.name.split(' ');
    lastName = lastName.join(' ') || '';

    return (
            <div
                className="card"
                style={{
                        boxShadow: '0px 0px 5px 5px ' + creature.border, 
                        background: isTurn ? 'linear-gradient(to top, rgba(11, 204, 255, 0.85), rgba(11, 204, 255, .5))' : '',
                    }}
                onClick={() => handleSetSelectedCharacter(creature)}
            >
                <div>
                    <div className='image-container'>
                        <img className="image" src={'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/aberration.jpg'} alt={name} />
                        <div className="imageSmoke"/>                            
                    </div>

                    <div className="name">{name}</div> 
                    <div className='lastName'> {lastName}</div>
                </div>
            </div>
        );
};

export default WhoAreYouIcon;
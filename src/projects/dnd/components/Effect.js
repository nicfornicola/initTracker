import React from 'react';
import '../style/App.css'; // Import your CSS file

// ProfileCard Component
const Effect = ({clickedCreature, effectObj, updateCreatureEffect}) => {
    const hasEffect = clickedCreature.effects.some(eObj => eObj.effect === effectObj.effect);

    return (
        <div className='effectWrapper'>
            <img className='effect'
                src={effectObj.img}
                alt={effectObj.effect}
                style={{ 
                    opacity: hasEffect ? 0.3 : 1, 
                    border: hasEffect ? '1px solid #ffffff' : '1px solid #ffffff00'
                }}
                onClick={(event) => updateCreatureEffect(event, effectObj)}
            />
            <span className="tooltiptext" >{effectObj.effect}</span>
        </div>
    );
};

export default Effect;
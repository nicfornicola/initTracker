import React from 'react';
import '../../dmView/style/App.css';

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
        </div>
    );
};

export default Effect;
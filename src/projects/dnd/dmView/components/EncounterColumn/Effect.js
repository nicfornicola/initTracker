import React from 'react';

const Effect = ({currentEffects, effectObj, updateCreatureEffects}) => {
    const hasEffect = currentEffects.some(eObj => eObj.effect === effectObj.effect);

    return (
        <div className='effectWrapper'>
            <img className='effect'
                src={effectObj.img}
                alt={effectObj.effect}
                style={{ 
                    opacity: hasEffect ? 0.3 : 1, 
                    border: hasEffect ? '1px solid #ffffff' : ''
                }}
                onClick={(event) => updateCreatureEffects(event, effectObj)}
            />
        </div>
    );
};

export default Effect;
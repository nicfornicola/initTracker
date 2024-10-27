import React from 'react';

const Effect = ({currentEffects, updateCreatureEffects, effect, image}) => {
    const hasEffect = currentEffects.some(e => e === effect);

    return (
        <div className='effectWrapper'>
            <img className='effect'
                src={image}
                alt={effect}
                style={{ 
                    opacity: hasEffect ? 0.3 : 1, 
                    border: hasEffect ? '1px solid #ffffff' : ''
                }}
                onClick={(event) => updateCreatureEffects(event, effect)}
            />
        </div>
    );
};

export default Effect;
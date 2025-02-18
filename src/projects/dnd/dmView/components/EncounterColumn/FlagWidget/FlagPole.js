import React from 'react';

const FlagPole = ({flagColor, teamColor, isWidgetOpen}) => {
   
    return (
        <div style={{border: `2px ridge ${teamColor}`}} className='flagpole-container'>
            <div className="flagpole">
                <div className="flag" style={ isWidgetOpen ? {animation: 'wave 1.0s infinite ease-in-out'} : {animation: 'none'}}>
                    <div className="flag-stripes" style={{background: `linear-gradient(to top, white 0%, ${flagColor} 65%)`}}></div>
                </div>
            </div>
        </div>
    );
};

export default FlagPole;

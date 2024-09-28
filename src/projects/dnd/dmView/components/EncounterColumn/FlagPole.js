import React, {forwardRef} from 'react';

const FlagPole = forwardRef(({flagColor, handleTeamChangeWidget, isWidgetOpen}, ref) => {
    return (
        <div className='flagpole-container' ref={ref} onClick={handleTeamChangeWidget}>
            <div className="flagpole">
                <div className="flag" style={ isWidgetOpen ? {animation: 'wave 1.0s infinite ease-in-out'} : {animation: 'none'}}>
                    <div className="flag-stripes" style={{background: `linear-gradient(to top, white 0%, ${flagColor} 65%)`}}></div>
                </div>
            </div>
        </div>
    );
});

export default FlagPole;

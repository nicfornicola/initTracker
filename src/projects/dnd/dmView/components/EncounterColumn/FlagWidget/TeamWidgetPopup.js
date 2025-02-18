import React from 'react';
import Compact from '@uiw/react-color-compact';

const TeamWidgetPopup = ({borderColor, handleTeamColorChange, handleAlignmentChange, isPlayer, handleCheckboxChange, isPet, handlePetCheckboxChange, alignment}) => {
    return <>
                <div className="teamContainerFlag"/>
                <Compact
                    color={borderColor}
                    onChange={handleTeamColorChange}
                />
                <hr className='lineSeperator'/>
                <div className='teamChoices'>
                    <button className="editTeamColorButton" style={{color: "green"}} onClick={() => handleAlignmentChange('ally')}> {alignment === "ally" || alignment === "pet" ? <strong><u>Ally</u></strong> : <small>Ally</small>} </button>
                    <button className="editTeamColorButton" style={{color: "black"}} onClick={() => handleAlignmentChange('neutral')}> {alignment === "neutral" ? <strong><u>Neutral</u></strong> : <small>Neutral</small>} </button>
                    <button className="editTeamColorButton" style={{color: "red"}} onClick={() => handleAlignmentChange('enemy')}> {alignment === "enemy" ? <strong><u>Enemy</u></strong> : <small>Enemy</small>} </button>
                    <div className='editIsPlayerButtonContainer'>
                        <div className='editIsPlayerText'>Player</div>
                        <input
                            type="checkbox"
                            className='editIsPlayerButton'
                            checked={isPlayer}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    <div className='editIsPlayerButtonContainer'>
                        <div className='editIsPlayerText'>Pet</div>
                        <input
                            type="checkbox"
                            className='editIsPlayerButton'
                            checked={isPet}
                            onChange={handlePetCheckboxChange}
                        />
                    </div>
                </div>
            </>
};

export default TeamWidgetPopup;

import React, { useState, useEffect }from 'react';
import { INIT_ENCOUNTER_NAME } from '../constants';
import refresh from '../pics/icons/refresh.png';
import greenCheck from '../../playerView/pics/icons/check.png'; 
import eyeClosed from '../../playerView/pics/icons/eyeClosed.png'; 
import eyeOpen from '../../playerView/pics/icons/eyeOpen.png'; 
import skullButton from '../../playerView/pics/icons/skullButton.jpg'; 
import skullButtonNot from '../../playerView/pics/icons/skullButtonNot.jpg'; 
import background1 from "../../playerView/pics/backgrounds/fallenCastleBigTree.jpg"
import upArrow from "../../playerView/pics/icons/upArrow.png"
import downArrow from "../../playerView/pics/icons/downArrow.png"
import noArrow from "../../playerView/pics/icons/noArrow.jpg"
import bloodIcon from "../../playerView/pics/icons/bloodIcon.png"
import bloodIconMinus from "../../playerView/pics/icons/bloodIconMinus.png"
import bloodIconSlash from "../../playerView/pics/icons/bloodIconSlash.png"
import ImagePopup from "../../playerView/components/ImagePopup"
import Timer from '../../playerView/components/Timer';
import RefreshTimer from '../../playerView/components/RefreshTimer';
import OptionButton from './OptionButton';

const EncounterControls = ({handleTurnNums, currentEncounter, setCurrentEncounter, setPlayerViewBackground, handleStartEncounter, hideEnemies, enemyBloodToggle, setEnemyBloodToggle, setHideEnemies, hideDeadEnemies, setHideDeadEnemies, handleRefresh, refreshCheck, autoRefresh, handleAutoRollInitiative, setNameChange}) => {
    const [encounterName, setEncounterName] = useState(currentEncounter.encounterName);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [cardContainerStyle, setCardContainerStyle] = useState({width: '80%'});
    const [arrowButton, setArrowButton] = useState(upArrow);
    const [arrowToggleType, setArrowToggleType] = useState(0);
    const [showRefreshButton, setAutoRefreshDMB] = useState(autoRefresh);
    const [enemyBloodToggleImage, setEnemyBloodToggleImage] = useState(bloodIcon);

    useEffect(() => {
        setAutoRefreshDMB(autoRefresh)
    }, [autoRefresh]);  

    const handleMovePortraits = () => {
        let type = arrowToggleType + 1
        if(type === 0) { setArrowButton(upArrow) }
        else if(type === 1) { setArrowButton(noArrow) } 
        else if(type === 2) { setArrowButton(downArrow) }
        setArrowToggleType(type === 2 ? -1 : type)
    }

    const handleEnemyBlood = () => {

        let newToggle = parseInt(enemyBloodToggle) + 1
        let type = newToggle === 3 ? 0 : newToggle
        setEnemyBloodToggle(type)
        localStorage.setItem('enemyBloodToggle', JSON.stringify(type));

        let newImage = undefined
        if(type === 0) { newImage = bloodIcon } 
        else if(type === 1) { newImage = bloodIconSlash } 
        else if(type === 2) { newImage = bloodIconMinus } 
        setEnemyBloodToggleImage(newImage) 
    } 

    const handleHideEnemies = () => {
        // if(hideEnemies && !isOfflineMode) // If hideEnemies is true, then refresh before revealing enemies
            // handleRefresh(2)
        setHideEnemies(!hideEnemies)
        localStorage.setItem('hideEnemies', !hideEnemies);
    } 

    const handleHideDeadEnemies = () => {
        // if(hideEnemies && !isOfflineMode) // If hideEnemies is true, then refresh before revealing enemies
            // handleRefresh(2)
        setHideDeadEnemies(!hideDeadEnemies)
        localStorage.setItem('hideDeadEnemies', !hideDeadEnemies);
    } 

    useEffect(() => {
        if(encounterName !== currentEncounter.encounterName) {
            setEncounterName(currentEncounter.encounterName)
        }
    }, [currentEncounter.encounterName]);


    let titleColor = encounterName === INIT_ENCOUNTER_NAME ? 'grey' : ''
    let {roundNum, turnNum} = handleTurnNums()

    const handleTitleChange = (e) => {
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    const handleEncounterNameChange = (e) => {
        if (currentEncounter.encounterName !== e.target.value) {
            setEncounterName(e.target.value);
            setCurrentEncounter(prev => ({...prev, encounterName: e.target.value}))
            setNameChange(true)
        }
    };

    return (
        <div className='encounterControlsContainer'>
            <div>
                <input style={{color: titleColor}} className='nameInput' type='text' value={encounterName} onChange={handleTitleChange} onBlur={handleEncounterNameChange} onClick={(event) => event.target.select()}/>
                <span className='encounterTitleEdit'>🖉</span>
            </div>
            <div className='encounterControls'> 
                <div className='encounterControlsLeft'>
                    <div className='dmStartButtons'>
                        <button className='dmViewButton' onClick={handleAutoRollInitiative}>Roll Init.</button>
                        <button className='dmViewButton' onClick={handleStartEncounter}>Player View</button>
                    </div>
                    <div className='dmLowOptions'>
                        <OptionButton src={arrowButton} message={"Player View Icon Position"} onClickFunction={handleMovePortraits}/>
                        <ImagePopup setPlayerViewBackground={setPlayerViewBackground} setYoutubeLink={setYoutubeLink} />                    
                        {showRefreshButton &&
                            <OptionButton src={refreshCheck ? greenCheck : refresh} message={<RefreshTimer refresh={refreshCheck}/>} onClickFunction={() => handleRefresh()} />
                        }         
                        <Timer />     
                    </div>
                </div>
                <div className='encounterCountrolsRight'>
                    {currentEncounter.currentEncounterCreatures.length > 0 && 
                        <>
                            <div className='encounterTitleButtonGroup' onClick={(e) => e.stopPropagation()}>
                                    <button className='dmViewButton' onClick={(e) => handleTurnNums('prev', e)}> {'<<'} </button>
                                    <div className='turnText'>
                                        R: {roundNum} - T: {turnNum} 
                                    </div>
                                    <button className='dmViewButton' onClick={(e) => handleTurnNums('next', e)}> {'>>'} </button>
                            </div>
                            <div className='dmLowOptions'>
                                <OptionButton src={hideDeadEnemies ? skullButton : skullButtonNot} message={(hideDeadEnemies ? "Show" : "Hide") + " Dead Enemies"} onClickFunction={handleHideDeadEnemies}/>
                                <OptionButton src={enemyBloodToggleImage} message={enemyBloodToggle === 0 ? "Show Enemy Blood" : (enemyBloodToggle === 1 ? "Show Enemy HP" : "Hide Enemy Blood & HP")} onClickFunction={handleEnemyBlood}/>
                                <OptionButton src={hideEnemies ? eyeClosed : eyeOpen} message={"Enemies " + (hideEnemies ? "Hidden" : "Visible")} onClickFunction={handleHideEnemies}/>
                            </div>
                        </>
                    }
                    
                    
                </div>
            </div>
            
        </div>
    );
}

export default EncounterControls;
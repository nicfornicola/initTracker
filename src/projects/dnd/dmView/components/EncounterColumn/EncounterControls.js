import React, { useState, useEffect }from 'react';
import { INIT_ENCOUNTER_NAME } from '../../constants';
import refresh from '../../pics/icons/refresh.png';
import greenCheck from '../../pics/icons/check.png'; 
import eyeClosed from '../../pics/icons/eyeClosed.png'; 
import eyeOpen from '../../pics/icons/eyeOpen.png'; 
import skullButton from '../../pics/icons/skullButton.jpg'; 
import skullButtonNot from '../../pics/icons/skullButtonNot.jpg'; 
import upArrow from "../../pics/icons/upArrow.png"
import downArrow from "../../pics/icons/downArrow.png"
import noArrow from "../../pics/icons/noArrow.jpg"
import bloodIcon from "../../pics/icons/bloodIcon.png"
import bloodIconMinus from "../../pics/icons/bloodIconMinus.png"
import bloodIconSlash from "../../pics/icons/bloodIconSlash.png"
import ImagePopup from ".//ImagePopup"
import Timer from './/Timer';
import RefreshTimer from './RefreshTimer';
import OptionButton from './OptionButton';
import EnemyBloodiedMessage from './EnemyBloodiedMessage';

function getBloodImage(type) {
    let newImage = undefined
    if(type === 0) { newImage = bloodIconMinus } 
    else if(type === 1) { newImage = bloodIcon } 
    else if(type === 2) { newImage = bloodIconSlash } 
    return newImage
}

const EncounterControls = ({handleTurnNums, currentEncounter, refreshLoading, setCurrentEncounter, setPlayerViewBackground, setCardContainerStyle, handleStartEncounter, hideEnemies, enemyBloodToggle, setEnemyBloodToggle, setHideEnemies, hideDeadEnemies, setHideDeadEnemies, handleRefresh, refreshCheck, autoRefresh, handleAutoRollInitiative, setNameChange, socket}) => {
    const [encounterName, setEncounterName] = useState(currentEncounter.encounterName);
    const [arrowButton, setArrowButton] = useState(upArrow);
    const [arrowToggleType, setArrowToggleType] = useState(0);
    const [showRefreshButton, setAutoRefreshDMB] = useState(autoRefresh);
    const [enemyBloodToggleImage, setEnemyBloodToggleImage] = useState(getBloodImage(enemyBloodToggle));

    // useEffect(() => {
    //     setRefreshSpin(refreshLoading)
    // }, [refreshLoading]);    
    
    useEffect(() => {
        setAutoRefreshDMB(autoRefresh)
    }, [autoRefresh]);  

    const handleMovePortraits = () => {
        let type = arrowToggleType + 1
        let newStyle = {}
        if(type === 0) { 
            setArrowButton(upArrow) 
            newStyle.width ='80%';
        }
        else if(type === 1) { 
            setArrowButton(downArrow) 
            newStyle.width ='95%';
            newStyle.top ='0%';
        } 
        else if(type === 2) { 
            setArrowButton(noArrow) 
            newStyle.width ='95%';
            newStyle.bottom ='0%';
        }

        localStorage.setItem('cardContainerStyle', JSON.stringify(newStyle));
        setCardContainerStyle(newStyle)
        setArrowToggleType(type === 2 ? -1 : type)
    } 


    const handleEnemyBlood = () => {

        let newToggle = parseInt(enemyBloodToggle) + 1
        let type = newToggle === 3 ? 0 : newToggle
        let newImage = getBloodImage(type)

        setEnemyBloodToggleImage(newImage) 
        setEnemyBloodToggle(type)
        localStorage.setItem('enemyBloodToggle', JSON.stringify(type));
    } 

    const handleHideEnemies = () => {
        if(autoRefresh && hideEnemies) // If hideEnemies is true, then refresh before revealing enemies
            handleRefresh()
        setHideEnemies(!hideEnemies)
        localStorage.setItem('hideEnemies', !hideEnemies);
    } 

    const handleHideDeadEnemies = () => {
        setHideDeadEnemies(!hideDeadEnemies)
        localStorage.setItem('hideDeadEnemies', !hideDeadEnemies);
    } 

    useEffect(() => {
        if(encounterName !== currentEncounter.encounterName) {
            setEncounterName(currentEncounter.encounterName)
        }
        // eslint-disable-next-line
    }, [currentEncounter.encounterName]);


    let titleColor = encounterName === INIT_ENCOUNTER_NAME ? 'grey' : ''
    let {roundNum, turnNum} = handleTurnNums()

    const handleTitleChange = (e) => {
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    const handleEncounterNameChange = (e) => {
        console.log("onBlur new name", e.target.value, currentEncounter.encounterGuid)
        if (currentEncounter.encounterName !== e.target.value) {
            setEncounterName(e.target.value);
            setCurrentEncounter(prev => ({...prev, encounterName: e.target.value}))
            setNameChange(true)

            if(currentEncounter.creatures.length === 0 && encounterName === INIT_ENCOUNTER_NAME) {
                socket.emit("newEncounter", currentEncounter.encounterGuid)
            }

            socket.emit("encounterNameChange", e.target.value, currentEncounter.encounterGuid)
        }
    };

    return (
        <div className='encounterControlsContainer'>
            <div>
                <input style={{color: titleColor}} className='titleInput nameInput' type='text' value={encounterName} onChange={handleTitleChange} onBlur={handleEncounterNameChange} onClick={(event) => event.target.select()}/>
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
                        <ImagePopup setPlayerViewBackground={setPlayerViewBackground} socket={socket}/>                    
                        {showRefreshButton &&
                            <OptionButton src={refreshCheck ? greenCheck : refresh} message={<RefreshTimer refresh={refreshCheck}/>} onClickFunction={() => handleRefresh()} imgClassName={refreshLoading ? 'spinningImage' : ''} />
                        }         
                        <Timer />     
                    </div>
                </div>
                <div className='encounterCountrolsRight'>
                    {currentEncounter.creatures.length > 0 && 
                        <>
                            <div className='encounterTitleButtonGroup' onClick={(e) => e.stopPropagation()}>
                                    <button className='dmViewButton' onClick={(e) => handleTurnNums('prev', e)}> {'<<'} </button>
                                    <div className='turnText'>
                                        R: {roundNum} - T: {turnNum} 
                                    </div>
                                    <button className='dmViewButton' onClick={(e) => handleTurnNums('next', e)}> {'>>'} </button>
                            </div>
                            <div className='dmLowOptions'>
                                <OptionButton src={hideEnemies ? eyeClosed : eyeOpen} message={"Enemies " + (hideEnemies ? "Hidden" : "Visible")} onClickFunction={handleHideEnemies}/>
                                <OptionButton src={hideDeadEnemies ? skullButtonNot : skullButton} message={"Dead Enemies: " + (hideDeadEnemies ? "Hidden" : "Visible")} onClickFunction={handleHideDeadEnemies}/>
                                <OptionButton src={enemyBloodToggleImage} message={<EnemyBloodiedMessage enemyBloodToggle={enemyBloodToggle}/>} onClickFunction={handleEnemyBlood}/>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default EncounterControls;
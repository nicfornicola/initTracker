import React, { useState, useEffect }from 'react';
import { INIT_ENCOUNTER_NAME, handleOpenSession } from '../../constants';
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
import streamingGif from '../../pics/icons/streaming.gif';
import streamingImg from '../../pics/icons/streamingImg.png';
import useShakeAnimation from '../../Hooks/useShakeAnimation';

import { useUser } from '../../../../../providers/UserProvider';

function getBloodImage(type) {
    let newImage;
    if(type === 0) { newImage = bloodIconMinus } 
    else if(type === 1) { newImage = bloodIcon } 
    else if(type === 2) { newImage = bloodIconSlash } 
    return newImage
}

const EncounterControls = ({streamingEncounter, setStreamingEncounter, handleTurnNums, currentEncounter, refreshLoading, setCurrentEncounter, setPlayerViewBackground, handleRefresh, refreshCheck, autoRefresh, handleAutoRollInitiative, setNameChange, socket}) => {
    const [arrowButton, setArrowButton] = useState(upArrow);
    const [arrowToggleType, setArrowToggleType] = useState(0);
    const [showRefreshButton, setShowRefreshButton] = useState(autoRefresh);
    const [enemyBloodToggleImage, setEnemyBloodToggleImage] = useState(getBloodImage(currentEncounter.enemyBloodToggle));

    const [encounterName, setEncounterName] = useState(currentEncounter.encounterName);
    const [hideEnemies, setHideEnemies] = useState(currentEncounter.hideEnemies);
    const [enemyBloodToggle, setEnemyBloodToggle] = useState(currentEncounter.enemyBloodToggle);
    const [hideDeadEnemies, setHideDeadEnemies] = useState(currentEncounter.hideDeadEnemies);
    const [anyEnemyVisible, setAnyEnemyVisible] = useState(currentEncounter.creatures.filter(creature => !creature.hidden && creature.type !== "player").length);
    const [isStreaming, setIsStreaming] = useState(streamingEncounter?.encounterGuid === currentEncounter.encounterGuid);
    const {sessionID} = useUser()

    const shakeRef = useShakeAnimation(anyEnemyVisible);

    useEffect(() => {
        setIsStreaming(streamingEncounter?.encounterGuid === currentEncounter.encounterGuid)
    }, [streamingEncounter?.encounterGuid]);

    useEffect(() => {
        setEncounterName(currentEncounter.encounterName)
        setHideEnemies(currentEncounter.hideEnemies)
        setEnemyBloodToggle(currentEncounter.enemyBloodToggle)
        setEnemyBloodToggleImage(getBloodImage(currentEncounter.enemyBloodToggle))
        setHideDeadEnemies(currentEncounter.hideDeadEnemies)
        setAnyEnemyVisible(currentEncounter.creatures.filter(creature => !creature.hidden && creature.type !== "player").length);
        setIsStreaming(streamingEncounter?.encounterGuid === currentEncounter.encounterGuid)

        // eslint-disable-next-line
    }, [currentEncounter]);

    useEffect(() => {
        setCurrentEncounter(
            { ...currentEncounter,
                hideEnemies: hideEnemies, 
                enemyBloodToggle: enemyBloodToggle, 
                hideDeadEnemies: hideDeadEnemies 
            });
        // eslint-disable-next-line
    }, [hideEnemies, enemyBloodToggle, hideDeadEnemies]);

    useEffect(() => {
        setShowRefreshButton(autoRefresh)
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

        setArrowToggleType(type === 2 ? -1 : type)
        socket.emit("controlCardPosition", newStyle, currentEncounter.encounterGuid)
    } 


    const handleEnemyBlood = () => {

        let newToggle = parseInt(enemyBloodToggle) + 1
        let type = newToggle === 3 ? 0 : newToggle
        let newImage = getBloodImage(type)

        setEnemyBloodToggleImage(newImage) 
        setEnemyBloodToggle(type)
        socket.emit("controlBloodToggle", type, currentEncounter.encounterGuid)

    } 

    const handleHideEnemies = () => {
        if(autoRefresh && hideEnemies) // If hideEnemies is true, then refresh before revealing enemies
            handleRefresh()

        setHideEnemies(!hideEnemies)
        socket.emit("controlHiddenToggle", !hideEnemies, currentEncounter.encounterGuid)

    } 

    const handleHideDeadEnemies = () => {
        setHideDeadEnemies(!hideDeadEnemies)
        socket.emit("controlHideDeadToggle", !hideDeadEnemies, currentEncounter.encounterGuid)
    } 

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

            if(currentEncounter.creatures.length === 0 && encounterName === INIT_ENCOUNTER_NAME) {
                socket.emit("newEncounter", currentEncounter.encounterGuid)
            }

            socket.emit("encounterNameChange", e.target.value, currentEncounter.encounterGuid)
        }
    };

    const handleStartStream = () => { 
        if(isStreaming) {
            socket.emit("stopStreaming", sessionID)
            setStreamingEncounter({encounterName: null, encounterGuid: null, playerWindowOpen: false})
            setIsStreaming(false)
        } else {
            socket.emit("startStreaming", currentEncounter.encounterGuid, sessionID)

            if(!streamingEncounter.playerWindowOpen) {
                handleOpenSession(sessionID)
            }

            setStreamingEncounter({encounterName: currentEncounter.encounterName, encounterGuid: currentEncounter.encounterGuid, playerWindowOpen: true})
            setIsStreaming(true)

        }
    }

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
                    </div>
                    <div className='dmLowOptions'>
                        {sessionID !== null &&
                            <OptionButton imgStyle={{border: `2px solid ${isStreaming ? 'green' : 'red'}`, backgroundColor: 'white'}} imgClassName='streamingGif' src={isStreaming ? streamingGif : streamingImg} message={isStreaming ? 'Stop Streaming'  : `Stream Encounter: '${currentEncounter.encounterName}'`} onClickFunction={handleStartStream}/>
                        }
                        {/* <OptionButton src={arrowButton} message={"Player View Icon Position"} onClickFunction={handleMovePortraits}/> */}
                        <ImagePopup setPlayerViewBackground={setPlayerViewBackground} encounterGuid={currentEncounter.encounterGuid} socket={socket}/>                    
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
                                <OptionButton src={hideEnemies ? eyeClosed : eyeOpen} message={"Enemies " + (hideEnemies ? "Hidden" : "Visible")} onClickFunction={handleHideEnemies} imgRef={hideEnemies ? shakeRef : null}/>
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
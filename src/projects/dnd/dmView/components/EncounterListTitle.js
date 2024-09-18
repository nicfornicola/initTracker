import React, { useState, useEffect }from 'react';
import { INIT_ENCOUNTER_NAME } from '../constants';
import Options from './Options';
import refreshPlayers from '../../playerView/pics/icons/refreshPlayers.png'; 
import refresh from '../../playerView/pics/icons/refresh.png'; 
import refreshMonster from '../../playerView/pics/icons/refreshMonsters.png'; 
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
import Tooltip from "../../playerView/components/Tooltip"
import ImagePopup from "../../playerView/components/ImagePopup"
import Timer from '../../playerView/components/Timer';
import RefreshTimer from '../../playerView/components/RefreshTimer';

const EncounterListTitle = ({handleTurnNums, currentEncounter, setCurrentEncounter, handleStartEncounter, hideEnemies, enemyBloodToggle, setEnemyBloodToggle, setHideEnemies, handleRefresh, refreshCheck, autoRefresh, handleAutoRollInitiative, setNameChange}) => {
    const [encounterName, setEncounterName] = useState(currentEncounter.encounterName);
    const [backGroundImage, setBackGroundImage] = useState(background1);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    const [recentlyRefreshed, setRecentlyRefreshed] = useState(false);
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
        console.log("handleEnemtBlood", newToggle, enemyBloodToggle)
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
        localStorage.setItem('hideEnemies', JSON.stringify(!hideEnemies));

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

    console.log(autoRefresh, refreshCheck)
    return (
        <div className='encounterTitleEditContainer animated-label'>                     
            <div className='nameInputContainer'>
                <input style={{color: titleColor}} className='nameInput' type='text' value={encounterName} onChange={handleTitleChange} onBlur={handleEncounterNameChange} onClick={(event) => event.target.select()}/>
                <span className='encounterTitleEdit'>🖉</span>
                <div className='dmStartButtons'>
                    <button className='dmViewButton' onClick={handleAutoRollInitiative}>Auto Initiative</button>
                    <button className='dmViewButton' onClick={handleStartEncounter}>Play</button>
                </div>
                <div className='dmLowOptions'>
                    <img className="option" src={arrowButton} alt={"change style"} onClick={handleMovePortraits} />
                    <Tooltip message={"Icon Position"}/>
                    <ImagePopup setBackGroundImage={setBackGroundImage} setYoutubeLink={setYoutubeLink} />
                    <>
                        <img className="option" src={hideDeadEnemies ? skullButton : skullButtonNot} alt={"showDeadEnemies"} onClick={() => setHideDeadEnemies(!hideDeadEnemies)} />
                        <Tooltip message={(hideDeadEnemies ? "Show" : "Hide") + " Dead Enemies"}/>
                    </>
                    <img className="option" src={enemyBloodToggleImage} alt={"enemy blood"} onClick={handleEnemyBlood} />
                    <Tooltip message={(enemyBloodToggle === 0 ? "Show Enemy Blood" : (enemyBloodToggle === 1 ? "Show Enemy HP" : "Hide Enemy Blood & HP"))}/>
                    <img className="option" src={hideEnemies ? eyeOpen : eyeClosed} alt={"showEnemies"} onClick={handleHideEnemies} />
                    <Tooltip message={(hideEnemies ? "Show" : "Hide") + " Enemies"}/>
                    <Timer />
                    {recentlyRefreshed &&
                    <img className="option" src={greenCheck} alt={"refresh"}/>
                }


                
                {showRefreshButton &&
                    <>
                        {recentlyRefreshed &&
                            <img className="option" src={greenCheck} alt={"refresh"}/>
                        }   
                        <img className="option" src={refreshCheck ? greenCheck : refresh} alt={"refresh"} onClick={() => handleRefresh()} />
                        <span className="tooltiptext">
                            Last <img src={refreshCheck ? greenCheck : refresh} alt={"refresh"} onClick={() => handleRefresh()} />
                            <RefreshTimer totalRefresh={refreshCheck}/>
                        </span>
                    </> 
                }               

                </div>
            </div>
            {currentEncounter.currentEncounterCreatures.length > 0 && encounterName !== INIT_ENCOUNTER_NAME && 
                <div className='encounterTitleButtonGroup' onClick={(e) => e.stopPropagation()}>
                    
                    <div className='turnButtons'>
                        
                        <button className='dmViewButton' onClick={(e) => handleTurnNums('prev', e)}> {'<<'} </button>
                        <div className='turnText'>
                            <div>
                                Round: {roundNum}
                            </div>
                            <div>
                                Turn: {turnNum}
                            </div>
                        </div>
                        <button className='dmViewButton' onClick={(e) => handleTurnNums('next', e)}> {'>>'} </button>
                    </div>
                    
                </div>
            }
        </div>
    );
}

export default EncounterListTitle;
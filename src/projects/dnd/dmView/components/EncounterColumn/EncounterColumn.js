import React, { useState, useEffect } from 'react';
import StatBlock from '../Statblock/StatBlock.js';
import { generateUniqueId, dummyDefault, envObject, sortCreatureArray, INIT_ENCOUNTER_NAME, COLOR_RED, COLOR_GREEN } from '../../constants';
import EncounterListTopInfo from './EncounterListTopInfo'
import DropdownMenu from './DropdownMenu';
import EncounterControls from './EncounterControls'
import EncounterList from './EncounterList'
import UploadMonsterImage from './UploadMonsterImage'

function updateSavedEncounters(jsonArray, newEncounter) {
    if(jsonArray === null) jsonArray = []
    
    // Find the index of the existing object with the same encounterGuid
    const index = jsonArray.findIndex(item => item['encounterGuid'] === newEncounter['encounterGuid']);

    let saveType = "Saved Changes to Existing - "
    if (index !== -1) {
        jsonArray[index] = newEncounter;
    } else {
        saveType = "Saved New Encounter - "
        jsonArray.push(newEncounter);
    }

    console.log("%c" + saveType + newEncounter.encounterName + " (" + newEncounter.encounterGuid + ")", "background: #fdfd96;")

    return jsonArray;
}

const EncounterColumn = ({currentEncounter, handleLoadEncounter, refreshLoading, setCurrentEncounter, setPlayerViewBackground, savedEncounters, setSavedEncounters, handleRefresh,  refreshCheck, autoRefresh, showSearchList, handleNewEncounter, setEncounterGuid, socket}) => {
    const [roundNum, setRoundNum] = useState(currentEncounter.roundNum);
    const [turnNum, setTurnNum] = useState(currentEncounter.turnNum);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [saveMessageColor, setSaveMessageColor] = useState("");
    const [isSaveDisabled, setIsSaveDisabled] = useState(currentEncounter.creatures.length === 0);
    const [uploadIconMenu, setUploadIconMenu] = useState(false);
    const [uploadIconCreature, setUploadIconCreature] = useState(null);

    const [nameChange, setNameChange] = useState(false)

    useEffect(() => {
        if(nameChange) {
            handleSaveEncounter()
            setNameChange(false)
        }
        // eslint-disable-next-line
    }, [nameChange]);

    useEffect(() => {
        setIsSaveDisabled(currentEncounter.creatures?.length === 0)
    }, [currentEncounter.creatures]);

    // When changing encounters watch the turnNum and roundNum to rerender the turn controller
    useEffect(() => {
        setRoundNum(currentEncounter.roundNum)
        setTurnNum(currentEncounter.turnNum)
    }, [currentEncounter.roundNum, currentEncounter.turnNum]);

    const clickEncounterCreatureX = (event, xCreature, index) => {
        event.stopPropagation(); 

        // if deleting the creature currently selected unselect it
        if(selectedIndex !== null && xCreature?.creatureGuid === currentEncounter.creatures[selectedIndex]?.creatureGuid) {
            setSelectedIndex(null)
        }

        let newArray = currentEncounter.creatures.filter((_, i) => i !== index)
        setCurrentEncounter(prev => ({...prev, creatures: [...newArray]}));

        socket.emit("removeCreatureFromEncounter", xCreature.creatureGuid)
    };  

    // This is mostly for handling ui, not saving to the database
    // Since database changes happen on a lower level to avoid bloat
    const handleSaveEncounter = () => {
        if(currentEncounter.encounterName !== INIT_ENCOUNTER_NAME) {
            let newEncounter = {
                encounterName: currentEncounter.encounterName,
                encounterGuid: currentEncounter.encounterGuid || generateUniqueId(),
                roundNum: roundNum,
                turnNum: turnNum,
                creatures: currentEncounter.creatures,
                backgroundGuid: currentEncounter.backgroundGuid,
                enemyBloodToggle: currentEncounter.enemyBloodToggle,
                hideDeadEnemies: currentEncounter.hideDeadEnemies,
                hideEnemies: currentEncounter.hideEnemies
            }

            if(newEncounter.encounterGuid !== currentEncounter.encounterGuid) {
                setEncounterGuid(newEncounter.encounterGuid) 
            }

            // Overwrites if exists, appends if new
            const updatedSavedEncountersList = updateSavedEncounters(savedEncounters, newEncounter);
            // Setting this list to update the encounter list
            setSavedEncounters(updatedSavedEncountersList)
            setShowSaveMessage(true);
            setTimeout(() => {
                setShowSaveMessage(false);
            }, 800); // Hide the message after 5 seconds
        }
        
    };

    useEffect(() => {
        setSaveMessageColor(showSaveMessage ? "2px solid #08d82b" : "")
    }, [showSaveMessage]);

    const handleAddExtra = (type) => {
        let newDummy = {}
        if(type === "global") {
            newDummy = {
                ...envObject
            }
        } else {
            let url = "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters"
            let beastImg = url + "/beast.jpg"
            let humanImg = url + "/humanoid.jpg"
            newDummy = {
                ...dummyDefault,
                avatarUrl: type === "monster" ? beastImg : humanImg,
                name: type === "monster" ? "Dummy Monster" : "Dummy Player",
                alignment: type === "monster" ? "enemy" : "ally",
                border: type === "monster" ? COLOR_RED : COLOR_GREEN,
                type: type,
                deathSaves: {
                    "failCount": 0,
                    "successCount": 0,
                    "isStabilized": true
                }
            }
        }

        newDummy.creatureGuid = generateUniqueId()
        newDummy.encounterGuid = currentEncounter.encounterGuid;
        
        socket.emit("addCreatureToEncounter", newDummy)

        setCurrentEncounter(prev => ({...prev, creatures: [...prev.creatures, newDummy]}));
    };

    const handleAutoRollInitiative = (event) => {
        event.stopPropagation()
        let initatives = []
        currentEncounter.creatures.forEach(creature => {
            if(creature.type !== "player") {
                let initBonus = creature.dexterity_save ? creature.dexterity_save : 0
                let newInit = Math.floor(Math.random() * 20) + 1 + initBonus
                creature.initiative = newInit
                initatives.push({creatureGuid: creature.creatureGuid, initiative: newInit})
            }
        
        });      

        socket.emit("autoRolledInitiative", initatives);
        setCurrentEncounter(prev => ({...prev, creatures: [...sortCreatureArray(currentEncounter.creatures)]}));
    }   
    
    const handleTurnNums = (action = null, e = null) => {
        let encounterLength = currentEncounter.creatures.length
        if(e) e.stopPropagation();
        let newTurn = null;
        let newRound = null;

        if(action === "next") {
            if(roundNum === 0) {
                newRound = 1
            }

            if(turnNum === encounterLength) {
                newRound = roundNum + 1
                newTurn = 1
            } else {
                newTurn = turnNum + 1
            }

        } else if(action === "prev") {
            let minTurn = 1
            if (roundNum >= 1 || turnNum > minTurn) {
                if(roundNum === 1 && turnNum === 1) {
                    newTurn = 0
                    newRound = 0
                    
                } else if(turnNum === 1) {
                    newRound = roundNum-1
                    newTurn = encounterLength
                    
                } else {
                    newTurn = turnNum - 1
                }
            }
        }

        if(action !== null) {
            if(newRound !== null && newRound !== roundNum) {
                currentEncounter.roundNum = newRound
                setRoundNum(newRound)
                socket.emit("roundNumChange", newRound, currentEncounter.encounterGuid)
            }

            if(newTurn !== null && newTurn !== turnNum) {
                currentEncounter.turnNum = newTurn
                setTurnNum(newTurn)
                socket.emit("turnNumChange", newTurn, currentEncounter.encounterGuid)       
            }

        }

        return {"roundNum": roundNum, "turnNum": turnNum}
    }
 
    const handleUploadMonsterImage = (event, creature) => {
        event.stopPropagation()
        setUploadIconMenu(true)
        setUploadIconCreature(creature)
    }

    return (
        <>
            <div className={`column columnBorder ${showSearchList ? '' : 'expand'}`}>
                <div className='infoContainer'>
                    <EncounterListTopInfo savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} setSavedEncounters={setSavedEncounters} handleSaveEncounter={handleSaveEncounter} handleNewEncounter={handleNewEncounter} saveMessageColor={saveMessageColor} showSaveMessage={showSaveMessage} isSaveDisabled={isSaveDisabled} socket={socket}/>
                    <EncounterControls setNameChange={setNameChange} refreshLoading={refreshLoading} setPlayerViewBackground={setPlayerViewBackground} handleTurnNums={handleTurnNums} handleRefresh={handleRefresh} refreshCheck={refreshCheck} autoRefresh={autoRefresh} currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} handleAutoRollInitiative={handleAutoRollInitiative} socket={socket}/>
                    {currentEncounter.creatures.length ? (
                        <EncounterList currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} handleSaveEncounter={handleSaveEncounter} turnNum={turnNum} handleUploadMonsterImage={handleUploadMonsterImage} setSelectedIndex={setSelectedIndex} clickEncounterCreatureX={clickEncounterCreatureX} socket={socket}/>
                    ) : (
                        <div className='encounterCreaturesNoItemsContainer'> 
                            <div className='encounterCreaturesNoItems'>
                                {savedEncounters?.length ? (
                                    <>
                                        Add a creature or select one of your
                                        <DropdownMenu savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters} handleLoadEncounter={handleLoadEncounter} currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} socket={socket}/> 
                                    </>
                                ) : ( <>Add a creature to create an encounter!</>)}
                            </div>
                        </div>
                    )}
                    <div className='dummyButtons'>
                        <button className='dmViewButton' onClick={() => handleAddExtra('player')}> Add Player </button>
                        <button className='dmViewButton' onClick={() => handleAddExtra('monster')}> Add Dummy </button>
                        <button className='dmViewButton' onClick={() => handleAddExtra('global')}> Add Global Token </button>
                    </div>
                </div>
            </div>
            <div className={`column animated-label ${showSearchList ? '' : 'expand'}`}>
                {selectedIndex !== null ? (
                    <StatBlock selectedIndex={selectedIndex} currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} closeStatBlock={() => setSelectedIndex(null)} socket={socket}/>
                ) : (
                    <>No Encounter Creature Selected</>
                )}
            </div>
            <UploadMonsterImage setCurrentEncounter={setCurrentEncounter} uploadIconMenu={uploadIconMenu} setUploadIconMenu={setUploadIconMenu} uploadIconCreature={uploadIconCreature} socket={socket}/>
        </>
  );
}

export default EncounterColumn;
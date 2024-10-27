import React, { useState, useEffect } from 'react';
import StatBlock from '../StatBlock';
import { generateUniqueId, dummyDefault, envObject, setLocalPlayerViewEncounter, sortCreatureArray, INIT_ENCOUNTER_NAME, COLOR_RED, COLOR_GREEN } from '../../constants';
import EncounterListTopInfo from './EncounterListTopInfo'
import DropdownMenu from './DropdownMenu';
import EncounterControls from './EncounterControls'
import EncounterList from './EncounterList'
import UploadMonsterImage from './UploadMonsterImage'

function addToLocalSavedEncounter(jsonArray, newEncounter) {
    if(jsonArray === null) jsonArray = []
    
    // Find the index of the existing object with the same encounterGuid
    const index = jsonArray.findIndex(item => item['encounterGuid'] === newEncounter['encounterGuid']);

    let saveType = "Saved Changes to Existing - "
    if (index !== -1) {
        // Overwrite the existing object if its found
        // const result = compareObjects(jsonArray[index], newEncounter);
        jsonArray[index] = newEncounter;
    } else {
        // Add the new object to the array if nothing exists already
        saveType = "Saved New Encounter - "
        jsonArray.push(newEncounter);
    }
    localStorage.setItem('savedEncounters', JSON.stringify(jsonArray));

    console.log("%c" + saveType + newEncounter.encounterName + " (" + newEncounter.encounterGuid + ")", "background: #fdfd96;")


    return jsonArray;
}
const EncounterColumn = ({currentEncounter, handleLoadEncounter, refreshLoading, setCurrentEncounter, setPlayerViewBackground, hideEnemies, setCardContainerStyle, hideDeadEnemies, setHideDeadEnemies, enemyBloodToggle, setEnemyBloodToggle, setHideEnemies, savedEncounters, setSavedEncounters, handleRefresh,  refreshCheck, autoRefresh, showSearchList, handleNewEncounter, setEncounterGuid, socket}) => {
    const [roundNum, setRoundNum] = useState(currentEncounter.roundNum);
    const [turnNum, setTurnNum] = useState(currentEncounter.roundNum);

    const [encounterSelectedCreature, setEncounterSelectedCreature] = useState(null);
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
        handleSaveEncounter()
        socket.emit("roundNumChange", roundNum, currentEncounter.encounterGuid)
    }, [roundNum]);

    useEffect(() => {
        handleSaveEncounter()
        socket.emit("turnNumChange", turnNum, currentEncounter.encounterGuid)
    }, [turnNum]);

    useEffect(() => {
        setIsSaveDisabled(currentEncounter.creatures?.length === 0)
    }, [currentEncounter.creatures]);

    const clickEncounterCreatureX = (event, xCreature, index) => {
        event.stopPropagation(); 

        let newArray = currentEncounter.creatures.filter((_, i) => i !== index)
        setCurrentEncounter(prev => ({...prev, creatures: [...newArray]}));

        if(encounterSelectedCreature && xCreature.creatureGuid === encounterSelectedCreature.creatureGuid) {
            setEncounterSelectedCreature(null)
        }

        console.log(xCreature)
        socket.emit("removeCreatureFromEncounter", xCreature.creatureGuid)
    };  

    const handleSaveEncounter = () => {
        if(currentEncounter.encounterName !== INIT_ENCOUNTER_NAME) {
            const savedEncountersList = JSON.parse(localStorage.getItem('savedEncounters')) || [];
            let newEncounter = {
                    encounterName: currentEncounter.encounterName,
                    encounterGuid: currentEncounter.encounterGuid || generateUniqueId(),
                    roundNum: roundNum,
                    turnNum: turnNum,
                    creatures: currentEncounter.creatures
                }
            

            if(newEncounter.encounterGuid !== currentEncounter.encounterGuid) {
                setEncounterGuid(newEncounter.encounterGuid) 
            }
            
            // Overwrites if exists, appends if new
            const updatedSavedEncountersList = addToLocalSavedEncounter(savedEncountersList, newEncounter);
            // Setting this list to update the encounter list
            setSavedEncounters(updatedSavedEncountersList)
            setShowSaveMessage(true);
            setLocalPlayerViewEncounter(newEncounter)
            setTimeout(() => {
                setShowSaveMessage(false);
            }, 800); // Hide the message after 5 seconds
        }
        
    };

    const handleStartEncounter = (event) => {
        setLocalPlayerViewEncounter(currentEncounter)
        // socket.emit("startEncounter")
        let url = window.location.href;
        // Add '/' if needed
        url += url.endsWith("/") ? "" : "/";
        window.open(`${url}playerView`, '_blank');
        event.stopPropagation(); 
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
            let initBonus = creature.dexterity_save ? creature.dexterity_save : 0
            creature.initiative = Math.floor(Math.random() * 20) + 1 + initBonus
            initatives.push({creatureGuid: creature.creatureGuid, initiative: creature.initative})
        });      

        // socket.emit("autoRolledInitiative", initatives);
        setCurrentEncounter(prev => ({...prev, creatures: [...sortCreatureArray(currentEncounter.creatures)]}));
    }   
    
    const handleTurnNums = (action = null, e = null) => {
        let encounterLength = currentEncounter.creatures.length
        if(e) e.stopPropagation();
        if(action === "next") {
            setTurnNum(prevTurn => {
                if(roundNum === 0) {
                    setRoundNum(1)
                }

                if(prevTurn === encounterLength) {
                    setRoundNum(prevRound => prevRound+1)
                    return 1;
                }

                return prevTurn+1
            })
        } else if(action === "prev") {
            let minTurn = 1
            if (roundNum >= 1 || turnNum > minTurn) {
                setTurnNum(() => {
                    if(roundNum === 1 && turnNum === 1) {
                        setRoundNum(prevRound => prevRound-1)
                        return turnNum-1
                    }

                    if(turnNum === minTurn) {
                        setRoundNum(prevRound => prevRound-1)
                        return encounterLength;
                    }

                    return turnNum-1

                })
            }
            
        }
        return {"roundNum": roundNum, "turnNum": turnNum}
    }
 
    const handleUploadMonsterImage = (creature) => {
        setUploadIconMenu(true)
        setUploadIconCreature(creature)
    }

    return (
        <>
            <div className={`column columnBorder ${showSearchList ? '' : 'expand'}`}>
                <div className='infoContainer'>
                    <EncounterListTopInfo savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} encounterName={currentEncounter.encounterName} currentEncounter={currentEncounter} setSavedEncounters={setSavedEncounters} handleSaveEncounter={handleSaveEncounter} handleNewEncounter={handleNewEncounter} saveMessageColor={saveMessageColor} showSaveMessage={showSaveMessage} isSaveDisabled={isSaveDisabled} socket={socket}/>
                    <EncounterControls setNameChange={setNameChange} refreshLoading={refreshLoading} setPlayerViewBackground={setPlayerViewBackground} setCardContainerStyle={setCardContainerStyle} handleTurnNums={handleTurnNums} hideDeadEnemies={hideDeadEnemies} setHideDeadEnemies={setHideDeadEnemies} enemyBloodToggle={enemyBloodToggle} setEnemyBloodToggle={setEnemyBloodToggle} hideEnemies={hideEnemies} setHideEnemies={setHideEnemies} handleRefresh={handleRefresh} refreshCheck={refreshCheck} autoRefresh={autoRefresh} currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} handleStartEncounter={handleStartEncounter} handleAutoRollInitiative={handleAutoRollInitiative} socket={socket}/>
                    {currentEncounter.creatures.length ? (
                        <EncounterList currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} handleSaveEncounter={handleSaveEncounter} turnNum={turnNum} handleUploadMonsterImage={handleUploadMonsterImage} encounterSelectedCreature={encounterSelectedCreature} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX} socket={socket}/>
                    ) : (
                        <div className='encounterCreaturesNoItemsContainer'> 
                            <div className='encounterCreaturesNoItems'>
                                {savedEncounters?.length ? (
                                    <>
                                        Add a creature or select one of your
                                        <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} encounterName={currentEncounter.encounterName} currentEncounter={currentEncounter}/> 
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
                {encounterSelectedCreature ? (
                    <StatBlock creature={encounterSelectedCreature} img={encounterSelectedCreature.avatarUrl} closeFunction={() => setEncounterSelectedCreature(false)}/>
                ) : (
                    <>No Encounter Creature Selected</>
                )}
            </div>
            <UploadMonsterImage setCurrentEncounter={setCurrentEncounter} uploadIconMenu={uploadIconMenu} setUploadIconMenu={setUploadIconMenu} uploadIconCreature={uploadIconCreature} creatures={currentEncounter.creatures} />
        </>
  );
}

export default EncounterColumn;
import React, { useState, useRef, useEffect } from 'react';
import StatBlock from './StatBlock';
import { generateUniqueId, dummyOpen5e, envObject, setLocalPlayerViewEncounter, sortCreatureArray, INIT_ENCOUNTER_NAME, INIT_ENCOUNTER } from '../constants';
import GlobalImg from '../pics/global.png'
import EncounterListTopInfo from './EncounterListTopInfo'
import DropdownMenu from './DropdownMenu';
import EncounterListTitleEdit from './EncounterListTitleEdit'
import EncounterListTitle from './EncounterListTitle'
import EncounterList from './EncounterList'
import UploadMonsterImage from './UploadMonsterImage'

function addToLocalSavedEncounter(jsonArray, newJsonObject) {
    if(jsonArray === null) {
        jsonArray = []
    }
    
    // Find the index of the existing object with the same encounter id
    const index = jsonArray.findIndex(item => item['id'] === newJsonObject['id']);

    if (index !== -1) {
        // Overwrite the existing object
        console.log("Overwriting:", newJsonObject.encounterName)
        jsonArray[index] = newJsonObject;
    } else {
        // Add the new object to the array
        console.log("New Encounter:", newJsonObject.encounterName)
        jsonArray.push(newJsonObject);
    }
    localStorage.setItem('savedEncounters', JSON.stringify(jsonArray));

    return jsonArray;
}
const EncounterColumn = ({currentEncounter, setCurrentEncounter, localSavedEncounters, showSearchList}) => {
    console.log("EncounterColumn", currentEncounter)

    const [encounterId, setEncounterId] = useState(currentEncounter.id);
    const [encounterName, setEncounterName] = useState(currentEncounter.encounterName);
    const [lastEncounterName, setLastEncounterName] = useState(currentEncounter.encounterName);
    const [roundNum, setRoundNum] = useState(currentEncounter.roundNum);
    const [turnNum, setTurnNum] = useState(currentEncounter.roundNum);

    const [encounterSelectedCreature, setEncounterSelectedCreature] = useState(null);
    const [showEncounterTitleEdit, setShowEncounterTitleEdit] = useState(false);
    const [savedEncounters, setSavedEncounters] = useState(localSavedEncounters);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [saveMessageColor, setSaveMessageColor] = useState("");
    const [isSaveDisabled, setIsSaveDisabled] = useState(currentEncounter.currentEncounterCreatures.length === 0);
    const [uploadIconMenu, setUploadIconMenu] = useState(false);
    const [uploadIconCreature, setUploadIconCreature] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if(currentEncounter.encounterName !== encounterName) {
            console.log("Name change", currentEncounter.encounterName)
            setEncounterName(currentEncounter.encounterName)
        }
    }, [currentEncounter.encounterName]);

    useEffect(() => {
        setSavedEncounters(localSavedEncounters)
    }, [localSavedEncounters]);

    useEffect(() => {
        if(encounterName !== INIT_ENCOUNTER_NAME) {
            handleSaveEncounter()
        }
        // eslint-disable-next-line
    }, [turnNum]);

    // useEffect(() => {
    //     setIsSaveDisabled(currentEncounterCreatures?.length === 0)
    // }, [currentEncounterCreatures]);

    const clickEncounterCreatureX = (event, creatureName, index) => {
        event.stopPropagation(); 

        let newArray = currentEncounter.currentEncounterCreatures.filter((_, i) => i !== index)
        setCurrentEncounter(prev => ({...prev, currentEncounterCreatures: [...newArray]}));

        if(encounterSelectedCreature && creatureName === encounterSelectedCreature.name) {
            setEncounterSelectedCreature(null)
        }        

    };

    const handleLoadEncounter = (encounter) => {
        console.warn("Loaded:", encounter.encounterName)
        setCurrentEncounter(encounter)
    };    
    
    const handleNewEncounter = () => {
        console.warn("New Encounter")
        setCurrentEncounter(INIT_ENCOUNTER)
    };

    const handleSaveEncounter = () => {
       
        if(encounterName !== INIT_ENCOUNTER_NAME) {

            const savedEncountersList = JSON.parse(localStorage.getItem('savedEncounters')) || [];
            let newEncounter = {
                    encounterName: encounterName,
                    id: encounterId || generateUniqueId(),
                    roundNum: roundNum,
                    turnNum: turnNum,
                    currentEncounterCreatures: currentEncounter.currentEncounterCreatures
                }
            console.log("Saving encounterId: (", newEncounter.id, encounterName, ")")

            setLocalPlayerViewEncounter(newEncounter)
            setEncounterId(newEncounter.id)
            // Overwrites if exists, appends if new
            const updatedSavedEncountersList = addToLocalSavedEncounter(savedEncountersList, newEncounter);
            // Setting this list to update the encounter list
            setSavedEncounters(updatedSavedEncountersList)
            setShowSaveMessage(true);
            setTimeout(() => {
                setShowSaveMessage(false);
            }, 800); // Hide the message after 5 seconds
        }
        
    };

    const handleCloseEditBox = (type) => {
        setShowEncounterTitleEdit(false)

        if(type === "save") {
            handleSaveEncounter()
            setLastEncounterName(encounterName)
        }
        else if(type === "close") {
            setEncounterName(lastEncounterName)
        }
    };    

    const handleStartEncounter = (event) => {
        let url = window.location.href;
        // Add '/' if needed
        url += url.endsWith("/") ? "" : "/";

        window.open(`${url}playerView`, '_blank');
        savedEncounters.forEach(e => {
            if(e.encounterName === encounterName) {
                setLocalPlayerViewEncounter(e)
            }
        });
        event.stopPropagation(); 
    };

    useEffect(() => {
        setSaveMessageColor(showSaveMessage ? "2px solid #08d82b" : "")
    }, [showSaveMessage]);

    const handleAddExtra = (type) => {
        const dummyObj = {
            id: "open5e-" + type,
            type: type,
            avatarUrl: GlobalImg,
            name: "Environment/Lair",
            guid: generateUniqueId(),
            open5e: {hit_points: 0, initiative: 0}
            
        }

        if(type === "monster" || type === "player") {
            if(type === "player") {
                dummyObj.avatarUrl = "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg"
                dummyObj.name = "Player"
                dummyObj.deathSaves = {
                    "failCount": 0,
                    "successCount": 0,
                    "isStabilized": true
                }
            }

            if(type === "monster") {
                dummyObj.avatarUrl = "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/beast.jpg"
                dummyObj.name = "monster"
            }

            dummyObj.open5e = {
                ...dummyOpen5e,
                name: dummyObj.name,
                hit_points: 20, 
                armor_class: 10, 
                hit_points_current: 20,
                hit_points_default: 20,
                hit_points_override: 0,
                hit_points_temp: 0,
            }
        
        } else {
            dummyObj.open5e = {
                ...envObject,
                name: "Environment/Lair",
                hit_points: 0, 
                armor_class: 0, 
                hit_points_current: 0,
                hit_points_default: 0,
                hit_points_override: 0,
                hit_points_temp: 0,
            }
        }

        setCurrentEncounter(prev => ({...prev, currentEncounterCreatures: [...prev.currentEncounterCreatures, dummyObj]}));
    };

    const handleAutoRollInitiative = (event) => {
        event.stopPropagation()
        console.log("Auto Roll")
        currentEncounter.currentEncounterCreatures.forEach(creature => {
            creature.initiative = Math.floor(Math.random() * 20) + 1 + creature.dexterity_save
            console.log(creature.initiative, creature.dexterity_save, creature)
        });      
        
        setCurrentEncounter(prev => ({...prev, currentEncounterCreatures: [...sortCreatureArray(currentEncounter.currentEncounterCreatures)]}));
    }   
    
    const handleTurnNums = (action = null, e = null) => {
        let encounterLength = currentEncounter.currentEncounterCreatures.length
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
                    <EncounterListTopInfo savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounter={currentEncounter} setSavedEncounters={setSavedEncounters} handleSaveEncounter={handleSaveEncounter} handleNewEncounter={handleNewEncounter} saveMessageColor={saveMessageColor} showSaveMessage={showSaveMessage} isSaveDisabled={isSaveDisabled}/>
                    <div className='encounterTitleContainer'>
                        <EncounterListTitle setShowEncounterTitleEdit={setShowEncounterTitleEdit} handleTurnNums={handleTurnNums} encounterName={encounterName} setEncounterName={setEncounterName} currentEncounter={currentEncounter} handleStartEncounter={handleStartEncounter} handleAutoRollInitiative={handleAutoRollInitiative}/>
                    </div>
                    {currentEncounter.currentEncounterCreatures.length ? (
                        <EncounterList currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} handleSaveEncounter={handleSaveEncounter} turnNum={turnNum} handleUploadMonsterImage={handleUploadMonsterImage} encounterSelectedCreature={encounterSelectedCreature} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX} />
                    ) : (
                        <div className='encounterCreaturesNoItemsContainer'> 
                            <div className='encounterCreaturesNoItems'>
                                {savedEncounters?.length ? (
                                    <>
                                        Add a creature or select on of your
                                        <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounter={currentEncounter}/> 
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

            {/* <UploadMonsterImage handleSaveEncounter={handleSaveEncounter} uploadIconMenu={uploadIconMenu} setUploadIconMenu={setUploadIconMenu} uploadIconCreature={uploadIconCreature} currentEncounterCreatures={currentEncounter.currentEncounterCreatures} /> */}
        </>
  );
}

export default EncounterColumn;
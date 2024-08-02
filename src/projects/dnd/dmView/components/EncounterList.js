import React, { useState, useRef, useEffect } from 'react';
import StatBlock from './StatBlock';
import DropdownMenu from './DropdownMenu';

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function updateJsonArray(jsonArray, newJsonObject) {
    if(!('id' in newJsonObject))
        newJsonObject.id = generateUniqueId();

    if(jsonArray === null) {
        jsonArray = []
    }
    // Find the index of the existing object with the same encounter name
    const index = jsonArray.findIndex(item => item['id'] === newJsonObject['id']);

    if (index !== -1) {
        // Overwrite the existing object
        jsonArray[index] = newJsonObject;
    } else {
        // Add the new object to the array
        jsonArray.push(newJsonObject);
    }
  
    return jsonArray;
}

const EncounterList = ({currentEncounterCreatures, setCurrentEncounterCreatures}) => {
    const [encounterId, setEncounterId] = useState(null);
    const [encounterSelectedCreature, setEncounterSelectedCreature] = useState(null);
    const [encounterName, setEncounterName] = useState('Name Your Encounter');
    const [lastEncounterName, setLastEncounterName] = useState(encounterName);
    const [showEncounterTitleEdit, setShowEncounterTitleEdit] = useState(false);
    const [savedEncounters, setSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')));
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [saveMessageColor, setSaveMessageColor] = useState("");
    const [isSaveDisabled, setIsSaveDisabled] = useState(currentEncounterCreatures?.length === 0);
    const inputRef = useRef(null);

    useEffect(() => {
        setIsSaveDisabled(currentEncounterCreatures?.length === 0)
    }, [currentEncounterCreatures]);

    const handleEditTitleChange = (e) => {
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    const clickEncounterCreatureX = (event, creatureName, index) => {
        // Dont click allow parent to be clicked aswell
        event.stopPropagation(); 

        // Remove creature from Encounter list

        let newArray = currentEncounterCreatures.filter((_, i) => i !== index)
        setCurrentEncounterCreatures([...newArray]);

        if(encounterSelectedCreature && creatureName === encounterSelectedCreature.name) {
            // Remove Encounter Selection if its of removed creature
            handleEncounterSelectCreature(null)
        }        

    };

    // Sets the selected creature in encounter list on right
    const handleEncounterSelectCreature = (creature) => {
        setEncounterSelectedCreature(creature);
    };

    const handleLoadEncounter = (encounter) => {
        console.log("handleLoadEncounter", encounter)
        setCurrentEncounterCreatures(encounter.currentEncounterCreatures)
        setEncounterName(encounter.encounterName)
        setEncounterId(encounter.id)
        setLastEncounterName(encounter.encounterName)
        setIsSaveDisabled(false)

    };    
    
    const handleNewEncounter = () => {
        setCurrentEncounterCreatures([])
        setEncounterName("Name Your Encounter")
        setEncounterId(null)
        setLastEncounterName("Name Your Encounter")
        setIsSaveDisabled(true)
    };

    const handleSaveEncounter = () => {
        const savedEncountersList = JSON.parse(localStorage.getItem('savedEncounters')) || [];
        let newEncounter = {encounterName: encounterName, id: encounterId, currentEncounterCreatures: currentEncounterCreatures}
        const updatedSavedEncountersList = updateJsonArray(savedEncountersList, newEncounter);
        // Setting this list to update the encounter list
        setSavedEncounters(updatedSavedEncountersList)
        localStorage.setItem('savedEncounters', JSON.stringify(updatedSavedEncountersList));
        // Saving to local storage under the name savedEncounters
        
        setShowSaveMessage(true);
        setTimeout(() => {
          setShowSaveMessage(false);
        }, 800); // Hide the message after 5 seconds
    };

    const handleEncounterNameEdit = () => {
        setShowEncounterTitleEdit(true)
    };    
    
    const handleCloseEditBox = (type) => {
        setShowEncounterTitleEdit(false)

        if(type === "save") {
            console.log("save")
            handleSaveEncounter()
            setLastEncounterName(encounterName)
        }
        if(type === "close") {
            setEncounterName(lastEncounterName)
            console.log("no save")

        }
    };

    const handleStartEncounter = (event) => {
        console.log("play")
        console.log(savedEncounters)

        const currentUrl = window.location.href;

        window.open(`${currentUrl}playerView`, '_blank');
        event.stopPropagation(); 
        savedEncounters.forEach(e => {
            if(e.encounterName === encounterName) {
                console.log("SETTING " + encounterName + " in LOCAL STORAGE")
                console.log(e)
                localStorage.setItem('savedCurrentEncounter', JSON.stringify(e));
            }
        });

    };
   
    let titleColor = ''
    if (encounterName === 'Name Your Encounter')
        titleColor = 'grey'

    useEffect(() => {
        setSaveMessageColor(showSaveMessage ? "#08d82b" : "")
    }, [showSaveMessage]);

    return (
        <>
            <div className='column columnBorder'>
                <div className='infoContainer'>

                    <h3 className='titleFontFamily'>Create Encounter</h3>
                    <div className='dmViewButtonContainer'>
                        <button className='dmViewButton' onClick={handleSaveEncounter} disabled={isSaveDisabled} style={{backgroundColor: saveMessageColor}}>  {showSaveMessage ? <>Encounter Saved!</> : <>Save Encounter</>} </button>
                        <button className='dmViewButton' onClick={handleNewEncounter} >  New Encounter </button>
                        <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures}/>
                    </div>

                    <div className='encounterTitleContainer'>
                        {showEncounterTitleEdit ? ( 
                            <>                            
                                <label className='titleLabel animated-label' htmlFor="titleEdit" >Name Your Encounter</label>
                                <div name="titleEdit" className='encounterTitleEditContainer'>
                                    <input
                                        ref={inputRef}
                                        className='encounterTitleEditInput'
                                        type="text"
                                        value={encounterName === 'Name Your Encounter' ? '' : encounterName}
                                        onChange={handleEditTitleChange}
                                        autoFocus
                                    />
                                    <button className='submitButton' onClick={() => handleCloseEditBox("save")}>✅</button>
                                    <button className='submitButton' onClick={() => handleCloseEditBox("close")}>❌</button>
                                </div>
                            </>
                        ) : (
                            <div className='encounterTitleEditContainer animated-label' onClick={handleEncounterNameEdit}>                     
                                <div className='encounterTitle'><strong style={{color: titleColor}}>{encounterName}</strong></div>
                                <div className='encounterTitleEdit'>🖉</div>
                                {currentEncounterCreatures.length > 0 &&                                 
                                    <button className='dmViewButton' onClick={handleStartEncounter} >Play</button>
                                }
                            </div>
                            
                        )}
                    </div>
                        {currentEncounterCreatures.length ? (
                            <ul className='encounterCreaturesList'>
                                {currentEncounterCreatures.map((creature, index) => (
                                    <li className='encounterCreaturesListItem animated-box'
                                        key={creature.guid+index} // Add index so it forces a re render
                                        onClick={() => handleEncounterSelectCreature(creature)}
                                    >
                                        <img className="monsterSearchIcon" src={creature.avatarUrl} alt={"list Icon"} />
                                        {creature.name},
                                        {creature.open5e && 
                                            <>
                                                <div className='encounterCreaturesHp'>
                                                    {creature.open5e.hit_points}
                                                    <span>/</span>
                                                    {creature.open5e.hit_points},
                                                </div>
                                                {creature.open5e.armor_class}
                                            </>
                                        }
                                        
                                        <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                                        X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className='encounterCreaturesNoItemsContainer'> 
                                <div className='encounterCreaturesNoItems'>
                                    {savedEncounters?.length ? (
                                        <>
                                            Add a creature or select on of your
                                            <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures}/> 
                                        </>
                                    ) : ( <>Add a creature to create an encounter!</>)}
                                </div>
                            </div>
                            
                        )}
                        
                </div>
            </div>
            {encounterSelectedCreature ? (
                <div className='column animated-box'>
                    <StatBlock creature={encounterSelectedCreature.open5e} img={encounterSelectedCreature.avatarUrl} closeFunction={() => setEncounterSelectedCreature(false)}/>
                </div>

            ) : 
                <div> No Encounter Creature Selected </div>
            }
        </>
  );
}

export default EncounterList;
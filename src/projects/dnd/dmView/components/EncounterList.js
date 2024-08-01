import React, { useState, useRef, useEffect } from 'react';
import StatBlock from './StatBlock';
import DropdownMenu from './DropdownMenu';

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function updateJsonArray(jsonArray, newJsonObject) {
    if(jsonArray === null) {
        jsonArray = []
    }
    // Find the index of the existing object with the same encounter name
    const index = jsonArray.findIndex(item => item['id'] === newJsonObject['id']);

    if (index !== -1) {
        // Overwrite the existing object
        jsonArray[index] = newJsonObject;
    } else {
        newJsonObject.id = generateUniqueId();
        // Add the new object to the array
        jsonArray.push(newJsonObject);
    }
  
    return jsonArray;
}

const EncounterList = ({currentEncounterCreatures, setCurrentEncounterCreatures}) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [encounterId, setEncounterId] = useState(null);
    const [encounterSelectedCreature, setEncounterSelectedCreature] = useState(null);
    const [encounterName, setEncounterName] = useState('Name Your Encounter');
    const [lastEncounterName, setLastEncounterName] = useState(encounterName);
    const [showEncounterTitleEdit, setShowEncounterTitleEdit] = useState(false);
    const [savedEncounters, setSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')));
    const [inputValue, setInputValue] = useState(encounterName);
    const [isDisabled, setIsDisabled] = useState(currentEncounterCreatures?.length === 0);
    const inputRef = useRef(null);

    useEffect(() => {
        setIsDisabled(currentEncounterCreatures?.length === 0)
      }, [currentEncounterCreatures]);

    const handleEditTitleChange = (e) => {
        setInputValue(e.target.value);
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    const encounterCreatureX = useRef(null);
    const clickEncounterCreatureX = (event, creatureName, index) => {
        // Dont click allow parent to be clicked aswell
        event.stopPropagation(); 

        // Remove creature from Encounter list
        setCurrentEncounterCreatures(prev =>
            prev.filter((_, i) => i !== index)
        );

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
        setIsDisabled(false)
    };

    const handleSaveEncounter = () => {
        const savedEncountersList = JSON.parse(localStorage.getItem('savedEncounters')) || [];
        let newEncounter = {encounterName: encounterName, id: encounterId, currentEncounterCreatures: currentEncounterCreatures}
        const updatedSavedEncountersList = updateJsonArray(savedEncountersList, newEncounter);
        // Setting this list to update the encounter list
        setSavedEncounters(updatedSavedEncountersList)
        // Saving to local storage under the name savedEncounters
        localStorage.setItem('savedEncounters', JSON.stringify(updatedSavedEncountersList));
        
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
   
    console.log("!!")
    console.log(inputValue)

    let titleColor = ''
    if (encounterName === 'Name Your Encounter')
        titleColor = 'grey'

    return (
        <>
            <div className='column columnBorder'>
                <div className='infoContainer'>

                    <h3 className='titleFontFamily'>Create Encounter</h3>
                    <div className='dmViewButtonContainer'>
                        <button className='dmViewButton' onClick={handleSaveEncounter} disabled={isDisabled}> Save Encounter </button>
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
                            </div>
                        )}
                    </div>

                        {currentEncounterCreatures.length ? (
                            <ul className='encounterCreaturesList'>
                                {currentEncounterCreatures.map((creature, index) => (
                                    <li className='encounterCreaturesListItem animated-box'
                                        key={index+creature.name}
                                        onMouseEnter={() => setHoveredIndex(index+creature.name)}
                                        onMouseLeave={() => setHoveredIndex(null)}
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
                                        
                                        {hoveredIndex === index+creature.name && ( 
                                            <button className='encounterCreatureX' ref={encounterCreatureX} onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                                            X
                                            </button>
                                        )}
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
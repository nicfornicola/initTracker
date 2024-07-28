import React, { useState, useRef } from 'react';
import StatBlock from './StatBlock';
import DelayedInput from './DelayedInput';
import DropdownMenu from './DropdownMenu';

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function updateJsonArray(jsonArray, newJsonObject) {

    if(jsonArray === null) {
        jsonArray = []
    }
    console.log(jsonArray, newJsonObject)
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
    const [encounterName, setEncounterName] = useState('New Encounter');
    const [lastEncounterName, setLastEncounterName] = useState(encounterName);
    const [showEncounterTitleEdit, setShowEncounterTitleEdit] = useState(false);
    const [savedEncounters, setSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')));

    const encounterCreatureX = useRef(null);
    console.log("!!",  currentEncounterCreatures)
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
    };

    const handleSaveEncounter = () => {
        const savedEncountersList = JSON.parse(localStorage.getItem('savedEncounters'));
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

   
    return (
        <>
            <div className='column'>
                <button onClick={handleSaveEncounter}> Save Encounter </button>
                <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures}/>
                <h3>Create Encounter</h3>
                {showEncounterTitleEdit ? ( 
                    <>
                        <DelayedInput encounterName={encounterName} setEncounterName={setEncounterName} lastEncounterName={lastEncounterName} setLastEncounterName={setLastEncounterName}/>
                        <button onClick={() => handleCloseEditBox("save")}>✅</button>
                        <button onClick={() => handleCloseEditBox("close")}>❌</button>
                    </>
                ) : (
                    <>                     
                        <div className='encounterTitle'>{encounterName}</div><div className='encounterTitleEdit' onClick={handleEncounterNameEdit}>✎</div>
                    </>                     
                )}

                <ul style={{padding: 0 }}>
                    {currentEncounterCreatures.length ? (
                        <>
                            {currentEncounterCreatures.map((creature, index) => (
                                <li className='encounterCreaturesListItem'
                                    key={index+creature.name}
                                    onMouseEnter={() => setHoveredIndex(index)}
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
                                    
                                    {hoveredIndex === index && ( 
                                        <button className='encounterCreatureX' ref={encounterCreatureX} onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                                        X
                                        </button>
                                    )}
                                </li>
                            ))}
                        </>
                    ) : (
                        <>
                            <li className='encounterCreaturesListItem'
                                key={"key"}
                                onMouseEnter={() => setHoveredIndex(0)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                Add a creature or select from your                 <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures}/> 
                            </li>
                        </>
                    )}
                    
                </ul>
            </div>
            <div className='column'>
                {encounterSelectedCreature ? (
                    <div>
                        <StatBlock creature={encounterSelectedCreature.open5e} img={encounterSelectedCreature.avatarUrl}/>
                    </div>
                ) : 
                    <div> No Encounter Creature Selected </div>
                }
            </div>


        </>
  );
}

export default EncounterList;
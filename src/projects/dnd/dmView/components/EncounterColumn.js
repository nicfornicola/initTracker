import React, { useState, useRef, useEffect } from 'react';
import StatBlock from './StatBlock';
import { generateUniqueId, dummyOpen5e, envObject } from '../constants';
import GlobalImg from '../pics/global.png'
import EncounterListTopInfo from './EncounterListTopInfo'
import DropdownMenu from './DropdownMenu';
import EncounterListTitleEdit from './EncounterListTitleEdit'
import EncounterListTitle from './EncounterListTitle'
import EncounterList from './EncounterList'

function addToLocalSavedEncounter(jsonArray, newJsonObject) {

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
    localStorage.setItem('savedEncounters', JSON.stringify(jsonArray));

    return jsonArray;
}

function setLocalPlayerViewEncounter(encounter) {
    localStorage.setItem('playerViewEncounter', JSON.stringify(encounter));
}

const EncounterColumn = ({currentEncounterCreatures, setCurrentEncounterCreatures}) => {
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
        event.stopPropagation(); 

        let newArray = currentEncounterCreatures.filter((_, i) => i !== index)
        setCurrentEncounterCreatures([...newArray]);

        if(encounterSelectedCreature && creatureName === encounterSelectedCreature.name) {
            setEncounterSelectedCreature(null)
        }        

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
        let newEncounter = {encounterName: encounterName, id: encounterId || generateUniqueId(), currentEncounterCreatures: currentEncounterCreatures}
        setLocalPlayerViewEncounter(newEncounter)
        setEncounterId(newEncounter.id)
        const updatedSavedEncountersList = addToLocalSavedEncounter(savedEncountersList, newEncounter);
        // Setting this list to update the encounter list
        setSavedEncounters(updatedSavedEncountersList)
        setShowSaveMessage(true);
        setTimeout(() => {
            setShowSaveMessage(false);
        }, 800); // Hide the message after 5 seconds
    };

    const handleCloseEditBox = (type) => {
        setShowEncounterTitleEdit(false)

        if(type === "save") {
            console.log("save")
            handleSaveEncounter()
            setLastEncounterName(encounterName)
        }
        else if(type === "close") {
            setEncounterName(lastEncounterName)
            console.log("no save")
        }
    };    

    const handleStartEncounter = (event) => {
        let url = window.location.href;
        // Add '/' if needed
        url += url.endsWith("/") ? "" : "/";

        window.open(`${url}playerView`, '_blank');
        savedEncounters.forEach(e => {
            if(e.encounterName === encounterName) {
                console.log("SETTING " + encounterName + " in LOCAL STORAGE")
                setLocalPlayerViewEncounter(e)
            }
        });
        event.stopPropagation(); 
    };
   
    let titleColor = ''
    if (encounterName === 'Name Your Encounter')
        titleColor = 'grey'

    useEffect(() => {
        setSaveMessageColor(showSaveMessage ? "#08d82b" : "")
    }, [showSaveMessage]);

    const handleAddExtra = (type) => {
        console.log("adding extra", type)

        const dummyObj = {
            id: "open5e-" + type,
            avatarUrl: GlobalImg,
            name: "Environment/Lair",
            guid: generateUniqueId(),
            open5e: {hit_points: 0, initiative: 0}
            
        }

        if(type === "dummy") {
            dummyObj.avatarUrl = "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/beast.jpg"
            dummyObj.name = "Dummy"
            dummyObj.open5e = {
                name: "Dummy",
                hit_points: 20, 
                armor_class: 10, 
                hit_points_current: 20,
                hit_points_default: 20,
                hit_points_override: 0,
                hit_points_temp: 0,
                ...dummyOpen5e
            }
            console.log(dummyObj)
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

        setCurrentEncounterCreatures(prev => [...prev, dummyObj]);
    };

    const handleAutoRollInitiative = (event) => {
        event.stopPropagation()
        currentEncounterCreatures.forEach(creature => {
            creature.open5e.initiative = Math.floor(Math.random() * 20) + 1 + creature.open5e.dexterity_save
        });

        currentEncounterCreatures.sort((a, b) =>  b.open5e.initiative - a.open5e.initiative);
        setCurrentEncounterCreatures([...currentEncounterCreatures]);

    }

    return (
        <>
            <div className='column columnBorder'>
                <div className='infoContainer'>
                    <EncounterListTopInfo savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures} setSavedEncounters={setSavedEncounters} handleSaveEncounter={handleSaveEncounter} handleNewEncounter={handleNewEncounter} saveMessageColor={saveMessageColor} showSaveMessage={showSaveMessage} isSaveDisabled={isSaveDisabled}/>
                    <div className='encounterTitleContainer'>
                        {showEncounterTitleEdit ? ( 
                            <EncounterListTitleEdit inputRef={inputRef} encounterName={encounterName} handleEditTitleChange={handleEditTitleChange} handleCloseEditBox={handleCloseEditBox}/>
                        ) : (
                            <EncounterListTitle setShowEncounterTitleEdit={setShowEncounterTitleEdit} titleColor={titleColor} encounterName={encounterName} currentEncounterCreatures={currentEncounterCreatures} handleStartEncounter={handleStartEncounter} handleAutoRollInitiative={handleAutoRollInitiative}/>
                        )}
                    </div>
                    {currentEncounterCreatures.length ? (
                        <EncounterList handleSaveEncounter={handleSaveEncounter} setCurrentEncounterCreatures={setCurrentEncounterCreatures} currentEncounterCreatures={currentEncounterCreatures} encounterSelectedCreature={encounterSelectedCreature} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX} />
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
                    <div className='dummyButtons'>
                        <button className='dmViewButton' onClick={() => handleAddExtra('dummy')} >  Add Dummy </button>
                        <button className='dmViewButton' onClick={() => handleAddExtra('global')} >  Add Global Token </button>
                    </div>
                </div>
                
            </div>
            {encounterSelectedCreature  ? (
                <div className='column animated-box'>
                    <StatBlock creature={encounterSelectedCreature.open5e} img={encounterSelectedCreature.avatarUrl} closeFunction={() => setEncounterSelectedCreature(false)}/>
                </div>
            ) : (
                <div> No Encounter Creature Selected </div>
            )}
        </>
  );
}

export default EncounterColumn;
import React, { useState, useRef, useEffect } from 'react';
import StatBlock from './StatBlock';
import DropdownMenu from './DropdownMenu';
import { generateUniqueId } from '../constants';
import GlobalImg from '../pics/global.png'

function addToLocalSavedEncounter(jsonArray, newJsonObject) {
    if(!('id' in newJsonObject) || newJsonObject.id === null)
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
    localStorage.setItem('savedEncounters', JSON.stringify(jsonArray));

    return jsonArray;
}

function setLocalPlayerViewEncounter(encounter) {
    localStorage.setItem('playerViewEncounter', JSON.stringify(encounter));
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
        let newEncounter = {encounterName: encounterName, id: encounterId, currentEncounterCreatures: currentEncounterCreatures}
        setLocalPlayerViewEncounter(newEncounter)
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
    const clickEncounterDropdownMenuX = (event, encounter) => {
       console.log("XCLICKED on " + encounter.encounterName)
       event.stopPropagation();
    };

    const handleStartEncounter = (event) => {

        console.log("play")

        let currentUrl = window.location.href;
        if(!currentUrl.endsWith("/")) {
            currentUrl += "/"
        }

        window.open(`${currentUrl}playerView`, '_blank');
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
        console.log("adding extra")

        const dummyObj = {
            id: "open5e-" + type,
            avatarUrl: GlobalImg,
            name: "Environment/Lair",
            guid: generateUniqueId(),
            open5e: {hit_points: null}
        }

        if(type === "dummy") {
            dummyObj.avatarUrl = "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/beast.jpg"
            dummyObj.name = "Dummy"
            dummyObj.open5e = {hit_points: 0, armor_class: 10}

        }

        setCurrentEncounterCreatures(prev => [...prev, dummyObj]);
    };

    return (
        <>
            <div className='column columnBorder'>
                <div className='infoContainer'>
                    <div className='creatEncounterTopInfo'>
                        <h3 className='titleFontFamily'>Create Encounter</h3>
                        <div className='dmViewButtonContainer'>
                            <DropdownMenu savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} lastEncounterName={lastEncounterName} currentEncounterCreatures={currentEncounterCreatures} clickEncounterDropdownMenuX={clickEncounterDropdownMenuX}/>
                            <button className='dmViewButton' onClick={handleSaveEncounter} disabled={isSaveDisabled} style={{backgroundColor: saveMessageColor}}>  {showSaveMessage ? <>Encounter Saved!</> : <>Save Encounter</>} </button>
                            <button className='dmViewButton' onClick={handleNewEncounter} >  New Encounter </button>
                        </div>
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
                            <div className='encounterTitleEditContainer animated-label' onClick={() => setShowEncounterTitleEdit(true)}>                     
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
                                key={creature.guid + index} // Add index so it forces a re render
                                onClick={() => setEncounterSelectedCreature(creature)}
                            >
                                <img className="monsterSearchIcon" src={creature.avatarUrl} alt={"list Icon"} />
                                <span>{creature.name}</span>
                                {creature.open5e.hit_points !== null  ? 
                                    <>
                                        <div className='encounterCreaturesHp'>
                                            {creature.open5e.hit_points}
                                            <span>/</span>
                                            {creature.open5e.hit_points}
                                        </div>
                                        <span>{creature.open5e.armor_class}</span>
                                    </>
                                :
                                    <div className='encounterCreaturesHp'/>
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
                    <div className='dmViewButtonContainer'>
                        <button className='dmViewButton' onClick={() => handleAddExtra('dummy')} >  Add Dummy </button>
                        <button className='dmViewButton' onClick={() => handleAddExtra('global')} >  Add Global Token </button>
                    </div>
                </div>
                
            </div>
            {encounterSelectedCreature  ? (
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
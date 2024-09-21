import React, { useEffect, useState  } from 'react';
import '../style/App.css';
import SearchList from './SearchList.js';
import EncounterColumn from './EncounterColumn.js';
import SideMenu from './SideMenu.js';
import InputEncounterId from './InputEncounterId.js';
import InputCharacterId from './InputCharacterId.js';
import NewEncounterButton from './NewEncounterButton.js';
import { generateUniqueId, INIT_ENCOUNTER} from '../constants';
import DropdownMenu from './DropdownMenu.js';
import YouTubeEmbed from './../../playerView/components/YouTubeEmbed.js';


function getLocalStorageSize() {
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
    }
    
    const sizeInMB = totalSize / 1048576;
    
    console.log(`Total items in localStorage: ${localStorage.length}`);
    console.log(`Approximate size: ${sizeInMB.toFixed(2)} MB`);
}

const DmView = ({currentEncounter, setCurrentEncounter, playerViewBackground, setPlayerViewBackground, handleRefresh, hideDeadEnemies, setHideDeadEnemies, refreshCheck, autoRefresh, uploadLocalStorage, enemyBloodToggle, setEnemyBloodToggle, localSavedEncounters}) => {
    getLocalStorageSize()
    const [showSearchList, setShowSearchList] = useState(true);
    const [onFirstLoad, setOnFirstLoad] = useState(true);
    const [encounterGuid, setEncounterGuid] = useState(currentEncounter.guid);
    const [savedEncounters, setSavedEncounters] = useState(localSavedEncounters);
    const [hideEnemies, setHideEnemies] = useState(true);


    const handleNewEncounter = () => {
        console.log("%c=== New Encounter ===", "background: green;")
        let newGuid = generateUniqueId();
        setCurrentEncounter({...INIT_ENCOUNTER, guid: newGuid})
        setEncounterGuid(newGuid)
    };

    useEffect(() => {
        if(onFirstLoad && currentEncounter.guid !== "")
            setOnFirstLoad(false)
        // eslint-disable-next-line
    }, [currentEncounter]);    

    useEffect(() => {
        setSavedEncounters(localSavedEncounters)
        // eslint-disable-next-line
    }, [localSavedEncounters]); 

    const handleLoadEncounter = (encounter) => {
        console.log("%cLoaded: " + encounter.encounterName, "background: #fdfd96;")
        setCurrentEncounter({...encounter})
        localStorage.setItem('hideEnemies', JSON.stringify(true));
        setHideEnemies(true)

    };  

    return (
        <div className="dmView" style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
            { playerViewBackground.type === "youtube" && 
                <YouTubeEmbed embedUrl={playerViewBackground.src}/>
            }

            { onFirstLoad ? ( 
                <div className='firstLoadMenuContainer'>
                    <div className='firstLoadMenu'>
                        <a className='helpLink' href='/help'>DmBuddy.com/help</a>
                        <div className='firstLoadOptions'>
                            <h1>DmBuddy.com</h1>
                            <span>
                                Home Brew Focused Encounter Building and Player View
                            </span>
                            <span className='firstLoadExtra'>
                                (with Dnd Beyond Importing)
                            </span>
                            
                        </div>

                        <div className='firstLoadOptions'>
                            Create a
                            <NewEncounterButton handleNewEncounter={handleNewEncounter} />  
                        </div>

                        <div className='firstLoadOptions'>
                            {savedEncounters.length !== 0 && (
                                <>
                                    Select from your
                                    <DropdownMenu setSavedEncounters={setSavedEncounters} savedEncounters={savedEncounters} handleLoadEncounter={handleLoadEncounter} currentEncounter={currentEncounter}/> 
                                </>
                            
                            )}
                        </div>

                        
                        <div className='firstLoadOptionsImports'>
                            Import an encounter from Dnd Beyond
                            <InputEncounterId setCurrentEncounter={setCurrentEncounter}/>
                            or
                            <span>Import Dnd Beyond Character</span>
                            <InputCharacterId setCurrentEncounter={setCurrentEncounter}/>
                        </div>
                    </div>
                </div>

            ) : ( 
                <>
                    <SideMenu uploadLocalStorage={uploadLocalStorage} setCurrentEncounter={setCurrentEncounter} showSearchList={showSearchList} setShowSearchList={setShowSearchList}/>
                    {showSearchList &&  
                        <SearchList setCurrentEncounter={setCurrentEncounter}/>
                    }
                    <EncounterColumn currentEncounter={currentEncounter} savedEncounters={savedEncounters} hideEnemies={hideEnemies} setPlayerViewBackground={setPlayerViewBackground} setHideEnemies={setHideEnemies} hideDeadEnemies={hideDeadEnemies} setHideDeadEnemies={setHideDeadEnemies} setSavedEncounters={setSavedEncounters} enemyBloodToggle={enemyBloodToggle} setEnemyBloodToggle={setEnemyBloodToggle} refreshCheck={refreshCheck} autoRefresh={autoRefresh} setCurrentEncounter={setCurrentEncounter} handleRefresh={handleRefresh} encounterGuid={encounterGuid} setEncounterGuid={setEncounterGuid} localSavedEncounters={localSavedEncounters} handleNewEncounter={handleNewEncounter} showSearchList={showSearchList} handleLoadEncounter={handleLoadEncounter}/>
                </>
            )}
             </div>
    );
};

export default DmView;
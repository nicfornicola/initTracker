import React, { useState  } from 'react';
import '../style/App.css';
import SearchList from './SearchList.js';
import EncounterColumn from './EncounterColumn.js';
import SideMenu from './SideMenu.js';

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

const DmView = () => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState([]);
    const [localSavedEncounters, setLocalSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')));
    const [showSearchList, setShowSearchList] = useState(true);
   
    getLocalStorageSize()
    
    const uploadLocalStorage = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        // Read the file content as text
        reader.onload = function(event) {
            try {
                // Parse the JSON data
                const localStorageData = JSON.parse(event.target.result);

                // Set each key-value pair in local storage
                for (const key in localStorageData) {
                    if (localStorageData.hasOwnProperty(key)) {
                        localStorage.setItem(key, localStorageData[key]);
                    }
                }

                setLocalSavedEncounters([...JSON.parse(localStorage.getItem('savedEncounters'))])
                console.log("Local storage data has been successfully set.");
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        // Read the file
        reader.readAsText(file);
    }

    console.log(localSavedEncounters)
    
    return (
        <div className='dmView'>
            <SideMenu uploadLocalStorage={uploadLocalStorage} showSearchList={showSearchList} setShowSearchList={setShowSearchList}/>
            {showSearchList &&  
                <SearchList setCurrentEncounterCreatures={setCurrentEncounterCreatures} ></SearchList>
            }
            <EncounterColumn currentEncounterCreatures={currentEncounterCreatures} setCurrentEncounterCreatures={setCurrentEncounterCreatures} localSavedEncounters={localSavedEncounters} showSearchList={showSearchList}/>
        </div>
    );
};

export default DmView;
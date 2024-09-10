import React, { useEffect, useState  } from 'react';
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

const DmView = ({currentEncounter, setCurrentEncounter, uploadLocalStorage, localSavedEncounters}) => {
    getLocalStorageSize()
    const [showSearchList, setShowSearchList] = useState(true);
    return (
        <div className='dmView'>
            <SideMenu uploadLocalStorage={uploadLocalStorage} setCurrentEncounter={setCurrentEncounter} showSearchList={showSearchList} setShowSearchList={setShowSearchList}/>
            {showSearchList &&  
                <SearchList setCurrentEncounter={setCurrentEncounter}/>
            }
            <EncounterColumn currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} localSavedEncounters={localSavedEncounters} showSearchList={showSearchList}/>
        </div>
    );
};

export default DmView;
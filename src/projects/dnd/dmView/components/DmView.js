import React, { useState  } from 'react';
import '../style/App.css';
import SearchList from './SearchList.js';
import EncounterColumn from './EncounterColumn.js';

let totalSize = 0;

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    totalSize += key.length + value.length;
}

const sizeInMB = totalSize / 1048576;

console.log(`Total items in localStorage: ${localStorage.length}`);
console.log(`Approximate size: ${sizeInMB.toFixed(2)} MB`);

const DmView = () => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState([]);

    return (
        <div className='dmView'>
            <div className='measure'></div>
            <SearchList setCurrentEncounterCreatures={setCurrentEncounterCreatures}></SearchList>
            <EncounterColumn currentEncounterCreatures={currentEncounterCreatures} setCurrentEncounterCreatures={setCurrentEncounterCreatures}/>
        </div>
    );
};

export default DmView;
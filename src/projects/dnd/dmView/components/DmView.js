import React, { useState  } from 'react';
import '../style/App.css';
import SearchList from './SearchList.js';
import EncounterColumn from './EncounterColumn.js';

const DmView = () => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState([]);

    return (
        <div className='dmView'>
            <SearchList setCurrentEncounterCreatures={setCurrentEncounterCreatures}></SearchList>
            <EncounterColumn currentEncounterCreatures={currentEncounterCreatures} setCurrentEncounterCreatures={setCurrentEncounterCreatures}/>
        </div>
    );
};

export default DmView;
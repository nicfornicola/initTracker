import React, { useState  } from 'react';
import '../style/App.css';
import SearchList from './SearchList.js';
import EncounterList from './EncounterList.js';

const DmView = () => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState([]);

    return (
        <div className='dmView'>
            <SearchList setCurrentEncounterCreatures={setCurrentEncounterCreatures}></SearchList>
            <EncounterList currentEncounterCreatures={currentEncounterCreatures} setCurrentEncounterCreatures={setCurrentEncounterCreatures}/>
        </div>
    );
};

export default DmView;
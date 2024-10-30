// App.js
import {React, useState} from 'react';

import { Route, Routes } from 'react-router-dom';

import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import WhoAreYou from './projects/dnd/playerView/components/PlayerUI/WhoAreYou';
import DmView from './projects/dnd/dmView/components/DmView';

import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

import {INIT_ENCOUNTER} from './projects/dnd/dmView/constants'
import HowTo from './projects/dnd/dmView/components/SideMenu/HowToDMB';
import defaultBackground from "./projects/dnd/dmView/pics/backgrounds/happyTavern.png"

// When someone comes to dmbuddy for the first load, set these variables, or remember what they have already
if(!window.location.href.includes("/playerView")) {
    localStorage.setItem('hideDeadEnemies', localStorage.getItem('hideDeadEnemies') === null ? false : JSON.parse(localStorage.getItem('hideDeadEnemies')));
    localStorage.setItem('enemyBloodToggle', localStorage.getItem('enemyBloodToggle') === null ? 1 : JSON.parse(localStorage.getItem('enemyBloodToggle')));
    localStorage.setItem('hideEnemies', true);
    localStorage.setItem('cardContainerStyle', JSON.stringify({width: '80%'}));
}

function App() {
    // Load all encounters from storage
    // const [localSavedEncounters, setLocalSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')) || []);
    const [currentEncounter, setCurrentEncounter] = useState(INIT_ENCOUNTER);
    const [playerViewBackground, setPlayerViewBackground] = useState({type: "image", src: defaultBackground});

    return (
        <Routes>
            <Route path="/" element={<DmView currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} playerViewBackground={playerViewBackground} setPlayerViewBackground={setPlayerViewBackground} />}/>
            <Route path="/playerView/:encounterGuid" element={<PlayerPage playerViewBackground={playerViewBackground} />} />
            <Route path="/join/:encounterGuid" element={<WhoAreYou playerViewBackground={playerViewBackground} />} />
            <Route path="/help" element={<HowTo/>} />
            <Route path="/king/" element={<Pantheon />} />
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/max/" element={<div style={{fontSize: '50px'}}>129114069,125681347,129132878,129107853,125382402</div>} />
        </Routes>
    );
}

export default App;
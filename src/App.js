// App.js
import {React, useState} from 'react';

import { Route, Routes } from 'react-router-dom';

import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import WhoAreYou from './projects/dnd/playerView/components/PlayerUI/WhoAreYou';
import DmView from './projects/dnd/dmView/components/DmView';

import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

import HowTo from './projects/dnd/dmView/components/SideMenu/HowToDMB';

// When someone comes to dmbuddy for the first load, set these variables, or remember what they have already
// if(!window.location.href.includes("/playerView")) {
//     localStorage.setItem('hideDeadEnemies', localStorage.getItem('hideDeadEnemies') === null ? false : JSON.parse(localStorage.getItem('hideDeadEnemies')));
//     localStorage.setItem('enemyBloodToggle', localStorage.getItem('enemyBloodToggle') === null ? 1 : JSON.parse(localStorage.getItem('enemyBloodToggle')));
//     localStorage.setItem('hideEnemies', true);
//     localStorage.setItem('cardContainerStyle', JSON.stringify({width: '80%'}));
// }

function App() {
    // Load all encounters from storage
    // const [localSavedEncounters, setLocalSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')) || []);

    return (
        <Routes>
            <Route path="/" element={<DmView />}/>
            <Route path="/playerView/:sessionID" element={<PlayerPage />} />
            <Route path="/join/:sessionID" element={<WhoAreYou />} />
            <Route path="/help" element={<HowTo/>} />
            <Route path="/king/" element={<Pantheon />} />
            <Route path="/blog" element={<Blog/>}/>
        </Routes>
    );
}

export default App;
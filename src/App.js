// App.js
import React from 'react';

import { Route, Routes } from 'react-router-dom';
import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import DmView from './projects/dnd/dmView/components/DmView';

import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';
import HowTo from './projects/dnd/dmView/components/HowToDMB';

function App() {
    // const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState([]);

    return (
        <Routes>
            <Route path="/" element={<>Hello, I am Nic Fornicola, welcome to my website, if your looking for the dnd thing go to dmbuddy.com/dnd/dm</>}/>
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/dnd/:gameId?" element={<PlayerPage/>} />
            <Route path="/dnd/dm/" element={<DmView/>} />
            <Route path="/dnd/dm/playerView" element={<PlayerPage/>} />
            <Route path="/help" element={<HowTo/>} />
            <Route path="/king/" element={<Pantheon />} />
            <Route path="/dnd/dm/max/" element={<div style={{fontSize: '50px'}}>129114069,125681347,129132878,129107853,125382402</div>} />
        </Routes>
    );
}

export default App;
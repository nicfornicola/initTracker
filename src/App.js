import React from 'react';

import { Route, Routes } from 'react-router-dom';

import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import WhoAreYou from './projects/dnd/playerView/components/PlayerUI/WhoAreYou';
import DmView from './projects/dnd/dmView/components/DmView';
import ErrorBoundary from "./projects/dnd/dmView/components/ErrorBoundary"; 
import Users from "./projects/dnd/dmView/components/Users"; 

import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

import Mixer from './projects/mixer/components/Mixer';

import HowTo from './projects/dnd/dmView/components/SideMenu/HowToDMB';

function App() {

    return (        
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<DmView />}/>
                <Route path="/playerView/:sessionID/*" element={<PlayerPage/>} />
                <Route path="/join/:sessionID" element={<WhoAreYou/>} />
                <Route path="/help" element={<HowTo/>} />
                <Route path="/users" element={<Users/>} />
                <Route path="/king/" element={<Pantheon />} />
                <Route path="/blog" element={<Blog/>}/>
                <Route path="/mixer" element={<Mixer/>}/>
            </Routes>
        </ErrorBoundary>
    );
}

export default App;
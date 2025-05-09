import React from 'react';

import { Route, Routes } from 'react-router-dom';

import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import WhoAreYou from './projects/dnd/playerView/components/PlayerUI/WhoAreYou';
import DmView from './projects/dnd/dmView/components/DmView';
import ErrorBoundary from "./projects/dnd/dmView/components/ErrorBoundary"; 
import Users from "./projects/dnd/dmView/components/Users"; 

import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

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
            </Routes>
        </ErrorBoundary>
    );
}

export default App;

// https://support.microsoft.com/en-us/home/livechatwidget?theme=outlookdotcom_fluent&customcontext=%7B%22CaseNumber%22%3A%227075147524%22%7D&x-ems-sessionid=a2a582cd-0d85-4193-9c7c-bbaceb661f8d
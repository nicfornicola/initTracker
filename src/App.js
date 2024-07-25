// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlayerPage from './projects/dnd/components/playerView/PlayerPage';
import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';
import DmView from './projects/dnd/components/dmView/DmView';

function App() {
  return (
    <Routes>
        <Route path="/" element={<>Hello, I am Nic Fornicola, welcome to my website, if your looking for the dnd thing go to nicfornicola.com/dnd</>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/dnd/:gameId?" element={<PlayerPage/>} />
        <Route path="/dnd/dm/" element={<DmView/>} />
        <Route path="/king/" element={<Pantheon />} />
    </Routes>
  );
}

export default App;
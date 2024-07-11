// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlayerPage from './projects/dnd/components/PlayerPage';
import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Blog/>}/>
        <Route path="/dnd/:gameId?" element={<PlayerPage/>} />
        <Route path="/king/" element={<Pantheon />} />
    </Routes>
  );
}

export default App;
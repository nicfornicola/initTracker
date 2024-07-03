// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlayerPage from './projects/dnd/components/PlayerPage';
import Blog from './projects/blog/components/Blog';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Blog/>}/>
        <Route path="/dnd/:gameId?" element={<PlayerPage/>} />
    </Routes>
  );
}

export default App;
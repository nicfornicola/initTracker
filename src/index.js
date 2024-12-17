import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './providers/UserProvider';
import { ImportedPlayersProvider } from './providers/ImportedPlayersProvider';
import { HomebrewProvider } from './providers/HomebrewProvider';


ReactDOM.render(
    <UserProvider> 
        <ImportedPlayersProvider> 
            <HomebrewProvider> 
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </HomebrewProvider> 
        </ImportedPlayersProvider> 
    </UserProvider>,
    document.getElementById('root')
);
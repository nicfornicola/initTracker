import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './providers/UserProvider';
import { ImportedPlayersProvider } from './providers/ImportedPlayersProvider';
import { HomebrewProvider } from './providers/HomebrewProvider';
import { EncounterProvider } from './providers/EncounterProvider';


ReactDOM.render(
    <UserProvider> 
        <ImportedPlayersProvider> 
            <HomebrewProvider> 
                <EncounterProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </EncounterProvider>
            </HomebrewProvider> 
        </ImportedPlayersProvider> 
    </UserProvider>,
    document.getElementById('root')
);
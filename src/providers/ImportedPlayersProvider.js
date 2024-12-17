import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserProvider.js';
import FakeImport from '../projects/dnd/dmView/monsterJsons/FakeImport.json'
// Create a Context
const ImportedPlayerContext = createContext();

// Custom hook to use the Context
export const useImportedPlayers = () => {
    return useContext(ImportedPlayerContext);
};

// Provider component
export const ImportedPlayersProvider = ({ children }) => {
    const { username } = useUser();
    const [importedPlayers, setImportedPlayers] = useState([]);

    useEffect(() => {
        if (username !== 'Username') {
            // Simulate fetching imported players
            console.log(`Logged in - getting imported players for ${username}`);
            setImportedPlayers([]);
        } else {
            setImportedPlayers([]); // Clear the players if no username
        }
    }, [username]);

    const value = useMemo(() => ({ importedPlayers, setImportedPlayers }), [importedPlayers]);

    return (
        <ImportedPlayerContext.Provider value={value}>
            {children}
        </ImportedPlayerContext.Provider>
    );
};
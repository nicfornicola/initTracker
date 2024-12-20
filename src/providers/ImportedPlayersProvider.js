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

    const addImportedPlayer = (newPlayers) => {
        setImportedPlayers((prevPlayers) => {
            const updatedPlayers = [...prevPlayers];
    
            newPlayers.forEach((newPlayer) => {
                const existingPlayerIndex = updatedPlayers.findIndex(
                    (player) => player.dnd_b_player_id === newPlayer.dnd_b_player_id
                );
    
                if (existingPlayerIndex !== -1) {
                    updatedPlayers[existingPlayerIndex] = newPlayer;
                    console.log("overwriting", newPlayer.dnd_b_player_id, newPlayer.name)
                } else {
                    updatedPlayers.push(newPlayer);
                    console.log("append", newPlayer.dnd_b_player_id, newPlayer.name)
                }
            });
    
            return updatedPlayers;
        });
    };

    useEffect(() => {
        if (username !== 'Username') {
            // Simulate fetching imported players
            console.log(`Logged in - getting imported players for ${username}`);
            setImportedPlayers([]);
        } else {
            setImportedPlayers([]); // Clear the players if no username
        }
    }, [username]);

    const value = useMemo(() => ({ importedPlayers, setImportedPlayers, addImportedPlayer }), [importedPlayers]);

    return (
        <ImportedPlayerContext.Provider value={value}>
            {children}
        </ImportedPlayerContext.Provider>
    );
};
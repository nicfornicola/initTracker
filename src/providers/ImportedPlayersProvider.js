import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserProvider.js';
import {backendUrl, generateUniqueId} from '../projects/dnd/dmView/constants.js'
import FakeImport from '../projects/dnd/dmView/monsterJsons/FakeImport.json'
import axios from 'axios';

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
        const updatedPlayers = [...importedPlayers];

        newPlayers.forEach((newPlayer) => {
            // let action = "append"
            // newPlayer = {...newPlayer, creatureGuid: generateUniqueId(), encounterGuid: null, username: username}

            const existingPlayerIndex = updatedPlayers.findIndex(
                (player) => player.dnd_b_player_id === newPlayer.dnd_b_player_id
            );

            if (existingPlayerIndex !== -1) {
                updatedPlayers[existingPlayerIndex] = newPlayer;
                console.log("overwrite", newPlayer.dnd_b_player_id, newPlayer.name)
                // action = "overwrite"

            } else {
                updatedPlayers.push(newPlayer);
                console.log("append", newPlayer.dnd_b_player_id, newPlayer.name)
            }

            // const url = `${backendUrl}/dmb_update_custom/${username}/${action}`;
            // axios.post(url, newPlayer, {
            //     headers: { 'Content-Type': 'application/json' },
            // }).then((res) => {
            //     console.log(res)
            // });
        });
    
        setImportedPlayers(updatedPlayers);

        
    };

    useEffect(() => {
        if (username !== 'Username') {
            // Simulate fetching imported players
            console.log(`Logged in - getting imported players for ${username}`);
            const url = `${backendUrl}/dmb_get_imports/${username}`;
        
            axios.get(url).then((res) => {
                console.log(res)
                setImportedPlayers([]);
            });
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
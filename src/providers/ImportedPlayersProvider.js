import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserProvider.js';
import {backendUrl, generateUniqueId} from '../projects/dnd/dmView/constants.js'
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
            let action = "append"
            newPlayer = {...newPlayer, creatureGuid: generateUniqueId(), encounterGuid: null, username: username}

            const foundIndex = updatedPlayers.findIndex(
                (player) => player.dnd_b_player_id === newPlayer.dnd_b_player_id
            );

            if (foundIndex !== -1) {
                newPlayer = {...newPlayer, creatureGuid: updatedPlayers[foundIndex].creatureGuid};
                updatedPlayers[foundIndex] = newPlayer
                action = "overwrite"
            } else {
                updatedPlayers.push(newPlayer);
            }

            const url = `${backendUrl}/dmb_update_homebrew/${username}/${action}`;
            axios.post(url, newPlayer, {
                headers: { 'Content-Type': 'application/json' },
            });
        });
    
        setImportedPlayers(updatedPlayers);
        
    };

    const removeFromImportList  = (creature, index) => {
        const url = `${backendUrl}/dmb_update_homebrew/${username}/delete`;
        axios.post(url, creature, {
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => {
            if(res.status === 200)
                setImportedPlayers(prev => prev.filter((_, i) => i !== index))
        });
    };

    useEffect(() => {
        if (username !== 'Username') {
            const url = `${backendUrl}/dmb_get_imports/${username}`;
        
            axios.get(url).then((res) => {
                setImportedPlayers(res.data);
            });
        } else {
            setImportedPlayers([]); // Clear the players if no username
        }
    }, [username]);

    const value = useMemo(() => ({ importedPlayers, setImportedPlayers, addImportedPlayer, removeFromImportList }), [importedPlayers]);

    return (
        <ImportedPlayerContext.Provider value={value}>
            {children}
        </ImportedPlayerContext.Provider>
    );
};
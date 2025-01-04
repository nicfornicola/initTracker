import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserProvider.js';
import axios from 'axios';
import {backendUrl, generateUniqueId} from '../projects/dnd/dmView/constants.js'

// Create a Context
const HomebrewProviderContext = createContext();

// Custom hook to use the Context
export const useHomebrewProvider = () => {
    return useContext(HomebrewProviderContext);
};

// Provider component
export const HomebrewProvider = ({ children }) => {
    const { username } = useUser();
    const [homebrewList, setHomebrewList] = useState([]);

    const addToHomebrewList = (newCreature) => {
        // Assign new guids since this is the home brew version
        newCreature = {...newCreature, username: username, encounterGuid: null}
        
        if(!newCreature?.dmb_homebrew_guid) {
            newCreature.dmb_homebrew_guid = generateUniqueId()
        }

        let action = "append"
        const updatedCreatures = [...homebrewList];
            const foundIndex = updatedCreatures.findIndex(
                (creature) => creature.dmb_homebrew_guid === newCreature.dmb_homebrew_guid
            );

            if (foundIndex !== -1) {
                //Get the new creatures stats but keep the old homebrew creatureGuid and homebrewGuid
                newCreature = {...newCreature, creatureGuid: updatedCreatures[foundIndex].creatureGuid}
                updatedCreatures[foundIndex] = newCreature;
                action = "overwrite"
            } else {
                // Assign new creatureGuid to NEW homebrew creature, the homebrewGuid is assigned in statblock so it can be updated in the currentEncounter easier
                newCreature = {...newCreature, creatureGuid: newCreature.creatureGuid ?? generateUniqueId()}
                updatedCreatures.push(newCreature);
            }

        setHomebrewList(updatedCreatures)

        const url = `${backendUrl}/dmb_update_homebrew/${username}/${action}`;
        axios.post(url, newCreature, {
            headers: { 'Content-Type': 'application/json' },
        });
            
    };

    const removeFromHomebrewList  = (creature, index) => {
        const url = `${backendUrl}/dmb_update_homebrew/${username}/delete`;
        axios.post(url, creature, {
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => {
            if(res.status === 200)
                setHomebrewList(prev => prev.filter((_, i) => i !== index))
        });
    };

    useEffect(() => {
        if (username !== 'Username') {
            console.log(`Logged in - getting homebrew for ${username}`);
            const url = `${backendUrl}/dmb_get_homebrew/${username}`;
            axios.get(url).then((res) => {
                setHomebrewList(res.data);
            });
        } else {
            setHomebrewList([]);
        }
    }, [username]);

    const value = useMemo(() => ({ homebrewList, setHomebrewList, addToHomebrewList, removeFromHomebrewList }), [homebrewList]);

    return (
        <HomebrewProviderContext.Provider value={value}>
            {children}
        </HomebrewProviderContext.Provider>
    );
};
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserProvider.js';

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
        setHomebrewList((prevCreatures) => {
            const updatedCreatures = [...prevCreatures];
                const foundIndex = updatedCreatures.findIndex(
                    (creature) => creature.dmb_homebrew_guid === newCreature.dmb_homebrew_guid
                );
    
                if (foundIndex !== -1) {
                    updatedCreatures[foundIndex] = newCreature;
                    console.log("overwriting", newCreature.dmb_homebrew_guid, newCreature.name)
                } else {
                    updatedCreatures.push(newCreature);
                    console.log("append", newCreature.dmb_homebrew_guid, newCreature.name)
                }
                return updatedCreatures;
        });
            
    };

    useEffect(() => {
        if (username !== 'Username') {
            console.log(`Logged in - getting homebrew for ${username}`);
            setHomebrewList([]);
        } else {
            setHomebrewList([]);
        }
    }, [username]);

    const value = useMemo(() => ({ homebrewList, setHomebrewList, addToHomebrewList }), [homebrewList]);
    console.log(homebrewList)

    return (
        <HomebrewProviderContext.Provider value={value}>
            {children}
        </HomebrewProviderContext.Provider>
    );
};
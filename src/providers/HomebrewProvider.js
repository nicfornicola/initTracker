import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserProvider.js';
import FakeHomebrew from '../projects/dnd/dmView/monsterJsons/FakeHomebrew.json'
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

    useEffect(() => {
        if (username !== 'Username') {
            // Simulate fetching imported players
            console.log(`Logged in - getting homebrew for ${username}`);
            setHomebrewList(FakeHomebrew);
        } else {
            setHomebrewList([]); // Clear the players if no username
        }
    }, [username]);

    const value = useMemo(() => ({ homebrewList, setHomebrewList }), [homebrewList]);

    return (
        <HomebrewProviderContext.Provider value={value}>
            {children}
        </HomebrewProviderContext.Provider>
    );
};
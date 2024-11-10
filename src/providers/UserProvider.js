import React, { createContext, useContext, useState } from 'react';

// Create a Context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};

// Provider component
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState('Username');

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};
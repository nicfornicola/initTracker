import React, { createContext, useReducer, useContext } from 'react';
import { INIT_ENCOUNTER, sortCreatureArray } from '../projects/dnd/dmView/constants';

// Define the reducer function
const encounterReducer = (state, action) => {
    console.log('1 - EncounterReducer', action.type);
    console.log('2 - old', state);
    console.log('3 - payload', action.payload);
    let payload = action.payload || {};
    switch (action.type) {
        case 'SET_ENCOUNTER':
            return { ...state, ...payload };
        case 'SORT_CREATURES':
            return { ...state, creatures: sortCreatureArray(state.creatures) };
        case 'ADD_CREATURE':
            return { ...state, creatures: [...state.creatures, payload.newCreature] };
        case 'ADD_CREATURES_ARRAY':
            return { ...state, creatures: [...state.creatures, ...payload.creatureArray] };
        case 'REMOVE_CREATURE':
            return { ...state, creatures: [...state.creatures.filter((_, i) => i !== payload.removeIdex)] };
        case 'REPLACE_CREATURE':
                return {
                    ...state,
                    creatures: state.creatures.map((creature) =>
                        creature.creatureGuid === payload.creatureGuid ? payload.newCreature : creature
                    ),
                };
        case 'UPDATE_BACKGROUND':
            return { ...state, backgroundGuid: payload.src };
        case 'RESET_ENCOUNTER':
            return { ...INIT_ENCOUNTER, encounterGuid: payload };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

// Create the Context
const EncounterContext = createContext();

// Create the Provider component
export const EncounterProvider = ({ children }) => {
    const [currentEncounter, dispatchEncounter] = useReducer(encounterReducer, INIT_ENCOUNTER);

    return (
        <EncounterContext.Provider value={{ currentEncounter, dispatchEncounter }}>
            {children}
        </EncounterContext.Provider>
    );
};

// Custom hook to use the EncounterContext
export const useEncounter = () => {
    const context = useContext(EncounterContext);
    if (!context) {
        throw new Error('useEncounter must be used within an EncounterProvider');
    }
    return context;
};
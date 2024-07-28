import React, { useState } from 'react';

const DelayedInput = ({encounterName, setEncounterName, lastEncounterName, setLastEncounterName}) => {
    const [inputValue, setInputValue] = useState(encounterName);
    
    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Encounter Name..."
        />
    );
};

export default DelayedInput;
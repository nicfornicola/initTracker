import React, { useState } from 'react';

const DelayedInput = ({encounterName, setEncounterName}) => {
    const [inputValue, setInputValue] = useState('');

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
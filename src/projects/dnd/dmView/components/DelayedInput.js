import React, { useState } from 'react';

const DelayedInput = ({encounterName, setEncounterName}) => {
    const [inputValue, setInputValue] = useState(encounterName);
    
    const handleEditTitleChange = (e) => {
        setInputValue(e.target.value);
        if (encounterName !== e.target.value) {
            setEncounterName(e.target.value);
        }
    };

    return (
        <input
            className='encounterTitleEditInput'
            type="text"
            value={inputValue}
            onChange={handleEditTitleChange}
            placeholder="Encounter Name..."
        />
    );
};

export default DelayedInput;
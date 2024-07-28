import React, { useState } from 'react';

const DropdownMenu = ({ savedEncounters, handleLoadEncounter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEncounterName, setSelectedEncounter] = useState(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (encounter) => {
        setSelectedEncounter(encounter.encounterName);
        setIsOpen(false);
        if(handleLoadEncounter) 
            handleLoadEncounter(encounter);
    };

    console.log(savedEncounters)

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {selectedEncounterName ? 'Encounters: '+ selectedEncounterName : 'Encounters...'}
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                {savedEncounters.map((encounter, index) => (
                    <li
                        key={encounter.encounterName + index}
                        onClick={() => handleOptionClick(encounter)}
                        className="dropdown-item"
                    >
                        {encounter.encounterName}
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;

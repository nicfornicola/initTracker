import React, { useEffect, useState } from 'react';

const DropdownMenu = ({ savedEncounters, handleLoadEncounter, lastEncounterName, currentEncounterCreatures }) => {
    const [selectedEncounterName, setSelectedEncounterName] = useState(lastEncounterName);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSelectedEncounterName(lastEncounterName)
    }, [lastEncounterName])

    console.log(lastEncounterName)

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (encounter) => {
        setSelectedEncounterName(encounter.encounterName);
        setIsOpen(false);
        if(handleLoadEncounter) 
            handleLoadEncounter(encounter);
    };

    console.log(savedEncounters)

    let buttonString = "No Saved Encounters"
    if(savedEncounters) {
        buttonString = currentEncounterCreatures.length != 0 ? "Encounter: " + selectedEncounterName : "Encounters..." 
    }

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {buttonString}
            </button>
            {isOpen && savedEncounters && (
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

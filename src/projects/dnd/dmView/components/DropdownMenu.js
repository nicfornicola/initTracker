import React, { useEffect, useState, useRef } from 'react';

const DropdownMenu = ({ savedEncounters, handleLoadEncounter, lastEncounterName, currentEncounterCreatures }) => {
    const [selectedEncounterName, setSelectedEncounterName] = useState(lastEncounterName);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
    
        if (isOpen) {
          document.addEventListener('click', handleClickOutside);
        } else {
          document.removeEventListener('click', handleClickOutside);
        }
    
        return () => document.removeEventListener('click', handleClickOutside);
      }, [isOpen]);

    useEffect(() => {
        setSelectedEncounterName(lastEncounterName)
    }, [lastEncounterName])

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (encounter) => {
        setSelectedEncounterName(encounter.encounterName);
        setIsOpen(false);
        if(handleLoadEncounter) 
            handleLoadEncounter(encounter);
    };

    let buttonString = "No Saved Encounters"
    if(savedEncounters) {
        buttonString = currentEncounterCreatures.length !== 0 ? "Encounter: " + selectedEncounterName : "Encounters..." 
    }

    return (
        <div className="dropdown">
            <button ref={dropdownRef} className="dmViewButton" onClick={toggleDropdown}>
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

import React, { useEffect, useState, useRef } from 'react';
import { INIT_ENCOUNTER_NAME } from '../constants';

const DropdownMenu = ({ savedEncounters, setSavedEncounters, handleLoadEncounter, currentEncounter}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    function clickEncounterDropdownMenuX(event, encounter) {
        event.stopPropagation();
        let updatedEncounterList = savedEncounters.filter(e => e.guid !== encounter.guid)
        setSavedEncounters(updatedEncounterList);
        localStorage.setItem('savedEncounters', JSON.stringify(updatedEncounterList));
    }
    

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

    const handleOptionClick = (encounter) => {
        setIsOpen(false);
        handleLoadEncounter(encounter);
    };

    let buttonString = "No Saved Encounters"
    if(savedEncounters?.length !== 0) {
        buttonString = currentEncounter.encounterName === INIT_ENCOUNTER_NAME ? "Encounters..." : "Encounter: " + currentEncounter.encounterName 
    }

    return (
        <div className="dropdown">
            <button ref={dropdownRef} className="dmViewButton" onClick={() => setIsOpen(!isOpen)}>
                {buttonString}
            </button>
            {isOpen && savedEncounters && (
                <ul className="dropdown-menu animatedMenu">
                    {savedEncounters.map((encounter, index) => (
                        <li
                            key={encounter.encounterName + index}
                            onClick={() => handleOptionClick(encounter)}
                            className="dropdown-item"
                        >
                            {encounter.encounterName}
                            <button className='encounterDropdownX' onClick={(event) => clickEncounterDropdownMenuX(event, encounter)}>
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;

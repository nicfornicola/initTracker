import React, { useEffect, useState, useRef } from 'react';
import { INIT_ENCOUNTER_NAME } from '../../constants';

const DropdownMenu = ({ savedEncounters, setSavedEncounters, handleLoadEncounter, currentEncounter, socket}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    function clickEncounterDropdownMenuX(event, encounter) {
        event.stopPropagation();
        let updatedEncounterList = savedEncounters.filter(e => e.encounterGuid !== encounter.encounterGuid)
        setSavedEncounters(updatedEncounterList);
        socket.emit("deleteEncounter", encounter.encounterGuid)
    }
    
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropDownOptionClicked = (encounter) => {
        setIsOpen(false);
        handleLoadEncounter(encounter);
    };

    let buttonString = "No Saved Encounters"
    if(savedEncounters?.length !== 0) {
        buttonString = currentEncounter.encounterName === INIT_ENCOUNTER_NAME ? "Saved Encounters..." : "Encounter: " + currentEncounter.encounterName 
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dmViewButton" onClick={() => setIsOpen(!isOpen)} disabled={savedEncounters.length === 0}>
                {buttonString}
            </button>
        {isOpen && savedEncounters.length !== 0 && (
            <ul className="dropdownMenu">
                {savedEncounters.map((encounter, index) => (
                    <li
                        key={encounter.encounterName + index}
                        onClick={() => handleDropDownOptionClicked(encounter)}
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

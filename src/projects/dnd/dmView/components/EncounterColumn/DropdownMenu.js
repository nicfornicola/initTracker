import React, { useEffect, useState, useRef } from 'react';
import { INIT_ENCOUNTER_NAME, INIT_ENCOUNTER } from '../../constants';
import streaming from '../../pics/icons/streaming.gif';

const DropdownMenu = ({ adminView, streamingEncounter, savedEncounters, setSavedEncounters, handleLoadEncounter, currentEncounter, setCurrentEncounter, socket}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    function clickEncounterDropdownMenuX(event, encounter) {
        event.stopPropagation();
        let updatedEncounterList = savedEncounters.filter(e => e.encounterGuid !== encounter.encounterGuid)
        setSavedEncounters(updatedEncounterList);
        
        if(currentEncounter.encounterGuid === encounter.encounterGuid)
            setCurrentEncounter(INIT_ENCOUNTER)
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

    let buttonString = "No Encounters"
    if(savedEncounters?.length !== 0) {
        buttonString = currentEncounter.encounterName === INIT_ENCOUNTER_NAME ? "Encounters..." : "Encounter: "
    }

    console.log("streaming", streamingEncounter)

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dmViewButton" onClick={() => setIsOpen(!isOpen)} disabled={savedEncounters.length === 0}>
                {buttonString}
                {currentEncounter && currentEncounter.encounterName !== INIT_ENCOUNTER_NAME &&
                    <p style={{margin: 0, textWrap: 'nowrap'}}>
                        <b>{currentEncounter.encounterName}</b>
                    </p>
                }
            </button>
        {isOpen && savedEncounters.length !== 0 && (
            <ul className="dropdownMenu">
                {savedEncounters.map((encounter, index) => (
                    <li
                        key={encounter.encounterName + index}
                        onClick={() => handleDropDownOptionClicked(encounter)}
                        className="dropdown-item"
                    >
                        <span>{encounter.encounterName || <i style={{fontSize: 'small'}}>No Title</i>}</span>
                        {encounter.encounterGuid === streamingEncounter?.encounterGuid && 
                            <img alt='streaming' className='streamingGif' src={streaming} />
                        }
                        {adminView && <strong>{encounter.username}</strong>}
                        {(!adminView || encounter.username === 'Username') && 
                            <button className='encounterDropdownX' onClick={(event) => clickEncounterDropdownMenuX(event, encounter)}>
                                ❌
                            </button>
                        }

                    </li>
                ))}
            </ul>
        )}
      </div>
    );
};

export default DropdownMenu;

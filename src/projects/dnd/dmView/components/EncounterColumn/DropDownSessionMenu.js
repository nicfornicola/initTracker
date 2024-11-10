import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../../../../../providers/UserProvider';

const handleOpenSession = (sessionID) => {
    if(!sessionID) {
        alert("Start a session first")
    }
    let url = window.location.href;
    // Add '/' if needed
    url += url.endsWith("/") ? "" : "/";
    window.open(`${url}playerView/${sessionID}`, '_blank');
};

const DropDownSessionMenu = ({savedEncounters, socket}) => {
    const [currentEncounter, setCurrentEncounter] = useState(null)
    const [sessionID, setSessionID] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const { username } = useUser();

    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        //session will hold sessionid and encounter for this user
        if(sessionID === null && username !== 'Username') {
            socket.emit("getCurrentSession", username);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [username]);

    useEffect(() => {
        if(savedEncounters.length === 0)
            setCurrentEncounter(null)
    }, [savedEncounters]);

    useEffect(() => {
        if(socket) {
            // Recieve messages from backend
            socket.on('sendSession', (sessionInfo) => {
                setSessionID(sessionInfo.sessionID)
                // streamingEncounterGuid can be empty if nothing is found in the backend
                setCurrentEncounter(savedEncounters.find(encounter => encounter.encounterGuid === sessionInfo.streamingEncounterGuid))
            });
        }
    }, [socket]);

    const handleDropDownOptionClicked = (event, encounter, openSessionTab=false) => {
        console.log(encounter?.encounterGuid)
        console.log(currentEncounter?.encounterGuid)
        console.log("====")
        if(!encounter) {
            socket.emit("stopStreaming", sessionID)
        } else if(encounter && encounter.encounterGuid !== currentEncounter?.encounterGuid) {
            socket.emit("startStreaming", encounter.encounterGuid, sessionID)
        } 

        if(openSessionTab)
            handleOpenSession(sessionID)

        //Set to null when stop was clicked
        setCurrentEncounter(encounter);
        event.stopPropagation(); 

    };

    let buttonString = currentEncounter ? `Streaming: ${currentEncounter.encounterName}` : "Not Streaming..."
    if(username === 'Username') {
        buttonString = "Sign in to stream"
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dmViewButton" onClick={() => setIsOpen(!isOpen)}>
                {buttonString}
            </button>
            {isOpen && savedEncounters.length !== 0 && (
                <ul className="dropdownMenu">
                    {username !== "Username" &&
                        <>
                            {savedEncounters.map((encounter, index) => (
                                <li
                                    key={encounter.encounterName + index}
                                    onClick={(event) => handleDropDownOptionClicked(event, encounter)}
                                    className="dropdown-item"
                                >
                                    {encounter.encounterName} 
                                </li>
                            ))}
                            { currentEncounter &&
                                <> 
                                
                                    {sessionID &&
                                        <li className='dropdown-item' style={{borderTop: '1px solid black'}} 
                                            onClick={() => {
                                                handleOpenSession(sessionID)
                                                setIsOpen(false)
                                            }}
                                        >
                                            Open Player View 📺
                                        </li>
                                    }
                                    <li className="dropdown-item" 
                                        onClick={(event) => {
                                            handleDropDownOptionClicked(event, null)
                                            setIsOpen(false)
                                        }}
                                    >
                                        Stop Streaming
                                    </li>
                                </>
                            }
                        </>
                    }
                </ul>
            )}
        </div>
    );
};

export default DropDownSessionMenu;

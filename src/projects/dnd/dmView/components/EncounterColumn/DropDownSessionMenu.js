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
    const [streamingEncounter, setStreamingEncounter] = useState({encounterName: null, encounterGuid: null})
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
            socket.emit("getCurrentSession");
        }

        if(username === 'Username') {
            setStreamingEncounter({encounterName: null, encounterGuid: null})
            setSessionID(null)
            setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [username]);

    useEffect(() => {
        
        if(savedEncounters.length === 0) { setStreamingEncounter({encounterName: null, encounterGuid: null}) }
        else if(sessionID && streamingEncounter.encounterName === '') {
            savedEncounters.forEach(e => {
                if(e.encounterGuid === streamingEncounter.encounterGuid) {
                    setStreamingEncounter({encounterGuid: e.encounterGuid, encounterName: e.encounterName})
                    console.log(`Found stream: ${e.encounterName} - (${e.encounterGuid})`)
                }
            });

        }
    }, [savedEncounters]);

    useEffect(() => {
        if(socket) {
            // Recieve messages from backend
            socket.on('sendSession', (sessionInfo) => {
                setSessionID(sessionInfo.sessionID)
                if(sessionInfo.streamingEncounterGuid !== '' && savedEncounters.length === 0) {
                    console.log("No saved encounters yet since no savedEncounters ")
                    setStreamingEncounter({encounterGuid: sessionInfo.streamingEncounterGuid, encounterName: ''})
                } else {
                    // streamingEncounterGuid can be empty if nothing is found in the backend
                    let log = "No Stream found..."
                    savedEncounters.forEach(e => {
                        if(e.encounterGuid === sessionInfo.streamingEncounterGuid) {
                            setStreamingEncounter({encounterGuid: e.encounterGuid, encounterName: e.encounterName})
                            log = `Found stream: ${e.encounterName} - (${e.encounterGuid})`
                        }
                    });
                    console.log(log)
                }
                
            });
        }
    }, [socket]);

    const handleDropDownOptionClicked = (event, e, openSessionTab=false) => {
        if(e === null) {
            socket.emit("stopStreaming", sessionID)
            setStreamingEncounter({encounterName: null, encounterGuid: null})
        } else if(e.encounterGuid !== streamingEncounter.encounterGuid) {
            socket.emit("startStreaming", e.encounterGuid, sessionID)
            setStreamingEncounter({encounterName: e.encounterName, encounterGuid: e.encounterGuid})
        } 

        if(openSessionTab)
            handleOpenSession(sessionID)

        //Set to null when stop was clicked
        event.stopPropagation(); 

    };

    let buttonString = streamingEncounter.encounterGuid === null ? `Not Streaming...` : "Streaming: "
    if(username === 'Username') {
        buttonString = "Sign in to stream"
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dmViewButton" disabled={username === 'Username'} onClick={() => setIsOpen(!isOpen)}>
                {buttonString}
                {streamingEncounter.encounterName !== null && 
                    <p style={{margin: 0, textWrap: 'nowrap'}}>
                        {streamingEncounter.encounterName} 🔴
                    </p>
                }
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
                                    {encounter.encounterName} {encounter.encounterGuid === streamingEncounter.encounterGuid && <>🔴</>}
                                </li>
                            ))}
                            {streamingEncounter.encounterGuid !== null &&
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

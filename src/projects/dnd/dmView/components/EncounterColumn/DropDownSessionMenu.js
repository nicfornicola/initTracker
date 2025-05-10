import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../../../../../providers/UserProvider';
import magPlus from '../../pics/icons/magPlus.PNG'
import magMinus from '../../pics/icons/magMinus.PNG'
import OptionButton from './OptionButton';
import streaming from '../../pics/icons/streaming.gif';
import { handleOpenSession } from '../../constants';



const DropDownSessionMenu = ({streamingEncounter, setStreamingEncounter, adminView, savedEncounters, socket}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { username, sessionID, setSessionID } = useUser();

    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleSetStreamingEncounter = (eGuid, eName) => {
        let openedWindow = true;
        if(sessionID) {
            //if encounter is clicked
            if(eGuid !== null) {
                // if playerwindow has not been opened
                if(!streamingEncounter.playerWindowOpen) {
                    handleOpenSession(sessionID)
                }
            // if stopped streaming
            } else {
                openedWindow = false;
            }
        }

        setStreamingEncounter({encounterGuid: eGuid, encounterName: eName, playerWindowOpen: openedWindow})
    }

    useEffect(() => {
        if(username !== 'Username') {
            console.log("Signed in - getting current session")
            socket.emit("getCurrentSession");
        } else {
            handleSetStreamingEncounter(null, null)
            setSessionID(null)
            setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [username]);

    useEffect(() => {
        if(savedEncounters.length === 0) { 
            handleSetStreamingEncounter(null, null)
        } else if(sessionID && streamingEncounter.encounterName === '') {
            savedEncounters.forEach(e => {
                if(e.encounterGuid === streamingEncounter.encounterGuid) {
                    handleSetStreamingEncounter(e.encounterGuid, e.encounterName)
                    console.log(`Found stream: ${e.encounterName} - (${e.encounterGuid})`)
                }
            });

        }
    }, [savedEncounters]);

    useEffect(() => {
        if(socket) {
            // Recieve messages from backend
            socket.on('sendSession', (sessionInfo) => {
                console.log("Session info recieved - ", sessionInfo)
                setSessionID(sessionInfo.sessionID)
                // streamingEncounterGuid can be empty if nothing is found in the backend
                let log = "No Stream found..."
                savedEncounters.forEach(e => {
                    if(e.encounterGuid === sessionInfo.streamingEncounterGuid) {
                        handleSetStreamingEncounter(e.encounterGuid, e.encounterName)
                        log = `Found stream: ${e.encounterName} - (eGuid: ${e.encounterGuid})`
                    }
                });
                console.log(log)
            });
        }
    }, [socket]);

    const handleDropDownOptionClicked = (event, e, openSessionTab=false) => {
        if(e === null) {
            socket.emit("stopStreaming", sessionID)
            handleSetStreamingEncounter(null, null)
        } else if(e.encounterGuid !== streamingEncounter.encounterGuid) {
            socket.emit("startStreaming", e.encounterGuid, sessionID)
            handleSetStreamingEncounter(e.encounterGuid, e.encounterName)
        } 

        if(openSessionTab)
            handleOpenSession(sessionID)

        event.stopPropagation(); 
    };
    
    const iconSizeChange = (sizeType) => {
        socket.emit("iconSizeChange", sizeType, streamingEncounter.encounterGuid, username)
    };

    let buttonString = streamingEncounter.encounterGuid === null ? `Stream Player View...` : "Streaming "
    if(username === 'Username') {
        buttonString = "Sign in to stream"
    }

    return (
        <>
            <div className="dropdown" ref={dropdownRef}>
                <button className="dmViewButton" style={{borderRight: 0, paddingTop: '0px', paddingRight: '10px'}} disabled={username === 'Username'} onClick={() => setIsOpen(!isOpen)}>
                    <i>{buttonString}</i> 
                    {streamingEncounter.encounterName !== null && 
                        <>
                            <img alt='streaming' className='streamingGif' src={streaming} />
                            <p style={{margin: 0, textAlign: 'left', textWrap: 'nowrap'}}>
                                <b>{streamingEncounter.encounterName}</b>
                            </p>
                        </>
                    }
                </button>
                {isOpen && savedEncounters.length !== 0 && (
                    <ul className="dropdownMenu">
                        {username !== "Username" &&
                            <>
                           
                            {streamingEncounter.encounterGuid !== null ? (
                                <> 
                                    {sessionID &&
                                        <li className='dropdown-item' style={{}} onClick={() => { handleOpenSession(sessionID); setIsOpen(false)}}>
                                            <strong>Open Player View</strong> 📺
                                        </li>
                                    }
                                    <li className="dropdown-item" 
                                        onClick={(event) => {
                                            handleDropDownOptionClicked(event, null)
                                            setIsOpen(false)
                                        }}
                                        style={{textDecoration: 'underline', textDecorationThickness: '2px', textDecorationColor: 'red', borderBottom: '2px solid black'}}
                                    >
                                        Stop Streaming
                                    </li>
                                </>
                            ) : (
                                <li className='dropdown-item' style={{borderBottom: '2px solid black'}}>
                                    <strong>Select An Encounter To Stream</strong>
                                </li>
                            )}
                                {savedEncounters.map((encounter, index) => (
                                    <li
                                        key={encounter.encounterName + index}
                                        onClick={(event) => handleDropDownOptionClicked(event, encounter)}
                                        className="dropdown-item"
                                    >
                                        {encounter.encounterName || <i style={{fontSize: "small"}}>No Title</i>} 
                                        {adminView && <strong>{encounter.username}</strong>}
                                        {encounter.encounterGuid === streamingEncounter.encounterGuid && 
                                            <img alt='streaming' className='streamingGif' src={streaming} />
                                        }
                                    </li>
                                ))}
                                
                            </>
                        }
                    </ul>
                )}
            </div>
            {sessionID && streamingEncounter.encounterGuid !== null &&
                <div className='magWrapper'>
                    <OptionButton imgClassName={'magOptions'} src={magPlus} message={"Icon Size: Grow"} onClickFunction={()=> iconSizeChange("+")}/>
                    <OptionButton imgClassName={'magOptions'} src={magMinus} message={"Icon Size: Shrink"} onClickFunction={()=> iconSizeChange("-")}/>
                </div>
            }
        </>
    );
};

export default DropDownSessionMenu;

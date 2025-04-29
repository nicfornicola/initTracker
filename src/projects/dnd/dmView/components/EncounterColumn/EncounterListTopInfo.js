import React, { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import NewEncounterButton from './NewEncounterButton';
import DropDownSessionMenu from './DropDownSessionMenu';
import { useUser } from '../../../../../providers/UserProvider';


const EncounterListTopInfo = ({streamingEncounter, setStreamingEncounter, savedEncounters, setSavedEncounters, handleLoadEncounter, handleNewEncounter, socket}) => {
    const { username } = useUser();
    const [adminView, setAdminView] = useState(null);
    const [regEncounters, setRegEncounters] = useState([]);
    const [adminEncounters, setAdminEncounters] = useState([]);

    useEffect(() => {
            if(socket) {
                socket.on('sendAdminEncounters', (encountersResponse) => {
                    encountersResponse.sort((a, b) => a.username.localeCompare(b.username));
                    setRegEncounters(savedEncounters)           
                    setAdminEncounters(encountersResponse)
                    setSavedEncounters(encountersResponse)
                });
            }
    
            // Clean up the socket connection on component unmount
            return () => {
                if(socket) socket.disconnect();
            };
    }, [socket]);

    const handleClick = (event) => {

        // if adminView null then get data for first adminLoad
        if(adminView === null) {
            socket.emit('getAdminEncounter')
        // if adminView true or false then data is already loaded just show it
        } else if(event.target.checked) {
            setRegEncounters(savedEncounters)
            setSavedEncounters(adminEncounters)
        } else {
            setSavedEncounters(regEncounters)
        }

        setAdminView(event.target.checked)
    }

    return (
        <div className='creatEncounterTopInfo'>
            <h3 className='titleFontFamily'>Current Encounter </h3>
            {username !== 'Username' &&
                <div style={{fontSize: '10px', fontStyle: "oblique"}}> 
                    Logged in - <strong>{username}</strong>
                </div>
            }
            {username === 'Username' && 
                <div className='saveDisclaimer'>
                    Sign in to save Encounters
                </div>
            }
            <div className='dmViewButtonContainer'>
                <DropdownMenu adminView={adminView} savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters} handleLoadEncounter={handleLoadEncounter} socket={socket}/>
                <NewEncounterButton handleNewEncounter={handleNewEncounter} />
                <DropDownSessionMenu streamingEncounter={streamingEncounter} setStreamingEncounter={setStreamingEncounter} streamingEncounteradminView={adminView} savedEncounters={savedEncounters} socket={socket}/>
                {username === 'nicadmin' && <input type='checkbox' onClick={(event) => handleClick(event)}/>}
            </div>
        </div>
    );
}

export default EncounterListTopInfo;
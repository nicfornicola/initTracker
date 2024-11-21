import React from 'react';
import DropdownMenu from './DropdownMenu';
import NewEncounterButton from './NewEncounterButton';
import DropDownSessionMenu from './DropDownSessionMenu';
import { useUser } from '../../../../../providers/UserProvider';


const EncounterListTopInfo = ({savedEncounters, setSavedEncounters, handleLoadEncounter, currentEncounter, setCurrentEncounter, handleNewEncounter, socket}) => {
    const { username } = useUser();

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
                <DropdownMenu savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters} setCurrentEncounter={setCurrentEncounter} handleLoadEncounter={handleLoadEncounter} currentEncounter={currentEncounter} socket={socket}/>
                <NewEncounterButton handleNewEncounter={handleNewEncounter} />
                <DropDownSessionMenu savedEncounters={savedEncounters} socket={socket}/>
            </div>
        </div>
    );
}

export default EncounterListTopInfo;
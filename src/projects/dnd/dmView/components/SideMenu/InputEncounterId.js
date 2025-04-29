import React, { useState } from 'react';

import { generateUniqueId, INIT_ENCOUNTER_NAME } from '../../constants';
import EncounterImage from '../../pics/icons/importDndBEncounter.png'
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { ImportDndBeyondEncounter } from '../../api/ImportDndBeyondEncounter'
import { ImportDndBeyondMonsters } from '../../api/ImportDndBeyondMonsters'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useUser } from '../../../../../providers/UserProvider';
import { useEncounter } from '../../../../../providers/EncounterProvider';

function InputEncounterId({encounterGuid, setError, socket, onClick=() => {}}) { 
    const [dndbEncounterId, setDndbEncounterId] = useState('');
    const eGuid = encounterGuid || generateUniqueId();
    const {addImportedPlayers} = useImportedPlayers();
    const {username} = useUser();
    const {currentEncounter, dispatchEncounter} = useEncounter();
    

    const handleDndBEncounterId = (event) => {
        let input = event.target.value;
        // Remove all characters that are NOT numbers letters, hyphens or commas
        input = input.replace(/[^a-z0-9,-]/g, '');

        if(input !== event.target.value) {
            setError(2)
        }

        setDndbEncounterId(input)
    };  

    const handleDndEncounterImport = async () => {
        try {
            // Get all monster stats (except image)
            const data = await ImportDndBeyondEncounter(dndbEncounterId);
            if(data) {
                const {monsters, players} = data.data;
                // Turn the players objects into an array of numbers to match user input
                const playerIds = players.map(player => player.id);
                const dmbPlayers = await ImportDndBeyondCharacters(playerIds, eGuid, players, username);
                addImportedPlayers(dmbPlayers)

                if(currentEncounter.creatures.length === 0 && currentEncounter.encounterName === INIT_ENCOUNTER_NAME) {
                    socket.emit("newEncounter", eGuid, data.data.name)
                }

                const validPlayers = dmbPlayers.filter(player => player.status === 200);
                socket.emit("importedDndBCreatures", validPlayers, username);
                console.log("Creatures Imported!")
                dispatchEncounter({
                    type: 'SET_ENCOUNTER',
                    payload: {
                        encounterGuid: eGuid,
                        encounterName: data.data.name,
                        creatures: [...currentEncounter.creatures, ...validPlayers],
                    }
                })

            }
        } catch (error) {
            console.warn(error)
        }  
    }

    return (
        <div className='dndBImportContainer'>
            <img src={EncounterImage} alt="Click to Upload" className="menuIconImports" onClick={onClick}/>
            <div className='dndBImportButtons'>
                <input
                    className='dndbInput'
                    type="text"
                    placeholder='DndB Encounter ID'
                    value={dndbEncounterId}
                    onChange={handleDndBEncounterId}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleDndEncounterImport();
                        }
                    }}
                />
                <div>
                    {dndbEncounterId.length !== 0 && <button className='dndbInputButtonSearch' onClick={() => handleDndEncounterImport()}> 🔍 </button>}
                </div>
            </div>
        </div>
    );
}

export default InputEncounterId;

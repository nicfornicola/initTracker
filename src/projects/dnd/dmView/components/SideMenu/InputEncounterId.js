import React, { useState } from 'react';

import { generateUniqueId, INIT_ENCOUNTER_NAME } from '../../constants';
import EncounterImage from '../../pics/icons/importDndBEncounter.png'
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { ImportDndBeyondEncounter } from '../../api/ImportDndBeyondEncounter'
import { ImportDndBeyondMonsters } from '../../api/ImportDndBeyondMonsters'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';

function InputEncounterId({setCurrentEncounter, encounterGuid, socket, onClick=() => {}}) { 
    const [dndbEncounterId, setDndbEncounterId] = useState('ece19692-6830-4ad3-9e28-ed612f3de79b');
    const eGuid = encounterGuid || generateUniqueId();
    const {setImportedPlayers} = useImportedPlayers();

    const handleDndBEncounterId = (event) => {
        let input = event.target.value;
        setDndbEncounterId(input)
    }

    const handleDndEncounterImport = async () => {
        try {
            // Get all monster stats (except image)
            const data = await ImportDndBeyondEncounter(dndbEncounterId);
            if(data) {
                const {monsters, players} = data.data;
                // Turn the players objects into an array of numbers to match user input
                const playerIds = players.map(player => player.id);
                const dmbPlayers = await ImportDndBeyondCharacters(playerIds, eGuid, players);
                setImportedPlayers((prev) => {return [...prev, ...dmbPlayers]})

                // Send the whole monsters object since it comes with hp data
                const dmbMonsters = await ImportDndBeyondMonsters(monsters, eGuid);
                socket.emit("addEncounter")
                setCurrentEncounter(prev => {
                    if(prev.creatures.length === 0 && prev.encounterName === INIT_ENCOUNTER_NAME) {
                        socket.emit("newEncounter", eGuid, data.data.name)
                    }

                    const newCreatures = [...dmbPlayers, ...dmbMonsters];
                    socket.emit("importedDndBCreatures", newCreatures);
                    return {
                      ...prev,
                      encounterGuid: eGuid,
                      encounterName: data.data.name,
                      creatures: [...prev.creatures, ...newCreatures]
                    };
                });
                console.log("Creatures Imported!")
            }
        } catch (error) {
            console.warn(error)
        }  
    }

    return (
        <div className='dndBImportContainer'>
            <img src={EncounterImage} alt="Click to Upload" className="menuIcon" onClick={onClick}/>
            <div className='dndBImportButtons'>
                <input
                    className='dndbInput'
                    type="text"
                    placeholder='DndB Encounter ID'
                    value={dndbEncounterId}
                    onChange={handleDndBEncounterId}
                />
                <div>
                    {dndbEncounterId.length !== 0 && <button className='submitButton' onClick={() => handleDndEncounterImport()}>✅</button>}
                    {dndbEncounterId.length !== 0 && <button className='submitButton' onClick={() => setDndbEncounterId('')}>❌</button>}
                </div>
            </div>
        </div>
    );
}

export default InputEncounterId;

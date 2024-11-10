import React, { useState } from 'react';

import { generateUniqueId, INIT_ENCOUNTER_NAME } from '../../constants';
import EncounterImage from '../../pics/icons/importDndBEncounter.png'
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { ImportDndBeyondEncounter } from '../../api/ImportDndBeyondEncounter'
import { ImportDndBeyondMonsters } from '../../api/ImportDndBeyondMonsters'

function InputEncounterId({setCurrentEncounter, encounterGuid, socket}) { 
    //61523d85-da0d-47c8-a796-f9409be52c93
    //ed9784fc-5aba-473a-9ae9-166fed396e8e - save the king final garden
    const [dndbEncounterId, setDndbEncounterId] = useState('ece19692-6830-4ad3-9e28-ed612f3de79b');
    const eGuid = encounterGuid || generateUniqueId();

    const handleDndBEncounterId = (event) => {
        let input = event.target.value;
        setDndbEncounterId(input)
    }

    const handleDndEncounterImport = async () => {
        try {
            // Get all monster stats (except image)
            // aa3f3817-f44b-4116-b2e5-39e1eebc9f7d
            const data = await ImportDndBeyondEncounter(dndbEncounterId);
            if(data) {
                // const {monsters, players, turnNum, roundNum, inProgress} = data.data;
                const {monsters, players} = data.data;
                console.log(data.data)
                // Turn the players objects into an array of numbers to match user input
                const playerIds = players.map(player => player.id);
                const dmbPlayers = await ImportDndBeyondCharacters(playerIds, eGuid, players);

                // Send the whole monsters object since it comes with hp data
                const dmbMonsters = await ImportDndBeyondMonsters(monsters, eGuid);
                socket.emit("addEncounter")
                setCurrentEncounter(prev => {

                    if(prev.creatures.length === 0 && prev.encounterName === INIT_ENCOUNTER_NAME) {
                        socket.emit("newEncounter", eGuid, data.data.name)
                    }

                    const newCreatures = [...dmbPlayers, ...dmbMonsters];
                    console.log(newCreatures)
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
            <img src={EncounterImage} alt="Click to Upload" className="menuIcon" />
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

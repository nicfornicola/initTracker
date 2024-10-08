import React, { useState } from 'react';

import { generateUniqueId } from '../../constants';
import EncounterImage from '../../pics/icons/importDndBEncounter.png'
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { ImportDndBeyondEncounter } from '../../api/ImportDndBeyondEncounter'
import { ImportDndBeyondMonsters } from '../../api/ImportDndBeyondMonsters'

function InputEncounterId({setCurrentEncounter}) { 
    //61523d85-da0d-47c8-a796-f9409be52c93
    //ed9784fc-5aba-473a-9ae9-166fed396e8e - save the king final garden
    const [dndbEncounterId, setDndbEncounterId] = useState('ece19692-6830-4ad3-9e28-ed612f3de79b');
    
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
                
                // Turn the players objects into an array of numbers to match user input
                const playerIds = players.map(player => player.id);
                const dmbPlayers = await ImportDndBeyondCharacters(playerIds, players);

                // Send the whole monsters object since it comes with hp data
                const dmbMonsters = await ImportDndBeyondMonsters(monsters);

                setCurrentEncounter(prev => ({...prev, guid: generateUniqueId(),
                    currentEncounterCreatures: [...prev.currentEncounterCreatures, 
                                                ...dmbPlayers, 
                                                ...dmbMonsters]
                }))
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
                    accept='.json'
                    id="fileInput"
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

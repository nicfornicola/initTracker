import React, { useState } from 'react';

import ChampionImage from '../../pics/icons/refreshPlayers.png'

import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { generateUniqueId, INIT_ENCOUNTER_NAME} from '../../constants'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useUser } from '../../../../../providers/UserProvider';
import { useEncounter } from '../../../../../providers/EncounterProvider';

function InputCharacterId({encounterGuid, setError, socket}) {
    const [playerNumbers, setPlayerNumbers] = useState([]);
    const [playerNumberInputValue, setPlayerNumberInputValue] = useState('');
    const eGuid = encounterGuid || generateUniqueId();
    const {currentEncounter, dispatchEncounter} = useEncounter();
    const {addImportedPlayers} = useImportedPlayers();
    const {username} = useUser();

    const handlePlayerNumbers = (event) => {
        let input = event.target.value;
        // Remove all characters that are NOT numbers or commas
        input = input.replace(/[^0-9,]/g, '');

        if(input !== event.target.value) {
            setError(1)
        }

        // Prevent multiple consecutive commas (e.g., "1,,2" → "1,2")
        input = input.replace(/,{2,}/g, ',');
        const numbersArray = input.split(',');

        setPlayerNumberInputValue(input);
        setPlayerNumbers(numbersArray);
    };  

    const handleDndCharacterImport = async () => {
        const playerDataArray = await ImportDndBeyondCharacters(playerNumbers, eGuid, undefined, username);

        addImportedPlayers(playerDataArray)

        if(currentEncounter.creatures.length === 0 && currentEncounter.encounterName === INIT_ENCOUNTER_NAME) {
            socket.emit("newEncounter", eGuid)
            console.log('newEncounter')
            dispatchEncounter({
                type: 'SET_ENCOUNTER',
                payload: {
                    encounterGuid: eGuid,
                },
            });
        }

        socket.emit("importedDndBCreatures", playerDataArray, username);
        console.log('importedDndBCreatures')
        dispatchEncounter({
            type: 'ADD_CREATURES_ARRAY',
            payload: {
                creatureArray: playerDataArray,
            },
        });

        setPlayerNumbers([])
        setPlayerNumberInputValue('')
    }

    return (
        <div className='dndBImportContainer'>
            <img src={ChampionImage} alt="Click to Upload" className="menuIconImports"/>
            <div className='dndBImportButtons'>
                <input
                    className='dndbInput'
                    type="text"
                    accept='.json'
                    id="fileInput"
                    placeholder='DndB Character ID'
                    value={playerNumberInputValue}
                    onChange={handlePlayerNumbers}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleDndCharacterImport();
                        }
                    }}
                />
                <div>
                    {playerNumberInputValue.length !== 0 && 
                        <button className='dndbInputButtonSearch' onClick={() => handleDndCharacterImport()}> 
                            🔍 
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default InputCharacterId;

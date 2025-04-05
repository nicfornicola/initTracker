import React, { useState } from 'react';

import ChampionImage from '../../pics/icons/refreshPlayers.png'

import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { generateUniqueId, INIT_ENCOUNTER_NAME} from '../../constants'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useUser } from '../../../../../providers/UserProvider';

function InputCharacterId({setCurrentEncounter, encounterGuid, setError, socket}) {
    const [playerNumbers, setPlayerNumbers] = useState([]);
    const [playerNumberInputValue, setPlayerNumberInputValue] = useState('');
    const eGuid = encounterGuid || generateUniqueId();
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
        setCurrentEncounter(prev => {
            if(prev.creatures.length === 0 && prev.encounterName === INIT_ENCOUNTER_NAME) {
                socket.emit("newEncounter", eGuid)
            }

            socket.emit("importedDndBCreatures", playerDataArray, username);

            return {
            ...prev,
            encounterGuid: eGuid,
            creatures: [...prev.creatures, ...playerDataArray]
        }
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

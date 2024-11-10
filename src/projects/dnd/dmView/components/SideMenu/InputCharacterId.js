import React, { useState } from 'react';

import ChampionImage from '../../pics/icons/refreshPlayers.png'
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { generateUniqueId, INIT_ENCOUNTER_NAME} from '../../constants'

function InputCharacterId({setCurrentEncounter, encounterGuid, socket}) {
    const [playerNumbers, setPlayerNumbers] = useState([]);
    const [playerNumberInputValue, setPlayerNumberInputValue] = useState('');
    const eGuid = encounterGuid || generateUniqueId();

    const handlePlayerNumbers = (event) => {
        let input = event.target.value;
        const numbersArray = input.replace(/\s+/g, '').split(',');
        setPlayerNumberInputValue(input)
        setPlayerNumbers(numbersArray)
    }    

    //124519382, 124686426, 124687100, 125381766, 125717017, 125809224]
    const handleDndCharacterImport = async () => {
        const playerData = await ImportDndBeyondCharacters(playerNumbers, eGuid);
        
        setCurrentEncounter(prev => {

            if(prev.creatures.length === 0 && prev.encounterName === INIT_ENCOUNTER_NAME) {
                socket.emit("newEncounter", eGuid)
            }

            socket.emit("importedDndBCreatures", playerData);

            return {
            ...prev,
            encounterGuid: eGuid,
            creatures: [...prev.creatures, ...playerData]
          }
        });        
        setPlayerNumbers([])
        setPlayerNumberInputValue('')
    }

    return (
        <div className='dndBImportContainer'>
            <img src={ChampionImage} alt="Click to Upload" className="menuIcon" />
            <div className='dndBImportButtons'>
                <input
                    className='dndbInput'
                    type="text"
                    accept='.json'
                    id="fileInput"
                    placeholder='DndB Character ID'
                    value={playerNumberInputValue}
                    onChange={handlePlayerNumbers}
                />
                <div>
                    {playerNumberInputValue.length !== 0 && <button className='submitButton' onClick={() => handleDndCharacterImport()}>✅</button>}
                    {playerNumberInputValue.length !== 0 && <button className='submitButton' onClick={() => setPlayerNumberInputValue('')}>❌</button>}
                </div>
            </div>
        </div>
    );
}

export default InputCharacterId;

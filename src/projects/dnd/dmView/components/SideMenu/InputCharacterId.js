import React, { useState } from 'react';

import ChampionImage from '../../pics/icons/refreshPlayers.png'

import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import { generateUniqueId, INIT_ENCOUNTER_NAME} from '../../constants'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';

function InputCharacterId({setCurrentEncounter, encounterGuid, socket, onClick=() => {}}) {
    const [playerNumbers, setPlayerNumbers] = useState([]);
    const [playerNumberInputValue, setPlayerNumberInputValue] = useState('');
    const eGuid = encounterGuid || generateUniqueId();
    const {addImportedPlayer} = useImportedPlayers();

    const handlePlayerNumbers = (event) => {
        let input = event.target.value;
        const numbersArray = input.replace(/\s+/g, '').split(',');
        setPlayerNumberInputValue(input)
        setPlayerNumbers(numbersArray)
    }    

    const handleDndCharacterImport = async () => {
        const playerDataArray = await ImportDndBeyondCharacters(playerNumbers, eGuid);

        addImportedPlayer(playerDataArray)

        setCurrentEncounter(prev => {

            if(prev.creatures.length === 0 && prev.encounterName === INIT_ENCOUNTER_NAME) {
                socket.emit("newEncounter", eGuid)
            }

            socket.emit("importedDndBCreatures", playerDataArray);

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
            <img src={ChampionImage} alt="Click to Upload" className="menuIconImports" onClick={onClick}/>
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
                    {playerNumberInputValue.length !== 0 && <button className='dndbInputButtonSearch' onClick={() => handleDndCharacterImport()}> 🔍 </button>}
                </div>
            </div>
        </div>
    );
}

export default InputCharacterId;

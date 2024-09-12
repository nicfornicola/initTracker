import React, { useState } from 'react';
import Search from '../pics/search.png'
import Download from '../pics/download.png'
import JsonImg from '../pics/json.png'
import ChampionImage from '../../playerView/pics/icons/refreshPlayers.png'
import { ImportDndBeyondCharacters } from '../api/ImportDndBeyondCharacters'
import { ImportDndBeyondEncounter } from '../api/ImportDndBeyondEncounter'
import { ImportDndBeyondMonsters } from '../api/ImportDndBeyondMonsters'

function downloadLocalStorage() {
    // Create an object to store all local storage data
    const localStorageData = {};

    // Loop through all keys in local storage and store them in the object
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
    }

    // Convert the object to a JSON string
    const dataStr = JSON.stringify(localStorageData, null, 2);

    // Create a Blob object from the JSON string
    const blob = new Blob([dataStr], { type: "application/json" });

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "localStorageData.json";

    // Append the anchor to the body, trigger the download, and then remove the anchor
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function SideMenu({uploadLocalStorage, setCurrentEncounter, showSearchList, setShowSearchList}) {
    const [isOpen, setIsOpen] = useState(false);
    const [playerNumbers, setPlayerNumbers] = useState([]);
    const [dndbEncounterId, setDndbEncounterId] = useState('aa3f3817-f44b-4116-b2e5-39e1eebc9f7d');
    const [playerNumberInputValue, setPlayerNumberInputValue] = useState('');

    // Toggle the menu state
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

    const handlePlayerNumbers = (event) => {
        let input = event.target.value;
        const numbersArray = input.replace(/\s+/g, '').split(',');
        setPlayerNumberInputValue(input)
        setPlayerNumbers(numbersArray)
    }    
    
    const handleDndBEncounterId = (event) => {
        let input = event.target.value;
        setDndbEncounterId(input)
    }

    //124519382, 124686426, 124687100, 125381766, 125717017, 125809224]
    const handleDndCharacterImport = async () => {
        const playerData = await ImportDndBeyondCharacters(playerNumbers);
        console.log("playerData:", playerData)
        setCurrentEncounter(prev => ({...prev, currentEncounterCreatures: [...prev.currentEncounterCreatures, ...playerData]}))
        setPlayerNumbers([])
        setPlayerNumberInputValue('')
    }

    const handleDndEncounterImport = async () => {
        console.log("import encounter: ", dndbEncounterId)
        try {
            // Get all monster stats (except image)
            // aa3f3817-f44b-4116-b2e5-39e1eebc9f7d
            const data = await ImportDndBeyondEncounter(dndbEncounterId);
            if(data) {
                const {monsters, players, turnNum, roundNum, inProgress} = data.data;
                
                // Turn the players objects into an array of numbers to match user input
                const playerIds = players.map(player => player.id);
                const dmbPlayers = await ImportDndBeyondCharacters(playerIds);

                // Send the whole monsters object since it comes with hp data
                const dmbMonsters = await ImportDndBeyondMonsters(monsters);

                setCurrentEncounter(prev => ({...prev, 
                    currentEncounterCreatures: [...prev.currentEncounterCreatures, ...dmbPlayers, ...dmbMonsters]}))
                console.log("Creatures Imported!")

            }
        } catch (error) {
            console.log(error)
            // setErrorMessage(error)
            // setError(true)
        }  
    }

    return (
        <div className={`side-menu ${isOpen ? 'open' : ''}`}>
            <button className="toggle-button" onClick={toggleMenu}>
                {isOpen ? '<<' : '>>'}
            </button>
            <ul className='menu'>
                <li className='menuItem' onClick={() => setShowSearchList(!showSearchList)}>
                    <img className='menuIcon' alt='monsterSearch' src={Search}/> {showSearchList ? 'Hide' : 'Show'} Search
                </li>
                <li className='menuItem'>
                    <img className='menuIcon' alt='jsonDownload' src={Download} onClick={downloadLocalStorage} /> Download Saves
                </li>
                <li className='menuItem' onClick={handleImageClick}>
                    <img src={JsonImg} alt="Click to Upload" className="menuIcon" /> Upload Saves
                    <input
                        type="file"
                        accept='.json'
                        id="fileInput"
                        style={{ display: 'none' }}
                        onChange={uploadLocalStorage}
                    />
                </li>
                <li className='menuItem' onClick={() => setIsOpen(true)}>
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
                </li>
                <li className='menuItem' onClick={() => setIsOpen(true)}>
                    <div className='dndBImportContainer'>
                        <img src={ChampionImage} alt="Click to Upload" className="menuIcon" />
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
                    
                </li>
            </ul>
        </div>
    );
}

export default SideMenu;

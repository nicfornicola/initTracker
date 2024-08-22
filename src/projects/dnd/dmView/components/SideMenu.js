import React, { useState } from 'react';
import Search from '../pics/search.png'
import Download from '../pics/download.png'
import JsonImg from '../pics/json.png'
import ChampionImage from '../../playerView/pics/icons/refreshPlayers.png'
import { ImportDndBeyondCharacters } from '../api/ImportDndBeyondCharacters'

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

function SideMenu({uploadLocalStorage, setCurrentEncounterCreatures, showSearchList, setShowSearchList}) {
    const [isOpen, setIsOpen] = useState(false);
    const [playerNumbers, setPlayerNumbers] = useState([]);
    const [inputValue, setInputValue] = useState('');


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
        setInputValue(input)
        setPlayerNumbers(numbersArray)
    }

    //124519382, 124686426, 124687100, 125381766, 125717017, 125809224]
    const handleDndCharacterImport = async () => {
        const playerData = await ImportDndBeyondCharacters(playerNumbers);

        setCurrentEncounterCreatures((prev) => [...prev, ...playerData])
        setPlayerNumbers([])
        setInputValue('')
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
                    <img src={ChampionImage} alt="Click to Upload" className="menuIcon" />
                    <button className='submitButton' onClick={() => handleDndCharacterImport()}>✅</button>
                    <input
                        type="text"
                        accept='.json'
                        id="fileInput"
                        placeholder='DndBeyond Chararacter Upload'
                        value={inputValue}
                        onChange={handlePlayerNumbers}
                    />
                </li>
            </ul>
        </div>
    );
}

export default SideMenu;

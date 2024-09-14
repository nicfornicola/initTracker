import React, { useState } from 'react';
import Search from '../pics/search.png'
import Download from '../pics/download.png'
import JsonImg from '../pics/json.png'
import InputCharacterId from './InputCharacterId';
import InputEncounterId from './InputEncounterId';

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

    // Toggle the menu state
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

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
                    <InputCharacterId setCurrentEncounter={setCurrentEncounter}/>
                </li>
                <li className='menuItem' onClick={() => setIsOpen(true)}>
                    <InputEncounterId setCurrentEncounter={setCurrentEncounter} />
                </li>
            </ul>
        </div>
    );
}

export default SideMenu;

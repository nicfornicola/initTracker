import React, { useState } from 'react';
import Search from '../../pics/search.png'
import LoginImage from '../../pics/icons/login.png'
import questionMark from '../../pics/icons/questionMark.png'
import Patreon from '../../pics/patreon_logo.png'
import InputCharacterId from './InputCharacterId';
import InputEncounterId from './InputEncounterId';
import SignIn from '../SignIn';

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

function SideMenu({uploadLocalStorage, setCurrentEncounter, showSearchList, setShowSearchList, encounterGuid, socket}) {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the menu state
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`side-menu ${isOpen ? 'open' : ''}`}>
            <button className="toggle-button" onClick={toggleMenu}>
                {isOpen ? '<<' : '>>'}
            </button>
            <div className='menu'>
                <div className='menuItem' onClick={() => setShowSearchList(!showSearchList)}>
                    <img className='menuIcon' alt='monsterSearch' src={Search}/> {showSearchList ? 'Hide' : 'Show'} Search
                </div>
                
                {/* <li className='menuItem'>
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
                </li> */}

                <hr/>
                <div className='menuItem' >
                    <div className='loginImageFlex'>
                        <img src={LoginImage} alt="Login" className="menuIcon" onClick={() => setIsOpen(!isOpen)} />
                        <SignIn socket={socket}/>
                    </div>
                    
                </div>                    
                
                <div className='menuItemLow'>
                    <div>
                        <a className='menuHelpLink' href='https://patreon.com/DmBuddy' target="_blank"> 
                            <img src={Patreon} alt="Patreon" className="menuIcon" /> DmBuddy's Patreon
                        </a>
                    </div>
                    <div >
                        <a className='menuHelpLink' href='/help'> 
                            <img src={questionMark} alt="Click to Upload" className="menuIcon" /> Help  Page
                        </a>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default SideMenu;

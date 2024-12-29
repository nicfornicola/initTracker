import React from 'react';
import '../../dmView/style/App.css';
import InputEncounterId from './SideMenu/InputEncounterId.js';
import InputCharacterId from './SideMenu/InputCharacterId.js';
import DropdownMenu from './EncounterColumn/DropdownMenu.js';
import SignIn from './SignIn.js';

const Home = ({savedEncounters, setSavedEncounters, currentEncounter, setCurrentEncounter, encounterGuid, handleNewEncounter, handleLoadEncounter, socket}) => {

    return (
        <div className='firstLoadMenuContainer'>
            <div className='firstLoadMenu'>
                <div className='homepageTopContent'>
                    <h1>DmBuddy.com</h1>
                    <span>
                        Home Brew Focused Encounter Builder and Player View
                    </span>
                    <span className='firstLoadExtra'>
                        (with Dnd Beyond Importing)
                    </span>
                </div>

                <div className="homePageGrid">
                    <div className="gridCell largeCell">
                        <SignIn socket={socket}/>
                    </div>
                    <div className="gridCell">
                        <button className='homePageButton' onClick={handleNewEncounter} > New Encounter </button>
                    </div>
                    <div className="gridCell">
                        <InputEncounterId 
                            setCurrentEncounter={setCurrentEncounter} 
                            encounterGuid={encounterGuid} 
                            socket={socket} 
                        />
                    </div>
                    <div className="gridCell">
                        <DropdownMenu 
                            setSavedEncounters={setSavedEncounters} 
                            savedEncounters={savedEncounters} 
                            handleLoadEncounter={handleLoadEncounter} 
                            currentEncounter={currentEncounter} 
                            setCurrentEncounter={setCurrentEncounter}
                            socket={socket} 
                        />
                    </div>
                    <div className="gridCell">
                        <InputCharacterId 
                            setCurrentEncounter={setCurrentEncounter} 
                            encounterGuid={encounterGuid} 
                            socket={socket} 
                        />
                    </div>
                </div>

                <a className='helpLink' href='/help'>DmBuddy.com/help</a>
            </div>
        </div>
    );
};

export default Home;
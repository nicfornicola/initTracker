// App.js
import {React, useState, useEffect} from 'react';

import { Route, Routes } from 'react-router-dom';
import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import DmView from './projects/dnd/dmView/components/DmView';
import { refreshMonsterProfiles, refreshPlayerProfiles } from './projects/dnd/dmView/refresh/refresh';
import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

import background1 from "./projects/dnd/playerView/pics/backgrounds/fallenCastleBigTree.jpg"
import bloodIcon from "./projects/dnd/playerView/pics/icons/bloodIcon.png"


function App() {
    // Load all encounters from storage
    const [localSavedEncounters, setLocalSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')) || []);
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState([]);
    const [playerView, setPlayerView] = useState(JSON.parse(localStorage.getItem('playerViewEncounter')) || []);
    const [autoRefreshDndbPlayers, setAutoRefreshDndbPlayers] = useState(false);
    const [autoRefreshDndbMonsters, setAutoRefreshDndbMonsters] = useState(false);
    const [encounterStarted, setEncounterStarted] = useState(false);
    const [autoRefreshDMB, setAutoRefreshDMB] = useState(false);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshPlayersCheck, setRefreshPlayersCheck] = useState(false);
    const [refreshMonstersCheck, setRefreshMonstersCheck] = useState(false);
    const [creatures, setCreatures] = useState([]);
    const [backGroundImage, setBackGroundImage] = useState(background1);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [hideEnemies, setHideEnemies] = useState(true);
    const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    const [recentlyRefreshed, setRecentlyRefreshed] = useState(false);
    const [enemyBloodToggleType, setEnemyBloodToggleType] = useState(0);
    const [enemyBloodToggleImage, setEnemyBloodToggleImage] = useState(bloodIcon);
    const [turnNum, setTurnNum] = useState(0);
    const [roundNum, setRoundNum] = useState(0);
    const [gameId, setGameID] = useState(0);
    const playerViewEncounterID = JSON.parse(localStorage.getItem('playerViewEncounter')).id
    const isOfflineMode = window.location.href.includes("playerView");

    useEffect(() => {
        // Check current encounter to see if we need to auto refresh from DNB_B
        currentEncounterCreatures.forEach(creature => {
            console.log("currentEncounterCreaturesRefresh...")
            if(creature.from === "dnd_b") {
                console.log("dnd_b found...")
                setAutoRefreshDndbPlayers(true)
            }

            if(creature.from === "dnd_b_monster") {
                console.log("dnd_b monster...")
                setAutoRefreshDndbMonsters(true)
            }
        });

        const getRefreshedLocalEncounter = (event) => {
            if (event.key === 'playerViewEncounter') {
                const updatedPlayerView = JSON.parse(localStorage.getItem('playerViewEncounter'));
                console.log("playerviewupdated", updatedPlayerView)
                setPlayerView({...updatedPlayerView});
                setRoundNum(updatedPlayerView.roundNum)
                setTurnNum(updatedPlayerView.turnNum)
            }
        }
        window.addEventListener('storage', getRefreshedLocalEncounter);

        let intervalId = 0
        // Refresh every 1 or 5 minutes
        if (autoRefreshDMB) {
            let refreshTimer = encounterStarted ? 1 : 5;
            intervalId = setInterval(() => {

                // Refresh start once a minute if there are dnd_b characters/
                // Refresh players
                if(autoRefreshDndbPlayers) {
                    console.log("🔄AUTO-REFRESH DND_B PLAYERS🔄")
                    handleRefresh(1);
                }

                if(autoRefreshDndbMonsters) {
                    console.log("🔄AUTO-REFRESH DND_B MONSTERS🔄")
                    handleRefresh(2);
                }

            // X minutes in milliseconds
            }, refreshTimer * 60.0 * 1000.0); 
        }

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    // eslint-disable-next-line
    // maybe on handle load?
    }, [currentEncounterCreatures]);

    const handleRefresh = (type) => {
        if (type === 1) {
            setRefreshPlayersCheck(true);
            refreshPlayerProfiles();
        }
        else if (type === 2) {
            setRefreshMonstersCheck(true);
            refreshMonsterProfiles();
           
        }
        else if (type === 3) {
            console.log("==============")
            console.log("Refreshing All")
            console.log("==============")
            setRefreshCheck(true);
            refreshPlayerProfiles().then(passedCreatures => refreshMonsterProfiles(passedCreatures))
        }
    };

    const uploadLocalStorage = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        // Read the file content as text
        reader.onload = function(event) {
            try {
                // Parse the JSON data
                const localStorageData = JSON.parse(event.target.result);

                // Set each key-value pair in local storage
                for (const key in localStorageData) {
                    if (localStorageData.hasOwnProperty(key)) {
                        localStorage.setItem(key, localStorageData[key]);
                    }
                }

                setLocalSavedEncounters([...JSON.parse(localStorage.getItem('savedEncounters'))])
                console.log("Local storage data has been successfully set.");
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        // Read the file
        reader.readAsText(file);
    }

    return (
        <Routes>
            <Route path="/" element={<DmView currentEncounterCreatures={currentEncounterCreatures} setCurrentEncounterCreatures={setCurrentEncounterCreatures} uploadLocalStorage={uploadLocalStorage} localSavedEncounters={localSavedEncounters}/>}/>
            <Route path="/playerView" element={<PlayerPage playerView={playerView} />}/>
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/king/" element={<Pantheon />} />
            <Route path="/max/" element={<div style={{fontSize: '50px'}}>129114069,125681347,129132878,129107853,125382402</div>} />
        </Routes>
    );
}

export default App;
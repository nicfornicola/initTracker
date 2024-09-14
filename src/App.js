// App.js
import {React, useState, useEffect} from 'react';

import { Route, Routes } from 'react-router-dom';
import PlayerPage from './projects/dnd/playerView/components/PlayerPage';
import DmView from './projects/dnd/dmView/components/DmView';
import { refreshMonsterProfiles } from './projects/dnd/dmView/refresh/refresh';
import Blog from './projects/blog/components/Blog';
import Pantheon from './projects/king/components/Pantheon';

// import background1 from "./projects/dnd/playerView/pics/backgrounds/fallenCastleBigTree.jpg"
// import bloodIcon from "./projects/dnd/playerView/pics/icons/bloodIcon.png"
import {INIT_ENCOUNTER} from './projects/dnd/dmView/constants'
import HowTo from './projects/dnd/dmView/components/HowToDMB';
import { ImportDndBeyondCharacters } from './projects/dnd/dmView/api/ImportDndBeyondCharacters'


function App() {
    // Load all encounters from storage
    const [localSavedEncounters, setLocalSavedEncounters] = useState(JSON.parse(localStorage.getItem('savedEncounters')) || []);
    const [currentEncounter, setCurrentEncounter] = useState(INIT_ENCOUNTER);
    const [playerView, setPlayerView] = useState(JSON.parse(localStorage.getItem('playerViewEncounter')) || []);
    const [autoRefreshDndbPlayers, setAutoRefreshDndbPlayers] = useState(false);
    const [autoRefreshDndbMonsters, setAutoRefreshDndbMonsters] = useState(false);
    const [encounterStarted, setEncounterStarted] = useState(false);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshPlayersCheck, setRefreshPlayersCheck] = useState(false);
    const [refreshMonstersCheck, setRefreshMonstersCheck] = useState(false);

    // const [error, setError] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");
    // const [turnNum, setTurnNum] = useState(0);
    // const [roundNum, setRoundNum] = useState(0);
    // const [hideEnemies, setHideEnemies] = useState(true);
    // const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    // const [recentlyRefreshed, setRecentlyRefreshed] = useState(false);
    // const [enemyBloodToggleType, setEnemyBloodToggleType] = useState(0);
    // const [enemyBloodToggleImage, setEnemyBloodToggleImage] = useState(bloodIcon);
    // const [backGroundImage, setBackGroundImage] = useState(background1);
    // const [youtubeLink, setYoutubeLink] = useState("");
    // const [loading, setLoading] = useState(true);
    // const [autoRefreshDMB, setAutoRefreshDMB] = useState(false);



    const refreshPlayerProfiles = async () => {
        try {
            console.log("Refreshing Player Health")
            console.log("----------------")
            //Get player stats for HP
            const filteredPlayers = currentEncounter.currentEncounterCreatures.filter(creature => creature.type === 'player' && creature.from === 'dnd_b');
            const playerIds = filteredPlayers.map(player => player.dnd_b_player_id.toString()); // Map to get the ids as strings
            console.log(playerIds)
            const refreshedData = await ImportDndBeyondCharacters(playerIds);
            console.log("updatedCreature:", refreshedData)
            console.log("updatedCreature:", currentEncounter.currentEncounterCreatures)

            // Iterate over the first array using a for loop
            const updatedCreatures = currentEncounter.currentEncounterCreatures.map(creature => {
                const refreshedPlayer = refreshedData.find(data => data.dnd_b_player_id === creature.dnd_b_player_id);
                console.log("refreshPlayer:", refreshedPlayer)

                // If the current creature is found in the refreshedData list then refresh data but keep a few of the old stuff
                if (refreshedPlayer) {

                    creature = {
                        ...refreshedPlayer,
                        name: creature.name,
                        guid: creature.guid,
                        effects: creature.effects,
                        initiative: creature.initiative, // might remove this in the future for auto initiative in the dnd_b app
                        // avatarUrl: creature.avatarUrl
                    }
                    console.log("REFRESHED:", creature)

                } else {
                    console.log("NOT REFRESHED:", creature)

                }

                return creature
            });

            setCurrentEncounter(prev => ({...prev, currentEncounterCreatures: [...updatedCreatures]}));
            setRefreshPlayersCheck(false);
            setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
            console.log("Players Refreshed!")
            return updatedCreatures;
        } catch (error) {
            console.log(error)
            // setErrorMessage(error)
            // setError(true)
        }  
    };


    const handleRefresh = (type) => {
        console.log("Refresh Type:", type)
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

    useEffect(() => {
        // Check current encounter to see if we need to auto refresh from DNB_B
        console.log("currentEncounter App.js effect...")
        if(currentEncounter.currentEncounterCreatures) {
            let foundPlayer = false;
            let foundMonster = false;

            currentEncounter.currentEncounterCreatures.forEach(creature => {
                if(creature.from === "dnd_b") {
                    console.log("dnd_b found...")
                    foundPlayer = true;
                } else if(creature.from === "dnd_b_monster") {
                    console.log("dnd_b monster...")
                    foundMonster = true;
                }
            });
            
            console.log("Found Player:", foundPlayer)
            setAutoRefreshDndbPlayers(foundPlayer)
            setAutoRefreshDndbMonsters(foundMonster)
        }
            

        const getRefreshedLocalEncounter = (event) => {
            if (event.key === 'playerViewEncounter') {
                const updatedPlayerView = JSON.parse(localStorage.getItem('playerViewEncounter'));
                console.log("playerviewupdated", updatedPlayerView)
                setPlayerView({...updatedPlayerView});
                // setRoundNum(updatedPlayerView.roundNum)
                // setTurnNum(updatedPlayerView.turnNum)
            }
        }
        window.addEventListener('storage', getRefreshedLocalEncounter);

        let intervalId = 0
        // Refresh every 1 or 5 minutes
        if (autoRefreshDndbPlayers || autoRefreshDndbMonsters) {
            let refreshTimer = encounterStarted ? 1 : 10;
            console.log("Auto Refresh in Minutes", refreshTimer)

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
            }, refreshTimer * 60000.0); 
        }

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    // eslint-disable-next-line
    // maybe on handle load?
    }, [currentEncounter]);

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

    console.log("APP", currentEncounter)
    return (
        <Routes>
            <Route path="/" element={<DmView currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} uploadLocalStorage={uploadLocalStorage} localSavedEncounters={localSavedEncounters}/>}/>
            <Route path="/playerView" element={<PlayerPage playerView={playerView} />}/>
            <Route path="/help" element={<HowTo/>} />
            <Route path="/king/" element={<Pantheon />} />
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/max/" element={<div style={{fontSize: '50px'}}>129114069,125681347,129132878,129107853,125382402</div>} />
        </Routes>
    );
}

export default App;
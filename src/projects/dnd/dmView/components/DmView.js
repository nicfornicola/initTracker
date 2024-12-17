import React, { useEffect, useState, useRef  } from 'react';
import '../../dmView/style/App.css';
import SearchColumn from './Searching/SearchColumn.js';
import Home from './Home.js';
import EncounterColumn from './EncounterColumn/EncounterColumn';
import SideMenu from './SideMenu/SideMenu.js';
import { backendUrl, generateUniqueId, INIT_ENCOUNTER, isDev, SHORT_REFRESH, sortCreatureArray} from '../constants';
import YouTubeEmbed from './EncounterColumn/YouTubeEmbed.js';
import io from 'socket.io-client';
import { refreshMonsterProfiles } from '../refresh/refresh';
import { ImportDndBeyondCharacters } from '../api/ImportDndBeyondCharacters'
import ReactGA from "react-ga4";
import { useLocation } from 'react-router-dom';
import defaultBackground from '../pics/backgrounds/happyTavern.png'
import { useUser } from '../../../../providers/UserProvider.js';
import mockEncounters from '../mockEncounters.json'

function getLocalStorageSize() {
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
    }
    
    const sizeInMB = totalSize / 1048576;
    
    console.log(`Total items in localStorage: ${localStorage.length}`);
    console.log(`Approximate size: ${sizeInMB.toFixed(2)} MB`);
}

function getVideoLink(thumbnailLink) {
    const videoId = thumbnailLink.split("vi/")[1].split('/max')[0];
    if (videoId) {
        let embedUrl = "https://www.youtube.com/embed/" + videoId

        const params = {
            controls: 0,
            mute: 1,
            rel: 0,
            autoplay: 1,
            loop: 1,
            playlist: videoId
        }

        // Mute by default and turn off controls so they dont show everytime on hover
        const queryParams = new URLSearchParams(params).toString();
        embedUrl += `?${queryParams}`;
        return {type: 'youtube', src: embedUrl}

    } else {
        console.error('Invalid YouTube URL');
        return {type: 'image', src: defaultBackground};
    }
}

function findDifferences(obj1, obj2) {
    const differences = {};
  
    for (const key in obj1) {
      if (typeof obj1[key] === "object" && obj1[key] !== null && typeof obj2[key] === "object" && obj2[key] !== null) {
        // Recursively find differences for nested objects
        const nestedDifferences = findDifferences(obj1[key], obj2[key]);
        if (Object.keys(nestedDifferences).length > 0) {
          differences[key] = nestedDifferences;
        }
      } else if (obj1[key] !== obj2[key]) {
        // If values are different (and not objects), record the difference
        differences[key] = {
          obj1: obj1[key],
          obj2: obj2[key]
        };
      }
    }
  
    return differences;
  }


function addRechargeCountToSpecialAbilities(data) {
    // Array of keys to process for rechargeCount
    const abilityKeys = ["special_abilities", "actions", "bonus_actions"];

    return data.map(obj => {
    if (obj.creatures && Array.isArray(obj.creatures)) {
        obj.creatures.forEach(creature => {
            abilityKeys.forEach(key => {
                if (creature[key] && Array.isArray(creature[key])) {
                    creature[key] = creature[key].map(ability => {
                        const match = ability.name.match(/\((\d+)\/[^)]+\)/); // Match (X/any text) pattern
                        ability.rechargeCount = match ? parseInt(match[1]) * 10 : 0; // Add rechargeCount or set to 0
                        return ability;
                    });
                }
            });
        });
    }
    return obj;
    });
}

const DmView = () => {
    const [playerViewBackground, setPlayerViewBackground] = useState({type: "image", src: defaultBackground});
    const [currentEncounter, setCurrentEncounter] = useState(INIT_ENCOUNTER);
    const [onFirstLoad, setOnFirstLoad] = useState(true);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [autoRefreshDndbPlayers, setAutoRefreshDndbPlayers] = useState(false);
    const [autoRefreshDndbMonsters, setAutoRefreshDndbMonsters] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [showSearchList, setShowSearchList] = useState(true);
    const [encounterGuid, setEncounterGuid] = useState(INIT_ENCOUNTER.encounterGuid);
    const [savedEncounters, setSavedEncounters] = useState([]);
    const { username } = useUser();

    const socketRef = useRef(null)
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if(isDev && username === "nicdev") {
            console.log("MOCK ENCOUNTERS", mockEncounters)

            setSavedEncounters(addRechargeCountToSpecialAbilities(mockEncounters))
        }

        if(username === 'Username') {
            setPlayerViewBackground({type: "image", src: defaultBackground})
            setSavedEncounters([])
            setCurrentEncounter(INIT_ENCOUNTER)
            setOnFirstLoad(true)
            setAutoRefreshDndbPlayers(false)
            setAutoRefreshDndbMonsters(false)
            setAutoRefresh(false)
            setRefreshCheck(false)
            setEncounterGuid('')
        }
    }, [username]);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(backendUrl); // Create socket connection
            setSocket(socketRef.current)
        }
    }, [socketRef]);

    useEffect(() => {
        if(socket) {
            // Emit room ID to the server after connection is established
            socket.on('connect', () => {
                console.log(`Connected to DmView`);
                socket.emit('connectDmView', username); 
            });

            // Recieve messages from backend
            socket.on('sendSavedEncounters', (encountersResponse) => {
                console.log("Encounter Recieved:", encountersResponse.length, encountersResponse)
                setSavedEncounters(encountersResponse)
            });

        }

        // Clean up the socket connection on component unmount
        return () => {
            if(socket) socket.disconnect();
        };
    }, [socket]);

    const location = useLocation();
    useEffect(() => {
        // Initialize GA with your Measurement ID
        ReactGA.initialize("G-R3XHSS7071", { debug: false });

        // Trigger page view on route change
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);

    useEffect(() => {
        if(refreshCheck) {
            const timer = setTimeout(() => {
                setRefreshCheck(false)
            }, 3500); 
            return () => clearInterval(timer);
        }
    }, [refreshCheck])

    const refreshPlayerProfiles = async () => {
        try {
            console.log("Refreshing Players")
            console.log("----------------")
            // Get player stats for HP for players from dnd beyond
            // Keep isPlayer check so dms can import character without auto refresh
            const filteredPlayers = currentEncounter.creatures.filter(creature => creature.dnd_b_player_id && creature.type === 'player');
            const playerIds = filteredPlayers.map(player => player.dnd_b_player_id.toString()); // Map to get the ids as strings
            const refreshedData = await ImportDndBeyondCharacters(playerIds, currentEncounter.encounterGuid);

            // Iterate over the first array using a for loop
            let updatedDifCreatures = [] 
            const updatedCreatures = currentEncounter.creatures.map(creature => {

                const refreshedPlayer = refreshedData.find(data => { 
                    return data.dnd_b_player_id === creature.dnd_b_player_id
                });
                // If the current creature is found in the refreshedData list then refresh data but keep a few of the old stuff
                if (refreshedPlayer) {

                    let differences = findDifferences(creature, refreshedPlayer)
                    creature = {
                        ...refreshedPlayer,
                        name: creature.name,
                        creatureGuid: creature.creatureGuid, // original guid
                        effects: creature.effects,
                        initiative: creature.initiative, // might remove this in the future for auto initiative in the dnd_b app
                    }

                    for (const key of 
                        ["hit_points", "hit_points_current", "hit_points_default", "hit_points_modifier",
                        "hit_points_override", "hit_points_temp", "initiative", "avatarUrl", "deathSaves", "exhaustionLvl"]) {
                            if (key in differences) {
                                console.log(key)
                                updatedDifCreatures.push(creature)
                                break;
                            }
                        }

                    console.log("REFRESHED:", creature.name)
                }
                return creature
            });

            if(updatedDifCreatures.length > 0) { console.log("updateFound", updatedDifCreatures); socket.emit("updateDndBPlayers", updatedDifCreatures) }
            else { console.log("No updates to send...") }

            setCurrentEncounter(prev => ({...prev, creatures: sortCreatureArray([...updatedCreatures])}));
            console.log("Players Refreshed!")
            console.log("----------------")

            return updatedCreatures;
        } catch (error) {
            console.warn(error)
        }  
    };


    const handleRefresh = () => {
        console.log("Refresh Player/Monsters", autoRefresh)
        setRefreshLoading(true)

        if (autoRefreshDndbPlayers && autoRefreshDndbMonsters) {
            console.log("==============")
            console.log("Refreshing All")
            console.log("==============")
            refreshPlayerProfiles().then(passedCreatures => refreshMonsterProfiles(passedCreatures))
        } else if (autoRefreshDndbPlayers) {
            refreshPlayerProfiles();
        }
        else if (autoRefreshDndbMonsters) {
            refreshMonsterProfiles();
        }
        else {
            console.error("You should not be seeing that button if both are false...")
        }

        // Set this for a minimum animation spin of 1 seconds
        setTimeout(() => {
            setRefreshLoading(false)
            setRefreshCheck(true);
        }, 1000); 
    };

    useEffect(() => {
        if(onFirstLoad && currentEncounter.encounterGuid !== "" && !window.location.href.includes("/playerView")) {
            setOnFirstLoad(false)
        }

        setSavedEncounters((prevEncounters) =>
            prevEncounters.map((encounter) =>
              encounter.encounterGuid === currentEncounter.encounterGuid
                ? { ...encounter, ...currentEncounter } 
                : encounter 
            )
        );

        // Check current encounter to see if we need to auto refresh from DNB_B
        if(currentEncounter.creatures) {
            let foundPlayer = false;
            let foundMonster = false;

            currentEncounter.creatures.forEach(creature => {
                if(creature.from === "dnd_b") {
                    foundPlayer = true;
                } else if(creature.from === "dnd_b_monster") { // current wil never trigger, not sure, not sure if i want it to or not
                    foundMonster = true;
                }
            });
            
            setAutoRefreshDndbPlayers(foundPlayer)
            setAutoRefreshDndbMonsters(foundMonster)
            setAutoRefresh(foundPlayer || foundMonster)
        }

        let intervalId = 0
        // Refresh every 1 or 5 minutes
        if (autoRefreshDndbPlayers || autoRefreshDndbMonsters) {
            let refreshTimer = SHORT_REFRESH;
            console.log("Auto Refresh in Minutes", refreshTimer)

            intervalId = setInterval(() => {
                if(autoRefreshDndbPlayers || autoRefreshDndbMonsters) {
                    handleRefresh();
                    console.log("🔄AUTO-REFRESH DND_B PLAYERS🔄")
                }

            // X minutes in milliseconds
            }, refreshTimer * 60000.0); 
        }

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    // eslint-disable-next-line
    }, [currentEncounter]);

    useEffect(() => {
        setCurrentEncounter({...currentEncounter, backgroundGuid: playerViewBackground.src})
    }, [playerViewBackground]);

    const uploadLocalStorage = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        // Read the file content as text
        reader.onload = function(event) {
            try {
                // Parse the JSON data
                const localStorageData = JSON.parse(event.target.result);
                console.log("Local storage data has been successfully set.");
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        // Read the file
        reader.readAsText(file);
    }

    const handleNewEncounter = () => {
        let newGuid = generateUniqueId();
        console.log("%c=== New Encounter ===", "background: green;", newGuid)

        setCurrentEncounter({...INIT_ENCOUNTER, encounterGuid: newGuid})
        setEncounterGuid(newGuid)
        setPlayerViewBackground({type: 'image', src: defaultBackground})
    };  

    const handleLoadEncounter = (encounter) => {
        console.log("%cLoaded: " + encounter.encounterName + ' ' + encounter.encounterGuid, "background: #fdfd96;")

        setCurrentEncounter({...encounter, creatures: sortCreatureArray(encounter.creatures)})
        setEncounterGuid(encounter.encounterGuid)

        if(encounter.backgroundGuid === 'default') {
            setPlayerViewBackground({type: "image", src: defaultBackground})
        } else {
            setPlayerViewBackground(
                encounter.backgroundGuid.includes('youtube.com')
                ? getVideoLink(encounter.backgroundGuid)
                : {type: 'image', src: encounter.backgroundGuid}
            )
        }
    };      

    return (
        <div className="background" style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
            { playerViewBackground.type === "youtube" && 
                <YouTubeEmbed embedUrl={playerViewBackground.src}/>
            }

            { onFirstLoad ? ( 
                <Home savedEncounters={savedEncounters} setSavedEncounters={setSavedEncounters}  currentEncounter={currentEncounter} setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} handleNewEncounter={handleNewEncounter} handleLoadEncounter={handleLoadEncounter} socket={socket}/>
            ) : ( 
                <>  
                    <SideMenu uploadLocalStorage={uploadLocalStorage} setCurrentEncounter={setCurrentEncounter} showSearchList={showSearchList} setShowSearchList={setShowSearchList} encounterGuid={encounterGuid} socket={socket}/>
                    
                    {showSearchList &&  
                        <SearchColumn setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} socket={socket}/>
                    }
                    
                    <EncounterColumn currentEncounter={currentEncounter} savedEncounters={savedEncounters} refreshLoading={refreshLoading} setPlayerViewBackground={setPlayerViewBackground} setSavedEncounters={setSavedEncounters} refreshCheck={refreshCheck} autoRefresh={autoRefresh} setCurrentEncounter={setCurrentEncounter} handleRefresh={handleRefresh} setEncounterGuid={setEncounterGuid} handleNewEncounter={handleNewEncounter} showSearchList={showSearchList} handleLoadEncounter={handleLoadEncounter} socket={socket}/>
                </>
            )}
            </div>
    );
};

export default DmView;
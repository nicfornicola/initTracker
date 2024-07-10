import '../style/App.css';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Effect from './Effect';
import ImagePopup from './BackgroundButton.js';
import Timer from './Timer.js'
import RefreshTimer from './RefreshTimer.js'
import { getCreatures } from '../api/getCreatures';
import { getMonstersAvatars } from '../api/getMonstersAvatars';
import { getCharacterStats } from '../api/getCharacterStats';
import NoEncounterPage from './NoEncounterPage.js';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import refreshPlayers from '../pics/refreshPlayers.png'; 
import refresh from '../pics/refresh.png'; 
import refreshMonster from '../pics/refreshMonsters.png'; 
import greenCheck from '../pics/check.png'; 
import eyeClosed from '../pics/eyeClosed.png'; 
import eyeOpen from '../pics/eyeOpen.png'; 
import skullButton from '../pics/skullButton.jpg'; 
import skullButtonNot from '../pics/skullButtonNot.jpg'; 
import background1 from "../pics/backgrounds/fallenCastleBigTree.jpg"
import { Profile } from '../helper/Profile.js' 
import { sortCreaturesByInitiative, effectObjs } from '../constants';
import Tooltip from './Tooltip.js';


function PlayerPage() {
    const [creatures, setCreatures] = useState([]);
    const [clickedCreature, setClickedCreature] = useState(null);
    const [backGroundImage, setBackGroundImage] = useState(background1);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshPlayersCheck, setRefreshPlayersCheck] = useState(false);
    const [refreshMonstersCheck, setRefreshMonstersCheck] = useState(false);
    const [hideEnemies, setHideEnemies] = useState(true);
    const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    const [recentlyRefreshed, setRecentlyRefreshed] = useState(false);
    const { gameId } = useParams();
    


    const refreshPlayerProfiles = async () => {
        try {
            console.log("Refreshing Player Health")
            console.log("----------------")
        
            //Get player stats for HP
            const filteredPlayers = creatures.filter(item => item.type === 'player');
            const refreshedData = await getCharacterStats(filteredPlayers);

            // Iterate over the first array using a for loop
            const updatedCreatures = creatures.map(creature => {
                const matchedRefresh = refreshedData.find(data => data.id === creature.id);
                
                if (matchedRefresh) {
                    // getCharacterStats doesnt return initiative, that is from the encounter service, maybe make another button to reset player initiation i know thats a lot of buttons
                    const hpChange = matchedRefresh.removedHp !== undefined && matchedRefresh.removedHp !== creature.removedHp
                    const exhaustionChange = matchedRefresh.exhaustionLvl !== undefined && matchedRefresh.exhaustionLvl !== creature.exhaustionLvl
                    const change = {
                        ...creature,
                        removedHp: hpChange ? matchedRefresh.removedHp : creature.removedHp,
                        exhaustionLvl: exhaustionChange ? matchedRefresh.exhaustionLvl : creature.exhaustionLvl,
                    }
                    return change;
                } else {
                    return creature;
                }
            });
                
            setCreatures([...updatedCreatures]);
            setRefreshPlayersCheck(false);
            setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
            console.log("Players Refreshed!")
            return updatedCreatures

        } catch (error) {
            console.log(error)
            setErrorMessage(error)
            setError(true)
        }  
    };

    const refreshMonsterProfiles = async (passedCreatures) => {
        try {
            console.log("Refreshing Monster Hp and Initiatives");
            console.log("----------------");
    
            // Fetch the latest data for monsters and players
            const { data: { monsters, players } } = await getCreatures(gameId);
            const allRefreshedCreatures = [...monsters, ...players];
    
            let needToResort = false;
    
            // Function to update a single creature's data
            const updateSingleCreature = (creature, matchedRefresh) => {
                const hpHasChanged = matchedRefresh.currentHitPoints !== creature.monsterCurrentHp;
                const initiativeHasChanged = matchedRefresh.initiative !== creature.initiative;
    
                // Check if initiative has changed and mark for resorting if needed
                if (initiativeHasChanged) 
                    needToResort = true;
    
                // Update creature properties based on whether it's a monster or a player
                return {
                    ...creature,
                    monsterCurrentHp: matchedRefresh.userName === undefined && hpHasChanged ? matchedRefresh.currentHitPoints : creature.monsterCurrentHp,
                    initiative: initiativeHasChanged ? matchedRefresh.initiative : creature.initiative
                };
            };
    
            // Function to update all creatures in the list
            const updateAllCreatures = (creatureList) => {
                return creatureList.map(creature => {
                    const matchedRefresh = allRefreshedCreatures.find(data => data.name === creature.name);
                    return matchedRefresh ? updateSingleCreature(creature, matchedRefresh) : creature;
                });
            };
    
            // Update the creatures, either passed in or existing ones
            let updatedCreatures = passedCreatures ? updateAllCreatures(passedCreatures) : updateAllCreatures(creatures);
            
            // Resort the creatures if any initiative has changed
            if (needToResort) 
                updatedCreatures = sortCreaturesByInitiative(updatedCreatures);
    
            // Update the state with the new creature list
            setCreatures([...updatedCreatures]);
            setRefreshMonstersCheck(false);
            setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
    
            console.log("Monsters Refreshed!");
            return updatedCreatures;

        } catch (error) {
            console.error("Error refreshing monster profiles:", error);
            setErrorMessage(error);
            setError(true);
        }
    };
    
    const loadProfiles = async () => {
        try {
            console.log(gameId)
            //Get all monster stats (except image)
            const data = await getCreatures(gameId);
            if(data) {
                const {monsters, players} = data.data;

                //Get player stats for HP
                const charData = await getCharacterStats(players);
                const creaturesData = [...monsters, ...players]
                const creatures = creaturesData.map(creature => {
                    let playerHpData = null
                    if(creature.userName) // Only look if its a player
                        playerHpData = charData.find(d => d.id.toString() === creature.id);

                    return new Profile(creature, playerHpData)
                });

                const monsterIcons = await getMonstersAvatars(creatures);
                monsterIcons.data.forEach(monsterIcon => {
                    creatures.forEach(creature => {
                        if(creature.id === monsterIcon.id && creature.type === 'monster') {
                            creature.avatarUrl = monsterIcon.avatarUrl
                        }
                    });
                })

                setCreatures(sortCreaturesByInitiative(creatures))  
                setLoading(false) 
                console.log("Creatures Set!")
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error)
            setError(true)
        }  
    };

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


    useEffect(() => {
        if (creatures.length === 0 && gameId && !error) {
            loadProfiles();
        }

        // Refresh every 5 minutes, when refreshed this way, show check mark for 45 seconds
        const intervalId = setInterval(() => {
            console.log("🔄AUTO-REFRESH🔄")
            handleRefresh(3);
            setRecentlyRefreshed(true)
            const timer = setTimeout(() => {
                setRecentlyRefreshed(false)
            }, 45000); // 45 seconds in milliseconds
            return () => clearInterval(timer);

        }, 5 * 60.0 * 1000.0); // 5 minutes in milliseconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    // eslint-disable-next-line
    }, [creatures]);

    if(gameId && error) {
        return (
            <div>
                <NoEncounterPage />
                <br/>
                If it still doesnt work Encounter ID might be wrong... idk
                <br/>

                <li>Error: {errorMessage.message}</li> 
            </div>
        )
    }

    if(!gameId) {
        return (
            <NoEncounterPage />
        )
    }

    const updateCreature = (updatedCreature) => {
        setCreatures((prevCreatures) => {
            return prevCreatures.map(creature =>
                creature.name === updatedCreature.name ? updatedCreature : creature
            )
        })
    };   

    const updateCreatureEffect = (event, effectObj) => {
        event.stopPropagation(); // Prevent propagation to parent
        const alreadyExists = clickedCreature.effects.some(eObj => eObj.effect === effectObj.effect);

        if(!alreadyExists) {
            clickedCreature.effects.push(effectObj)
        } else {
            clickedCreature.effects = clickedCreature.effects.filter(eObj => eObj.effect !== effectObj.effect)
        }
        updateCreature(clickedCreature)

    };

    const clickedBackground = () => {
        setClickedCreature(null)
    };

    const handleHideEnemies = () => {
        if(hideEnemies) // If hideEnemies is true, then refresh before revealing enemies
            handleRefresh(2)

        setHideEnemies(!hideEnemies)
    }


    return (
        <div className="dndBackground" onClick={clickedBackground} 
            style={{backgroundImage: `url(${backGroundImage})` }}>

            {loading && (<div className='loading'>Loading...</div>)}
            <div className="cardContainer" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {creatures.map((creature) => { 

                    if (creature.type === 'monster') {
                        if (hideEnemies)
                            return null;
                    }
                    return <Icon key={uuidv4()} creature={creature} setClickedCreature={setClickedCreature} hideDeadEnemies={hideDeadEnemies} />;
                })}
            </div>

            <div className='options-container'>                
                <img className="option" src={hideEnemies ? eyeOpen : eyeClosed} alt={"showEnemies"} onClick={handleHideEnemies} />
                <Tooltip message={(hideEnemies ? "Show" : "Hide") + " Enemies"}/>
                { !hideEnemies && 
                    <>
                        <img className="option" src={hideDeadEnemies ? skullButton : skullButtonNot} alt={"showDeadEnemies"} onClick={() => setHideDeadEnemies(!hideDeadEnemies)} />
                        <Tooltip message={(hideDeadEnemies ? "Show" : "Hide") + " Dead Enemies"}/>
                    </>
                }
                <ImagePopup setBackGroundImage={setBackGroundImage} />
                <Timer />
                
            </div>


            {clickedCreature && (
                <div className='effectsBarContainer'>
                    <img className='effectsBarPlayerAvatar'
                        key={uuidv4()}
                        src={clickedCreature.avatarUrl}
                        alt={"avatar"}

                    />
                    <div className="effectsBar" onClick={(event) => event.stopPropagation()} >
                        {effectObjs.map((effectObj) => (
                            <Effect key={uuidv4()} clickedCreature={clickedCreature} effectObj={effectObj} updateCreatureEffect={updateCreatureEffect} />
                        ))}
                    </div>
                </div>
            )}

            <div className='refresh-container'>
                {recentlyRefreshed &&
                    <img className="option" src={greenCheck} alt={"refresh"}/>
                }
                <img className="option" src={refreshPlayersCheck ? greenCheck : refreshPlayers} alt={"refresh"} onClick={() => handleRefresh(1)} />
                <span className="tooltiptext" >
                    Last <img src={refreshPlayersCheck ? greenCheck : refreshPlayers} alt={"refresh"} onClick={() => handleRefresh(1)} />
                    <RefreshTimer singleRefresh={refreshPlayersCheck} totalRefresh={refreshCheck}/>
                </span>
                <img className="option" src={refreshMonstersCheck ? greenCheck : refreshMonster} alt={"refresh"} onClick={() => handleRefresh(2)} />
                <span className="tooltiptext">
                    Last <img src={refreshMonstersCheck ? greenCheck : refreshMonster} alt={"refresh"} onClick={() => handleRefresh(2)} />
                    <RefreshTimer singleRefresh={refreshMonstersCheck} totalRefresh={refreshCheck} />
                </span>
                <img className="option" src={refreshCheck ? greenCheck : refresh} alt={"refresh"} onClick={() => handleRefresh(3)} />
                <span className="tooltiptext">
                    Last <img src={refreshCheck ? greenCheck : refresh} alt={"refresh"} onClick={() => handleRefresh(3)} />
                    <RefreshTimer totalRefresh={refreshCheck}/>
                </span>
            </div>
            
        </div>
    );
}


export default PlayerPage;

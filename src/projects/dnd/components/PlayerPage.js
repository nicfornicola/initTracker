import '../style/App.css';
import React, { useState } from 'react';
import Icon from './Icon';
import Effect from './Effect';
import Timer from './Timer.js'
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

import { sortCreaturesByInitiative, effectObjs } from '../constants';

class Profile {
    constructor(id = 0, name = 'Default Name', initiative = '0', type="creature", avatarUrl = null, monsterCurrentHitpoints = null, maxHitpoints = null, bonusHitPoints = null, overrideHitPoints = null, removedHitPoints = null, tempHitPoints = null ) {
        this.id = id;
        this.name = name;
        this.initiative = initiative;
        this.type = type;
        this.avatarUrl = avatarUrl;
        this.monsterCurrentHp = monsterCurrentHitpoints
        this.maxHp = maxHitpoints;
        this.bonusHp = bonusHitPoints;
        this.overrideHp = overrideHitPoints;
        this.removedHp = removedHitPoints;
        this.tempHp = tempHitPoints;
        this.effects = []
    }
}

function PlayerPage() {
    const [creatures, setCreatures] = useState([]);
    const [clickedCreature, setClickedCreature] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshPlayersCheck, setRefreshPlayersCheck] = useState(false);
    const [refreshMonstersCheck, setRefreshMonstersCheck] = useState(false);
    const [hideEnemies, setHideEnemies] = useState(true);
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
                    const change = {
                        ...creature,
                        removedHp: hpChange ? matchedRefresh.removedHp : creature.removedHp,
                    }
                    return change;
                } else {
                    return creature;
                }
            });
                
            setCreatures(updatedCreatures);
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
            setCreatures(updatedCreatures);
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
                    let playerHpData = charData.find(d => d.id.toString() === creature.id);
                    const type = creature.userName ? "player" : "monster"

                    return new Profile(creature.id,
                        creature.name,
                        creature.initiative,
                        type,
                        creature.avatarUrl || "https://www.dndbeyond.com/avatars/42718/687/1581111423-121476494.jpeg",
                        type === "player" ? null : creature.currentHitPoints,
                        type === "player" ? playerHpData.maxHp : creature.maximumHitPoints,
                        type === "player" ? playerHpData.bonusHp : null,
                        type === "player" ? playerHpData.overrideHitPoints : null,
                        type === "player" ? playerHpData.removedHp : null,
                        type === "player" ? playerHpData.tempHitPoints : null
                        )
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
                setCreatures(creatures)  
                setLoading(false) 
                console.log("Creatures Set!")
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error)
            setError(true)
        }  
    };

    if (creatures.length === 0 && gameId && !error) 
        loadProfiles();

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
            updateCreature(clickedCreature)
            // setClickedCreature(null)
        } else {
            clickedCreature.effects = clickedCreature.effects.filter(eObj => eObj.effect !== effectObj.effect)
            updateCreature(clickedCreature)
        }
    };

    const clickedBackground = () => {
        setClickedCreature(null)
    };


    return (
        <div className="dndBackground" onClick={clickedBackground}>
            {loading && (<div className='loading'>Loading...</div>)}
            <div className="cardContainer" style={{ display: 'flex', flexWrap: 'wrap' }}>

                {creatures.map((creature) => { 
                    if (hideEnemies && creature.type === 'monster') {
                        return null;
                    }
                    return <Icon key={uuidv4()} creature={creature} setClickedCreature={setClickedCreature} />;
                })}
            </div>

            <div className='options-container'>
                <img className="option" src={hideEnemies ? eyeOpen : eyeClosed} alt={"showEnemies"} onClick={() => setHideEnemies(!hideEnemies)} />
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
                            <Effect clickedCreature={clickedCreature} effectObj={effectObj} updateCreatureEffect={updateCreatureEffect} />
                        ))}
                    </div>
                </div>
            )}

            <div className='refresh-container'>
                <img className="option" src={refreshPlayersCheck ? greenCheck : refreshPlayers} alt={"refresh"} onClick={() => handleRefresh(1)} />
                <img className="option" src={refreshMonstersCheck ? greenCheck : refreshMonster} alt={"refresh"} onClick={() => handleRefresh(2)} />
                <img className="option" src={refreshCheck ? greenCheck : refresh} alt={"refresh"} onClick={() => handleRefresh(3)} />
            </div>
            
        </div>
    );
}


export default PlayerPage;

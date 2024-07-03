import '../style/App.css';
import React, { useState } from 'react';
import Icon from './Icon';
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
import { sortCreaturesByInitiative } from '../constants';

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
    }
  }

function PlayerPage() {
    const [creatures, setCreatures] = useState([]);
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
            console.log("Refreshing Player Profiles")
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
                    const initChange = matchedRefresh.initiative !== undefined && matchedRefresh.initiative !== creature.initiative
                    const change = {
                        ...creature,
                        removedHp: hpChange ? matchedRefresh.removedHp : creature.removedHp,
                        initiative: initChange ? matchedRefresh.initiative : creature.initiative
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

        } catch (error) {
            console.log(error)
            setErrorMessage(error)
            setError(true)
        }  
    };

    const refreshMonsterProfiles = async () => {
        try {
            console.log("Refreshing Monster Profiles")
            console.log("----------------")
            const refreshedData = await getCreatures(gameId);

            const refreshedMonsters = refreshedData.data.monsters;
            // Iterate over the first array using a for loop
            const updatedCreatures = creatures.map(creature => {
                const matchedRefresh = refreshedMonsters.find(data => data.name === creature.name);
                if (matchedRefresh) {
                    const hpChange = matchedRefresh.currentHitPoints !== undefined && matchedRefresh.currentHitPoints !== creature.monsterCurrentHp
                    const initChange = matchedRefresh.initiative !== undefined && matchedRefresh.initiative !== creature.initiative
                    const change = {
                        ...creature,
                        removedHp: hpChange ? matchedRefresh.currentHitPoints : creature.monsterCurrentHp,
                        initiative: initChange ? matchedRefresh.initiative : creature.initiative
                    }
                    return change;
                } else {
                    return creature;
                }
            });

            setCreatures(sortCreaturesByInitiative(updatedCreatures))  
            setRefreshMonstersCheck(false);
            setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
            console.log("Monsters Refreshed!")
            
        } catch (error) {
            console.log(error)
            setErrorMessage(error)
            setError(true)
        }  
    };
    
    const loadProfiles = async () => {
        try {
            console.log(gameId)
            //Using proxy server https://cors-anywhere.herokuapp.com/corsdemo
            //get all monster stats (except image) and player names 
            const data = await getCreatures(gameId);
            if(data) {
                const json = data.data;

                //Get player stats for HP
                const charData = await getCharacterStats(json.players);

                const monstersData = json.monsters.map(monster => new Profile(monster.id, monster.name, monster.initiative, "monster", "", monster.currentHitPoints, monster.maximumHitPoints));
                const playersData = json.players.map(profile => {
                    let data = charData.find(d => d.id.toString() === profile.id);
                    
                    if(profile.avatarUrl === null) {// if default make them ezra :D
                        profile.avatarUrl = "https://www.dndbeyond.com/avatars/42718/687/1581111423-121476494.jpeg";
                    }
                    return new Profile(profile.id,
                        profile.name,
                        profile.initiative,
                        "player",
                        profile.avatarUrl,
                        null,
                        data.maxHp,
                        data.bonusHp,
                        data.overrideHitPoints,
                        data.removedHp,
                        data.tempHitPoints)
                });

                const creatures = monstersData.concat(playersData);
                const monsterIcons = await getMonstersAvatars(creatures);
                monsterIcons.data.forEach(monsterIcon => {
                    creatures.forEach(creature => {
                        if(creature.id === monsterIcon.id) {
                            if(creature.type === 'monster')
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
            setRefreshCheck(true);
            refreshPlayerProfiles().then(() => refreshMonsterProfiles());
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


    return (
        <div className="dndBackground">
            {loading && (<div className='loading'>Loading...</div>)}
            <div className="cardContainer" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {creatures.map((creature) => { 
                if (hideEnemies && creature.type === 'monster') {
                return null;
                }
                return <Icon key={uuidv4()} creature={creature} />;
            })}
            </div>

            <div className='refresh-container'>
                {refreshPlayersCheck ? (
                    <img className="refresh-players" src={greenCheck} alt={"refresh"} />
                ) : (
                    <img className="refresh-players" src={refreshPlayers} alt={"refresh"} onClick={() => handleRefresh(1)} />
                )}

                {refreshMonstersCheck ? (
                    <img className="refresh-monsters" src={greenCheck} alt={"refresh"} /> 
                ) : (
                    <img className="refresh-monsters" src={refreshMonster} alt={"refresh"} onClick={() => handleRefresh(2)} />
                )}

                {refreshCheck ? (
                    <img className="refresh-all" src={greenCheck} alt={"refresh"} />

                ) : (
                    <img className="refresh-all" src={refresh} alt={"refresh"} onClick={() => handleRefresh(3)} />
                )}

  

            </div>

            {hideEnemies ? (
                <img className="hide-enemies" src={eyeOpen} alt={"hide-enemies"} onClick={() => setHideEnemies(false)} />
            ) : (
                <img className="hide-enemies" src={eyeClosed} alt={"hide-enemies"} onClick={() => setHideEnemies(true)} />
            )}
        </div>
    );
}


export default PlayerPage;

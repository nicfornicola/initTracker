import '../style/App.css';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Effect from './Effect';
import RefreshTimer from './RefreshTimer.js'
import { getCreatures } from '../api/getCreatures.js';
import { getMonstersAvatars } from '../api/getMonstersAvatars.js';
import { getCharacterStats } from '../api/getCharacterStats.js';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import refreshPlayers from '../pics/icons/refreshPlayers.png'; 
import refresh from '../pics/icons/refresh.png'; 
import refreshMonster from '../pics/icons/refreshMonsters.png'; 
import greenCheck from '../pics/icons/check.png'; 
import upArrow from "../pics/icons/upArrow.png"
import downArrow from "../pics/icons/downArrow.png"
import noArrow from "../pics/icons/noArrow.jpg"
import { Profile } from '../helper/Profile.js' 
import { sortCreaturesByInitiative, effectObjs } from '../constants.js';
import Tooltip from './Tooltip.js';
import YouTubeEmbed from './YouTubeEmbed.js';
import { generateUniqueId } from '../../dmView/constants.js';

function PlayerPage({playerView, playerViewBackground, hideEnemies, enemyBloodToggle, hideDeadEnemies}) {
    const [creatures, setCreatures] = useState(playerView?.currentEncounterCreatures || []);
    const [clickedCreature, setClickedCreature] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshPlayersCheck, setRefreshPlayersCheck] = useState(false);
    const [refreshMonstersCheck, setRefreshMonstersCheck] = useState(false);
    const [recentlyRefreshed, setRecentlyRefreshed] = useState(false);
    const [foundCreatures, setFoundCreatures] = useState(null);
    const [cardContainerStyle, setCardContainerStyle] = useState({width: '80%'});
    const [arrowButton, setArrowButton] = useState(upArrow);
    const [autoRefreshDMB, setAutoRefreshDMB] = useState(false);
    const [turnNum, setTurnNum] = useState(playerView.turnNum);
    const [roundNum, setRoundNum] = useState(playerView.RoundNum);
    const { gameId } = useParams();
    const isOfflineMode = window.location.href.includes("playerView");
    console.log(enemyBloodToggle)

    useEffect(() => {
        setCreatures([...playerView.currentEncounterCreatures])
        handleTurns(true, playerView.turnNum, playerView.roundNum)
    }, [playerView])

    const handleTurns = (inProgress, tNum, rNum) => {
        if(inProgress) {
            setTurnNum(tNum)
            setRoundNum(rNum)
        }
        else {
            setTurnNum(0)
            setRoundNum(0)
        }
    }



    const refreshMonsterProfiles = async (passedCreatures) => {
        try {
            if (!isOfflineMode) {
                console.log("Refreshing Monster Hp and Initiatives");
                console.log("----------------");
                // Fetch the latest data for monsters and players
                const { data: { monsters, players, turnNum, roundNum, inProgress } } = await getCreatures(gameId);
                handleTurns(inProgress, turnNum, roundNum)

                const allRefreshedCreatures = [...monsters, ...players];
        
                let needToResort = false;
        
                // Function to update a single creature's data
                const updateSingleCreature = (creature, matchedRefresh) => {
                    const maxHpIsZero = matchedRefresh.maximumHitPoints === 0
                    if(maxHpIsZero) {
                        // If somone does not own the creature they start at 0/0 
                        // so this is to make sure it stays at 1/1 on a refresh
                        // If the users overrides there hp it will get caught above
                        if (!creature.isReleased) {
                            matchedRefresh.currentHitPoints = 1
                            matchedRefresh.maximumHitPoints = 1;
                        } else {
                            // If someone overrides a creatures hp, then removes the override dndbeyond thinkgs maxhp is 0
                            // since its not we save creature.defaultHP set the maxHP back to the correct value
                            // If maxhp is 0 dndbeyond will just send a negative number for currentHP when the creature takes damage
                            // this is why we must add that number to default to get the new current. 
                            // This is a bug with dnd beyond
                            // i.e. maxHp = 0, currentHp = -10, default = 50, 50 + (-10)
                            matchedRefresh.currentHitPoints = creature.defaultHP - Math.abs(matchedRefresh.currentHitPoints)
                            matchedRefresh.maximumHitPoints = creature.defaultHP;
                        }
                    }

                    const currentHpHasChanged = matchedRefresh.currentHitPoints !== creature.monsterCurrentHp;
                    const maxHpHasChanged = matchedRefresh.maximumHitPoints !== creature.maxHp;
                    const initiativeHasChanged = matchedRefresh.initiative !== creature.initiative;
        
                    // Check if initiative has changed and mark for resorting if needed
                    if (initiativeHasChanged) 
                        needToResort = true;
                    // Update creature properties based on whether it's a monster or a player
                    return {
                        ...creature,
                        monsterCurrentHp: matchedRefresh.userName === undefined && currentHpHasChanged ? matchedRefresh.currentHitPoints : creature.monsterCurrentHp,
                        maxHp: matchedRefresh.userName === undefined && maxHpHasChanged ? matchedRefresh.maximumHitPoints : creature.maxHp,
                        initiative: initiativeHasChanged ? matchedRefresh.initiative : creature.initiative,
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
                
        
                console.log("Monsters Refreshed!");
                return updatedCreatures;
            } else {
                console.log("Offline mode refresh")
            }

            setRefreshMonstersCheck(false);
            setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
        } catch (error) {
            console.error("Error refreshing monster profiles:", error);
            setErrorMessage(error);
            setError(true);
        }
    };
    
    const loadProfiles = async () => {
        try {
            console.log(gameId)
            // Get all monster stats (except image)
            const data = await getCreatures(gameId);
            if(data) {
                const {monsters, players, turnNum, roundNum, inProgress} = data.data;
                handleTurns(inProgress, turnNum, roundNum)
                const playerIds = players.map(player => player.id);

                // Get player stats for HP
                const charData = await getCharacterStats(playerIds);

                const creaturesData = [...monsters, ...players]
                const creatures = creaturesData.map(creature => {
                    let playerHpData = null
                    if(creature.userName) // Only look if its a player and use id since its from dnd beyond
                        playerHpData = charData.find(d => d.id.toString() === creature.id);
                    
                    creature.guid = generateUniqueId();
                    return new Profile(creature, playerHpData)
                });
                
                const monsterIcons = await getMonstersAvatars(creatures);
                monsterIcons.data.forEach(monsterIcon => {
                    creatures.forEach(creature => {
                        // creature.id needs to be used instead of guid because its from dndBeyond
                        if(creature.id === monsterIcon.id && creature.type === 'monster') {
                            creature.avatarUrl = monsterIcon.avatarUrl
                            creature.isReleased = monsterIcon.isReleased
                            creature.defaultHP = monsterIcon.averageHitPoints
                        }
                    });
                })
                
                if(creatures.length !== 0) {
                    setCreatures(sortCreaturesByInitiative(creatures))  
                    setFoundCreatures(true)
                } else {
                    setFoundCreatures(false)
                }

                console.log("Creatures Set!")

            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error)
            setError(true)
        }  
    };

    // Update Creature in the creatures array with new effects
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

    const handleRefresh = (type) => {
        console.log("Refresh Type Player Page (SHOULD NOT SEE THIS):", type)

        if (type === 1) {
            setRefreshPlayersCheck(true);
            // refreshPlayerProfiles();
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
            // refreshPlayerProfiles().then(passedCreatures => refreshMonsterProfiles(passedCreatures))
        }
    };
    
    const handleMovePortraits = () => {
        if('bottom' in cardContainerStyle) {
            // middle style
            const newCardContainerStyle = {
                width: '80%',
            }
            setCardContainerStyle(newCardContainerStyle)
            setArrowButton(upArrow)
        } else if('top' in cardContainerStyle) {
            // bottom style
            const newCardContainerStyle = {
                width: '95%',
                bottom: '0%'
            }
            setCardContainerStyle(newCardContainerStyle)
            setArrowButton(noArrow)
        } else {
            // top style
            const newCardContainerStyle = {
                width: '95%',
                top: '0%'
            }
            setCardContainerStyle(newCardContainerStyle)
            setArrowButton(downArrow)

        }
    }

    console.log(creatures)
    return (
        <div className="dndBackground" onClick={() => setClickedCreature(null)} style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
            {roundNum !== 0 && 
                <div className='roundNum'>
                    <div className='option'>{roundNum}</div>
                    <Tooltip message={"Combat Round"}/>
                </div>
            }
            
            { playerViewBackground.type === "youtube" && 
                <YouTubeEmbed embedUrl={playerViewBackground.src}/>
            }

            <div className="cardContainer" style={cardContainerStyle}>
                {creatures.length === 0 ? (
                    <div className='loading'>No Creatures found...</div>
                ) : (
                    creatures.map((creature, index) => { 
                        return (((creature.type === 'monster' || creature.type === 'global') && hideEnemies) || creature.hidden) 
                        ? null
                        : <Icon key={uuidv4()} isTurn={turnNum === index+1} creature={creature} setClickedCreature={setClickedCreature} hideDeadEnemies={hideDeadEnemies} enemyBloodToggle={enemyBloodToggle} />;
                    })
                )}

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
        </div> 
    );
}


export default PlayerPage;

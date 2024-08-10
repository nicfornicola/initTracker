import '../style/App.css';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Effect from './Effect';
import ImagePopup from './BackgroundButton.js';
import Timer from './Timer.js'
import RefreshTimer from './RefreshTimer.js'
import { getCreatures } from '../api/getCreatures.js';
import { getMonstersAvatars } from '../api/getMonstersAvatars.js';
import { getCharacterStats } from '../api/getCharacterStats.js';
import HowTo from './HowTo.js';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import refreshPlayers from '../pics/icons/refreshPlayers.png'; 
import refresh from '../pics/icons/refresh.png'; 
import refreshMonster from '../pics/icons/refreshMonsters.png'; 
import greenCheck from '../pics/icons/check.png'; 
import eyeClosed from '../pics/icons/eyeClosed.png'; 
import eyeOpen from '../pics/icons/eyeOpen.png'; 
import skullButton from '../pics/icons/skullButton.jpg'; 
import skullButtonNot from '../pics/icons/skullButtonNot.jpg'; 
import background1 from "../pics/backgrounds/fallenCastleBigTree.jpg"
import upArrow from "../pics/icons/upArrow.png"
import downArrow from "../pics/icons/downArrow.png"
import noArrow from "../pics/icons/noArrow.jpg"
import bloodIcon from "../pics/icons/bloodIcon.png"
import bloodIconMinus from "../pics/icons/bloodIconMinus.png"
import bloodIconSlash from "../pics/icons/bloodIconSlash.png"
import { Profile } from '../helper/Profile.js' 
import { sortCreaturesByInitiative, effectObjs } from '../constants.js';
import Tooltip from './Tooltip.js';
import YouTubeEmbed from './YouTubeEmbed.js';
import { generateUniqueId } from '../../dmView/constants.js';

function PlayerPage() {
    const [creatures, setCreatures] = useState([]);
    const [clickedCreature, setClickedCreature] = useState(null);
    const [backGroundImage, setBackGroundImage] = useState(background1);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshPlayersCheck, setRefreshPlayersCheck] = useState(false);
    const [refreshMonstersCheck, setRefreshMonstersCheck] = useState(false);
    const [hideEnemies, setHideEnemies] = useState(true);
    const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    const [recentlyRefreshed, setRecentlyRefreshed] = useState(false);
    const [foundCreatures, setFoundCreatures] = useState(null);
    const [cardContainerStyle, setCardContainerStyle] = useState({width: '80%'});
    const [arrowButton, setArrowButton] = useState(upArrow);
    const [enemyBloodToggleType, setEnemyBloodToggleType] = useState(0);
    const [enemyBloodToggleImage, setEnemyBloodToggleImage] = useState(bloodIcon);
    const { gameId } = useParams();
    const isOfflineMode = window.location.href.includes("playerView");

    const refreshPlayerProfiles = async () => {
        try {
            console.log("Refreshing Player Health")
            console.log("----------------")
        
            //Get player stats for HP
            const filteredPlayers = creatures.filter(item => item.type === 'player');
            const refreshedData = await getCharacterStats(filteredPlayers);

            // Iterate over the first array using a for loop
            const updatedCreatures = creatures.map(creature => {
                // Need to use creature.id since its from dnd beyond
                const matchedRefresh = refreshedData.find(data => data.id === creature.id);
                    
                if (matchedRefresh) {
                    // getCharacterStats doesnt return initiative, that is from the encounter service, maybe make another button to reset player initiation i know thats a lot of buttons
                    // const hpChange = matchedRefresh.removedHp !== undefined && matchedRefresh.removedHp !== creature.removedHp
                    // const overrideHpChange = matchedRefresh.removedHp !== undefined && matchedRefresh.removedHp !== creature.removedHp
                    // const exhaustionChange = matchedRefresh.exhaustionLvl !== undefined && matchedRefresh.exhaustionLvl !== creature.exhaustionLvl
                    
                    // Leaving all of this in incase it breaks. just override creature data with new refresh data and if its different great if its not great
                    const change = {
                        ...creature,
                        ...matchedRefresh
                        // removedHp: hpChange ? matchedRefresh.removedHp : creature.removedHp,
                        // exhaustionLvl: exhaustionChange ? matchedRefresh.exhaustionLvl : creature.exhaustionLvl,
                        // deathSaves: matchedRefresh.deathSaves
                    }
                    
                    console.log("change", change)

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
            if (!isOfflineMode) {
                console.log("Refreshing Monster Hp and Initiatives");
                console.log("----------------");
        
                // Fetch the latest data for monsters and players
                const { data: { monsters, players } } = await getCreatures(gameId);
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
                setRefreshMonstersCheck(false);
                setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
        
                console.log("Monsters Refreshed!");
                return updatedCreatures;
            } else {
                console.log("Offline mode refresh")
            }


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
                const {monsters, players} = data.data;

                // Get player stats for HP
                const charData = await getCharacterStats(players);
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

    const open5eToProfile = (open5eCreatures) => {
        //map offline monsters to profile
        const open5eProfiles = open5eCreatures.map(open5eCreature => {
            return new Profile(open5eCreature)
        });
        return open5eProfiles
    }


    useEffect(() => {
        console.log("main load")
        if (creatures.length === 0 && gameId && !error) {
            loadProfiles();
            console.log("loadProfiles")
        } else if (creatures.length === 0 && !gameId && !error) {
            let savedCurrentEncounter = JSON.parse(localStorage.getItem('playerViewEncounter'))
            console.log("localStorage")
            console.log(savedCurrentEncounter.currentEncounterCreatures)

            setCreatures([...open5eToProfile(savedCurrentEncounter.currentEncounterCreatures)])
            setLoading(false)

            const getRefreshedLocalEncounter= () => {
                console.log("storage RELOAD")
                setCreatures([...open5eToProfile(JSON.parse(localStorage.getItem('playerViewEncounter')).currentEncounterCreatures)])
            }
            window.addEventListener('storage', getRefreshedLocalEncounter);
        }

        // Refresh every 5 minutes, when refreshed this way, show check mark for 45 seconds
        const intervalId = setInterval(() => {
            if(gameId) {
                console.log("🔄AUTO-REFRESH🔄")
                handleRefresh(3);
                setRecentlyRefreshed(true)
                const timer = setTimeout(() => {
                    setRecentlyRefreshed(false)
                }, 45000); // 45 seconds in milliseconds
                return () => clearInterval(timer);

            }
        }, 2 * 60.0 * 1000.0); // 5 minutes in milliseconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    // eslint-disable-next-line
    }, [creatures]);

    if(gameId && error) {
        return (
            <div>
                <HowTo />
                <br/>
                    If it still doesnt work Encounter ID might be wrong... idk
                <br/>
                <li>Error: {errorMessage.message}</li> 
            </div>
        )
    }
    if(!gameId && !isOfflineMode) {
        return (
            <HowTo backGroundImage={backGroundImage}/>
        )
    }

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

    const handleHideEnemies = () => {
        if(hideEnemies) // If hideEnemies is true, then refresh before revealing enemies
            handleRefresh(2)

        setHideEnemies(!hideEnemies)
    } 

    const handleEnemyBlood = () => {
        setEnemyBloodToggleType(enemyBloodToggleType === 2 ? 0 : enemyBloodToggleType + 1)
        if(enemyBloodToggleType === 0) {
            setEnemyBloodToggleImage(bloodIcon)
        } else if(enemyBloodToggleType === 1) {
            setEnemyBloodToggleImage(bloodIconSlash)
        } else if(enemyBloodToggleType === 2) {
            setEnemyBloodToggleImage(bloodIconMinus)
        }
    } 
    
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
    console.log("====")

    return (
        <div className="dndBackground" onClick={() => setClickedCreature(null)} style={{backgroundImage: backGroundImage ? `url(${backGroundImage})` : 'none'}}>
        
            {youtubeLink !== "" && !backGroundImage && 
                <YouTubeEmbed embedUrl={youtubeLink}/>
            }

            {loading && (<div className='loading'>Loading...</div>)}
            {((!foundCreatures && !loading) && (isOfflineMode && creatures.length === 0)) && (<div className='loading'>No Players or Monsters found in encounter id - {gameId}</div>)}
            <div className="cardContainer" style={cardContainerStyle}>
                {creatures.map((creature) => { 

                    if ((creature.type === 'monster' || creature.type === 'global') && hideEnemies) {
                        return null;
                    }
                    return <Icon key={uuidv4()} creature={creature} setClickedCreature={setClickedCreature} hideDeadEnemies={hideDeadEnemies} enemyBloodToggleType={enemyBloodToggleType} />;
                })}
            </div>

            <div className='options-container'>                
                <img className="option" src={arrowButton} alt={"change style"} onClick={handleMovePortraits} />
                <Tooltip message={"Icon Position"}/>

                <img className="option" src={enemyBloodToggleImage} alt={"enemy blood"} onClick={handleEnemyBlood} />
                <Tooltip message={(enemyBloodToggleType === 0 ? "Show Enemy Blood" : (enemyBloodToggleType === 1 ? "Show Enemy HP" : "Hide Enemy Blood & HP"))}/>

                <img className="option" src={hideEnemies ? eyeOpen : eyeClosed} alt={"showEnemies"} onClick={handleHideEnemies} />
                <Tooltip message={(hideEnemies ? "Show" : "Hide") + " Enemies"}/>
                { !hideEnemies && 
                    <>
                        <img className="option" src={hideDeadEnemies ? skullButton : skullButtonNot} alt={"showDeadEnemies"} onClick={() => setHideDeadEnemies(!hideDeadEnemies)} />
                        <Tooltip message={(hideDeadEnemies ? "Show" : "Hide") + " Dead Enemies"}/>
                    </>
                }
                <ImagePopup setBackGroundImage={setBackGroundImage} setYoutubeLink={setYoutubeLink} />
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

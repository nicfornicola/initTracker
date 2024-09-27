import '../../dmView/style/App.css';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Effect from './Effect';
import { v4 as uuidv4 } from 'uuid';
import { effectObjs } from '../../dmView/constants.js';
import YouTubeEmbed from '../../dmView/components/EncounterColumn/YouTubeEmbed.js';

function PlayerPage({playerView, playerViewBackground, hideEnemies, enemyBloodToggle, hideDeadEnemies, cardContainerStyle}) {
    const [creatures, setCreatures] = useState(playerView?.currentEncounterCreatures || []);
    const [clickedCreature, setClickedCreature] = useState(null);
    const [turnNum, setTurnNum] = useState(playerView.turnNum);
    const [roundNum, setRoundNum] = useState(playerView.RoundNum);


    console.table({"hideEnemies": hideEnemies,
                    "enemyBloodToggle": enemyBloodToggle,
                    "hideDeadEnemies": hideDeadEnemies,
                    "cardContainerStyle": cardContainerStyle})

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
    
    return (
        <div className="dndBackground" onClick={() => setClickedCreature(null)} style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
            {roundNum !== 0 && 
                <div className='roundNum'>
                    {roundNum}
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

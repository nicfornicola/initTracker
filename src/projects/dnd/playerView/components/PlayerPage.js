import '../../dmView/style/App.css';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import YouTubeEmbed from '../../dmView/components/EncounterColumn/YouTubeEmbed.js';

function PlayerPage({playerView, playerViewBackground, hideEnemies, enemyBloodToggle, hideDeadEnemies, cardContainerStyle}) {
    const [creatures, setCreatures] = useState(playerView?.currentEncounterCreatures || []);
    const [turnNum, setTurnNum] = useState(playerView.turnNum);
    const [roundNum, setRoundNum] = useState(playerView.RoundNum);


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

    return (
        <div className="dndBackground" style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
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
                        return (((creature.type === 'monster' || creature.type === 'global') && creature.alignment !== "ally" && hideEnemies) || creature.hidden) 
                        ? null
                        : <Icon key={creature.guid} isTurn={turnNum === index+1} creature={creature} hideDeadEnemies={hideDeadEnemies} enemyBloodToggle={enemyBloodToggle} />;
                    })
                )}
            </div>
        </div> 
    );
}


export default PlayerPage;

import '../../dmView/style/App.css';
import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import YouTubeEmbed from '../../dmView/components/EncounterColumn/YouTubeEmbed.js';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

function PlayerPage({playerView, playerViewBackground}) {
    const [creatures, setCreatures] = useState([]);
    const [turnNum, setTurnNum] = useState(0);
    const [roundNum, setRoundNum] = useState(0);
    const [hideEnemies, setHideEnemies] = useState(true);
    const [enemyBloodToggle, setEnemyBloodToggle] = useState(1);
    const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    const [cardContainerStyle, setCardContainerStyle] = useState({width: '80%'});

    const { encounterGuid } = useParams();

    const socketRef = useRef(null)
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:8081'); // Create socket connection
            setSocket(socketRef.current)
        }
    }, [socketRef]);

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log(`Connected to Playerview - ${socket.id}`);
                socket.emit('connectPlayerview', encounterGuid);
            });

            // Recieve messages from backend
            socket.on('sendPlayerViewCreatures', (encounterCreatures) => {
                console.log("sendPlayerViewCreatures", encounterCreatures)
                if(encounterCreatures.length === 0) {
                    console.log("No Encounter found for", encounterGuid)
                }

                setCreatures([...encounterCreatures])
            });

            // Recieve messages from backend
            socket.on('sendPlayerViewControls', (encounterRes) => {
                console.log("sendPlayerViewControls", encounterRes)
                setRoundNum(encounterRes.roundNum)
                setTurnNum(encounterRes.turnNum)
                setHideEnemies(encounterRes.hideEnemies)
                setEnemyBloodToggle(encounterRes.enemyBloodToggle)
                setHideDeadEnemies(encounterRes.hideDeadEnemies)
                setCardContainerStyle(encounterRes.cardContainerStyle)
            });
        }

        // Clean up the socket connection on component unmount
        return () => {
            if(socket) socket.disconnect();
        };
    }, [socket]);

    // useEffect(() => {
    //     setCreatures([...playerView.creatures])
    //     handleTurns(true, playerView.turnNum, playerView.roundNum)
    // }, [playerView])

    // const handleTurns = (inProgress, tNum, rNum) => {
    //     if(inProgress) {
    //         setTurnNum(tNum)
    //         setRoundNum(rNum)
    //     }
    //     else {
    //         setTurnNum(0)
    //         setRoundNum(0)
    //     }
    // }

    return (
        <div className="background playerViewAdds" style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
            
            {playerViewBackground.type === "youtube" && 
                <YouTubeEmbed embedUrl={playerViewBackground.src}/>
            }


            {roundNum !== 0 && 
                <div className='roundNum'>
                    {roundNum}
                </div>
            }
            
            <div className="cardContainer" style={cardContainerStyle}>
                {creatures.length === 0 ? (
                    <div className='loading'>No Creatures found...</div>
                ) : (
                    creatures.map((creature, index) => { 
                        return (((creature.type === 'monster' || creature.type === 'global') && creature.alignment !== "ally" && hideEnemies) || creature.hidden) 
                        ? null
                        : <Icon key={creature.creatureGuid} isTurn={turnNum === index+1} creature={creature} hideDeadEnemies={hideDeadEnemies} enemyBloodToggle={enemyBloodToggle} />;
                    })
                )}
            </div>
        </div> 
    );
}


export default PlayerPage;

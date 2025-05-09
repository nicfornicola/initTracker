import '../../dmView/style/App.css';
import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import YouTubeEmbed from '../../dmView/components/EncounterColumn/YouTubeEmbed.js';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import defaultBackground from '../../dmView/pics/backgrounds/happyTavern.png';
import { backendUrl, cheaterMode } from '../../dmView/constants.js';

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
// monster, player, global
const showIcon = (creature, hideEnemies) => {
    if(cheaterMode){
        return true
    }

    let isGoodGuy = creature.alignment === "ally" || creature.alignment === "pet"
    let isPlayer = creature.type === 'player'

    // Individual takes priority whether its a player good or bad or pet
    if(creature.hidden)
        return false 
    // then check global hide button  
    else if(hideEnemies) {
        // Return true if its a good guy or a player, false if bad guy or global
        return isGoodGuy || isPlayer;
    }
    
    // if global check is visible then show everyone that isnt individually hidden
    return true
}


function PlayerPage() {
    const [playerViewBackground, setPlayerViewBackground] = useState({type: "image", src: defaultBackground});
    const [creatures, setCreatures] = useState(null);
    const [turnNum, setTurnNum] = useState(0);
    const [roundNum, setRoundNum] = useState(0);
    const [hideEnemies, setHideEnemies] = useState(true);
    const [enemyBloodToggle, setEnemyBloodToggle] = useState(1);
    const [hideDeadEnemies, setHideDeadEnemies] = useState(false);
    const [cardContainerStyle, setCardContainerStyle] = useState({width: '80%'});
    const [iconSize, setIconSize] = useState({width: 200, height: 240});

    const { sessionID } = useParams();

    const socketRef = useRef(null)
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!socketRef.current) {
            const newSocket = io(backendUrl);
    
            socketRef.current = newSocket;
            setSocket(newSocket);
        }

        return () => {
            if (socketRef.current) {
                console.log(`Disconnecting socket: ${socketRef.current.id}`);
                socketRef.current.disconnect();
            }
        };
    }, []); // 👈 empty deps means this runs only once, on mount

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log(`Connected to Playerview - ${socket.id}`);
                socket.emit('connectPlayerview', sessionID);
            });

            socket.on('pvPing', () => {
                socket.emit("pvPong")
            });

            socket.on('disconnect', reason => {
                console.log('Socket disconnected:', reason);
            });

            // Recieve messages from backend
            socket.on('sendPlayerViewCreatures', (encounterCreatures) => {
                console.log("sendPlayerViewCreatures", encounterCreatures)
                if(encounterCreatures.length === 0) {
                    console.log("No Encounter found for", sessionID)
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
                let w = 200 + (20 * encounterRes.iconsize)
                let h = 240 + (24 * encounterRes.iconsize)
                setIconSize({width: w, height: h})

                if(encounterRes.backgroundGuid === 'defaultError') {
                    console.log("Image not found setting to default")
                    setPlayerViewBackground({type: "image", src: defaultBackground})
                } else if(encounterRes.backgroundGuid === 'default') {
                    setPlayerViewBackground({type: "image", src: defaultBackground})
                } else {
                    setPlayerViewBackground(
                        encounterRes.backgroundGuid.includes('youtube.com')
                            ? getVideoLink(encounterRes.backgroundGuid)
                            : {type: 'image', src: encounterRes.backgroundGuid}
                    )
                }
            });

            socket.on('stopStreaming', () => {
                setCreatures(null)
                setTurnNum(0);
                setRoundNum(0);
                setHideEnemies(true);
                setEnemyBloodToggle(1);
                setHideDeadEnemies(false);
                setCardContainerStyle({width: '80%'});
                setPlayerViewBackground({type: "image", src: defaultBackground})
            });
        }

        // Clean up the socket connection on component unmount
        return () => {
            if(socket) {
                console.log(`Disconnecting from Playerview - ${socket.id}`);
                socket.disconnect();
            } 
        };
    }, [socket]);

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
            
                {creatures === null ? (
                    <div className=" firstLoadMenuContainer">
                        <div className="firstLoadMenu">
                            <div className="homepageTopContent">
                                <h1>DmBuddy.com</h1>
                                <span>Home Brew Focused Encounter Builder and Player View</span>
                                <span className='firstLoadExtra'>(with Dnd Beyond Importing)</span>
                                <div className='noStreamingDesc'>Dm not streaming... get it together man...</div>
                            </div>
                            <a className='helpLink' href='/help'>DmBuddy.com/help</a>
                        </div>
                    </div>

                ) : (
                    <div className="cardContainer" style={cardContainerStyle}>
                        {creatures.map((creature, index) => { 
                            return showIcon(creature, hideEnemies) 
                                ? <Icon key={creature.creatureGuid} isTurn={turnNum === index+1} creature={creature} hideDeadEnemies={hideDeadEnemies} enemyBloodToggle={enemyBloodToggle} iconSize={iconSize}/>
                                : null
                        })}
                    </div>
                )}
        </div> 
    );
}


export default PlayerPage;

import '../../../dmView/style/App.css';
import React, { useState, useEffect, useRef } from 'react';
import WhoAreYouIcon from './WhoAreYouIcon.js';
import CharacterController from './CharacterController.js';
import YouTubeEmbed from '../../../dmView/components/EncounterColumn/YouTubeEmbed.js';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

function WhoAreYou({playerView, playerViewBackground}) {
    console.log("creatures", playerView?.creatures)

    const [players, setPlayers] = useState([]);
    const [turnNum, setTurnNum] = useState(playerView.turnNum);
    const [messages, setMessages] = useState([]); // State to store messages
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const socketRef = useRef(null)
    const [socket, setSocket] = useState(null);
    const [givenName, setGivenName] = useState('');


    const { encounterGuid } = useParams();

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:8081'); // Create socket connection
            setSocket(socketRef.current)
        }
    }, [socketRef]);

    useEffect(() => {
        if(socket) {
            // Emit room ID to the server after connection is established
            socket.on('connect', () => {
                console.log(`Connected to ${encounterGuid}`);
                socket.emit('joinedEncounter', encounterGuid); // Send the encounter ID to the server
            });

            // Recieve messages from backend
            socket.on('messageToEncounter', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]); 
            });
            
            // Recieve messages from backend
            socket.on('setGivenName', (playerName) => {
                setGivenName(playerName); 
            });

            // Recieve messages from backend
            socket.on('populateEncounterPlayers', (resPlayers) => {
                console.log("Players Populated", resPlayers)
                setPlayers([...resPlayers])
            });
        }

        // Clean up the socket connection on component unmount
        return () => {
            if(socket) socket.disconnect();
        };
    }, [socket]);


    const handleSetSelectedCharacter = (creature) => {
        setSelectedCharacter(creature)
        socket.emit('characterSelected', creature.creatureGuid, creature.name);
    }

    // useEffect(() => {
    //     setCreatures([...playerView.creatures])
    //     handleTurns(true, playerView.turnNum)
    // }, [playerView])

    // const handleTurns = (inProgress, tNum) => {
    //     setTurnNum(inProgress ? tNum : 0)
    // }

    const handleBackButton = (event) => {
        socket.emit("characterUnselected")
        setSelectedCharacter(null)
    }

    return (
        <div className="background playerViewAdds" style={{backgroundImage: playerViewBackground.type === "image" && playerViewBackground.src ? `url(${playerViewBackground.src})` : 'none'}}>
            {messages && 
                <ul className='joinMessageList'>
                    {messages.map((message, index) => (
                        <li className='joinMessageListItem' key={index+message} >
                            {message}
                        </li>
                    ))}
                </ul>
            }

            {givenName && 
                <div className='joinGivenName'>
                    {givenName}
                </div>
            }

            {playerViewBackground.type === "youtube" && 
                <YouTubeEmbed embedUrl={playerViewBackground.src}/>
            }         

            {selectedCharacter !== null && 
                <>
                    <div style={{position: 'absolute', top: 5, left: 5}} onClick={handleBackButton}>{'<<<'}</div>
                    <CharacterController key={selectedCharacter.creatureGuid} isTurn={turnNum === players.findIndex(player => player.creatureGuid === selectedCharacter.creatureGuid)+1} creature={selectedCharacter} socket={socket}/>
                </>
            }  
            {selectedCharacter === null && 
                <div className='whoAreYouContainer'>
                    <div className='joinMessageTitle'>
                        Who are you?
                    </div>  
                    <div className="cardContainer">
                        {players.length === 0 ? (
                                <div className='loading'>No Player Characters found... Dm might need to creature to Players</div>
                        ) : (
                            // Show players and allys in the choose character menu
                            players.map((player, index) => { 
                                return (player.type === 'player' || player.type === "ally")
                                ? <WhoAreYouIcon key={player.creatureGuid} isTurn={turnNum === index+1} creature={player} handleSetSelectedCharacter={handleSetSelectedCharacter}/>
                                : null;
                            })
                        )}
                    </div>
                </div>
            }
        </div> 
    );
}


export default WhoAreYou;

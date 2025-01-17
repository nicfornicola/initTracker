import React, {useRef, useState, useEffect} from "react";
import defaultBackground from '../pics/backgrounds/happyTavern.png'
import io from 'socket.io-client';
import { backendUrl } from "../constants";

const Users = () => {
    const socketRef = useRef(null)
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(backendUrl); // Create socket connection
            setSocket(socketRef.current)
        }
    }, [socketRef]);

    useEffect(() => {
        if(socket && users === null) {
            // Recieve messages from backend
            socket.emit('getUsers'); 

            socket.on('gotUsers', (users) => {
                setUsers(users)
            });

        }

        // Clean up the socket connection on component unmount
        return () => { if(socket) socket.disconnect(); };
    }, [socket]);

    return (
        <div className="background " style={{backgroundImage: `url(${defaultBackground})`}}>
            <div className=" firstLoadMenuContainer">
                <div className="firstLoadMenu">
                    <div className="homepageTopContent">
                        <h1>Users: {users?.length}</h1>
                        <ol className="userGrid">
                            {users?.map((user, index) => (
                                <li key={index} className="userItem">
                                    {user.username}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;
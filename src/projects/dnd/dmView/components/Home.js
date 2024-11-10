import React, {useEffect, useState} from 'react';
import { useUser } from '../../../../providers/UserProvider.js';
import '../../dmView/style/App.css';
import InputEncounterId from './SideMenu/InputEncounterId.js';
import InputCharacterId from './SideMenu/InputCharacterId.js';
import DropdownMenu from './EncounterColumn/DropdownMenu.js';

const Home = ({savedEncounters, setSavedEncounters, currentEncounter, setCurrentEncounter, encounterGuid, handleNewEncounter, handleLoadEncounter, socket}) => {
    const { username, setUsername } = useUser();
    const [loginUsername, setLoginUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [openCreateAccount, setOpenCreateAccount] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if(socket) {
            socket.on('badLogin', (errorCode) => {
                if(errorCode === "userNotFound") {
                    setOpenCreateAccount(true)
                    setError("User not found: Create an account or continue as guest")
                } else if(errorCode === "passwordIncorrect") {
                    setError("Nat 1 history: Username or Password Incorrect")
                } else if(errorCode === "usernameTaken") {
                    setError("No a 4 does not hit: username already taken")
                }
            });
    
            //get this when login or successful account creation
            socket.on('goodLogin', (emitUsername) => {
                setUsername(emitUsername);
                setLoggedIn(true)
                setError('')
            });
        }
    }, [socket])


    let validUsernameLength = loginUsername.length >= 8 
    let validPasswordLength = password.length >= 8 

    let loginEnabled = validUsernameLength && validPasswordLength
    let passwordMatch = validPasswordLength && password === password2

    let createAccountEnabled = loginEnabled && passwordMatch

    let usernameStyle = openCreateAccount ? {outline: `2px solid ${validUsernameLength ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`} : {}
    let passwordStyle = openCreateAccount ? {outline: `2px solid ${validPasswordLength ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`} : {}


    const submitLogin = () => {
        if(loginEnabled)
            socket.emit("login", loginUsername, password)
    }

    const submitNewAccount = () => {
        if(createAccountEnabled)
            socket.emit("newAccount", loginUsername, password)
    }

    const signOut = () => {
        setLoggedIn(false)
        setPassword('')
        setPassword2('')
        setUsername('')
        setLoginUsername('')
        setOpenCreateAccount(false)
    }

    return (
        <div className='firstLoadMenuContainer'>
            <div className='firstLoadMenu'>
                <div className='homepageTopContent'>
                    <h1>DmBuddy.com</h1>
                    <span>
                        Home Brew Focused Encounter Building and Player View
                    </span>
                    <span className='firstLoadExtra'>
                        (with Dnd Beyond Importing)
                    </span>
                </div>

                <div className="homePageGrid">
                    
                    <div className="gridCell largeCell">
                        {loggedIn ? (
                            <>
                                <div>Hey, {username}!</div>
                                <button className='loginButtons' onClick={signOut}>Sign out</button>
                            </>
                        ) : (
                            <div className="loginContainer">
                                <input
                                    className='loginInput'
                                    style={usernameStyle}
                                    type="text"
                                    placeholder='Username'
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                />
                                <input
                                    className='loginInput'
                                    style={passwordStyle}
                                    type="password"
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {openCreateAccount ? (
                                    <div className=''>
                                        <input
                                            className={`loginInput`}
                                            style={{outline: `2px solid ${passwordMatch ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`}}
                                            type="password"
                                            placeholder='Retype Password'
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                        />
                                        <div className='createAccountFlex'>
                                            <button className='loginButtons' onClick={() => setOpenCreateAccount(false)} >Cancel</button>
                                            <button className='loginButtons' onClick={submitNewAccount} disabled={!createAccountEnabled}>Submit</button>
                                        </div>
                                        {(error || !validUsernameLength || !validPasswordLength || !passwordMatch) && 
                                            <div className='info'>
                                                {error !== '' && <div className='loginError'> {error} </div>}
                                                {!validUsernameLength &&  <div className='loginError'>Username: atleast 8 characters</div>}
                                                {!validPasswordLength && <div className='loginError'>Password: atleast 8 characters</div>}
                                                {!passwordMatch && <div className='loginError'>Password: needs to match</div>}
                                            </div>
                                        }
                                    </div>
                                ) : (
                                    <>
                                        <div className='createAccountFlex'>
                                            <button className='loginButtons newAccountButton' onClick={setOpenCreateAccount} > New account? </button>
                                            <button className='loginButtons' onClick={submitLogin} disabled={!loginEnabled} > Log in </button>
                                        </div> 
                                        {error !== '' &&
                                            <div className='info'>
                                                {error && <div className='loginError'> {error} </div>}
                                            </div>
                                        }
                                        
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="gridCell">
                        <button className='homePageButton' onClick={handleNewEncounter} > New Encounter </button>
                    </div>
                    <div className="gridCell">
                        Import Dnd Beyond Encounter
                        <InputEncounterId 
                            setCurrentEncounter={setCurrentEncounter} 
                            encounterGuid={encounterGuid} 
                            socket={socket} 
                        />
                    </div>
                    <div className="gridCell">
                        <DropdownMenu 
                            setSavedEncounters={setSavedEncounters} 
                            savedEncounters={savedEncounters} 
                            handleLoadEncounter={handleLoadEncounter} 
                            currentEncounter={currentEncounter} 
                            socket={socket} 
                        />
                    </div>
                    <div className="gridCell">
                        Import Dnd Beyond Character
                        <InputCharacterId 
                            setCurrentEncounter={setCurrentEncounter} 
                            encounterGuid={encounterGuid} 
                            socket={socket} 
                        />
                    </div>
                </div>

                <a className='helpLink' href='/help'>DmBuddy.com/help</a>
            </div>
        </div>
    );
};

export default Home;
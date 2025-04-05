import React, {useEffect, useState} from 'react';
import { useUser } from '../../../../providers/UserProvider.js';
import '../../dmView/style/App.css';
import { ThreeDots } from 'react-loader-spinner'
import { isDev } from '../constants.js';

const SignIn = ({socket}) => {
    const { username, setUsername, password, setPassword } = useUser();
    const [loginUsername, setLoginUsername] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [openCreateAccount, setOpenCreateAccount] = useState(false)
    const [loggedIn, setLoggedIn] = useState(username !== 'Username' && password !== '')
    const [loading, setLoading] = useState(null)
    const [backendReady, setBackendReady] = useState(false)
    const [loginTried, setLoginTried] = useState(false)
    const [error, setError] = useState('')
    
    const goodLogin = (emitUsername, emitPassword) => {
        setLoading(false)
        setUsername(emitUsername);
        setPassword(emitPassword);
        setLoggedIn(true)
        setError('')
        setLoginTried(false)
        setBackendReady(false)
    }

    useEffect(() => {
        if(isDev && !loggedIn) {
            goodLogin("nicdev", 'devpass')
        }

        if(socket) {
            socket.on('badLogin', (errorCode) => {
                setLoading(false)
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
            socket.on('goodLogin', async (userData) => {
                goodLogin(userData.emitUsername, userData.emitPassword)
            });

            socket.on('backendready', () => {
                setBackendReady(true)
            });
        }
    }, [socket])

    useEffect(() => {
        if(backendReady && ((loginTried && !loggedIn) || loggedIn)) {
            setTimeout(() => reLogin(), 100)
        }
    }, [backendReady])

    let validUsernameLength = loginUsername.length >= 8 
    let validPasswordLength = password1.length >= 8 

    let loginEnabled = validUsernameLength && validPasswordLength
    let passwordMatch = validPasswordLength && password1 === password2

    let createAccountEnabled = loginEnabled && passwordMatch

    let usernameStyle = openCreateAccount ? {outline: `2px solid ${validUsernameLength ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`} : {}
    let passwordStyle = openCreateAccount ? {outline: `2px solid ${validPasswordLength ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`} : {}

    const submitLogin = () => {
        setLoading(true)
        if(loginEnabled) {
            socket.emit("login", loginUsername, password1)
            setLoginTried(true)
        } else {
            setError("Nat 1 history: Username or Password Incorrect")
            setLoading(false)
        }
    }

    const reLogin = () => {
        if(username !== 'Username' && password !== '') {
            socket.emit("login", username, password)
        } else {
            submitLogin()
        }
    }

    const submitNewAccount = () => {
        setLoading(true)
        if(createAccountEnabled) {
            socket.emit("newAccount", loginUsername, password1)
        }
    }

    const signOut = () => {
        setLoggedIn(false)
        setPassword1('')
        setPassword2('')
        setUsername('Username')
        setPassword('')
        setLoginUsername('')
        setOpenCreateAccount(false)
        setLoginTried(false)
        setBackendReady(false)
    }

    return (
        <>
            {loggedIn || username !== 'Username' ? (
                <div className='loginGreeting'>
                    <div>Hey, {username}!</div>
                    <button className='loginButtons' onClick={signOut}>Sign out</button>
                </div>
            ) : (
                <div className="loginContainer growImage">
                    <input
                        className='loginInput'
                        style={usernameStyle}
                        type="text"
                        placeholder='Username'
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitLogin();
                            }
                        }}
                    />
                    <input
                        className='loginInput'
                        style={passwordStyle}
                        type="password"
                        placeholder='Password'
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitLogin();
                            }
                        }}
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
                            <div className='createAccountFlex' style={{justifyContent: loading ? 'center' : 'space-between'}}>
                                {loading ? (
                                    <ThreeDots
                                        visible={true}
                                        height="20"
                                        width="50"
                                        color="#FFFFFF"
                                        radius="1"
                                        ariaLabel="three-dots-loading"
                                    />
                                ) : (
                                    <>
                                        <button className='loginButtons' onClick={() => setOpenCreateAccount(false)}>Cancel</button>
                                        <button className='loginButtons' onClick={submitNewAccount} disabled={!createAccountEnabled}>Submit</button>        
                                    </>
                                )}
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
                            <div className='createAccountFlex' style={{justifyContent: loading ? 'center' : 'space-between'}}>
                                {loading ? (
                                   <ThreeDots
                                        visible={true}
                                        height="20"
                                        width="50"
                                        color="#FFFFFF"
                                        radius="1"
                                        ariaLabel="three-dots-loading"
                                   />
                                ) : (
                                    <>
                                        <button className='loginButtons newAccountButton' onClick={setOpenCreateAccount}> New account? </button>
                                        <button className='loginButtons' onClick={submitLogin} disabled={!loginEnabled}> 
                                            Log in 
                                        </button>
                                    </>
                                )}
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
        </>           
    );
};

export default SignIn;
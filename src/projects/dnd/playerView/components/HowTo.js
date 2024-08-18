import '../style/App.css';
import React from 'react';
import urlSnippet from '../../pics/demo/urlSnippet.png';
import toggleButton1 from "../../pics/demo/toggleButton1.png"
import toggleButton2 from "../../pics/demo/toggleButton2.png"
import iconDemo from "../../pics/demo/iconDemo.png"
import effectsDemo from "../../pics/demo/effectsDemo.png"
import backgroundDemo from "../../pics/demo/backgroundsDemo.png"
import refreshDemo from "../../pics/demo/refreshDemo.png"
import CorsDemoMessage from './CorsDemoMessage.js';
import { proxyUrl } from '../constants.js';

 
function HowTo({backGroundImage}) {


    return (
        <div className="instructionsBackGround" style={{backgroundImage: `url(${backGroundImage})`}}>
            <ul className='instructions'>
                <strong>How to set up: </strong> <i>(add me on discord if you have any questions or feedback: Staygo)</i>
                <hr/>
                <ul>
                    {(proxyUrl === "https://cors-anywhere.herokuapp.com/") && 
                        <CorsDemoMessage /> 
                    }
                    <li>Click one of your encounters in DND Beyond</li>
                    <li>Get the encounter ID from the url: ⬇️⬇⬇️⬇⬇️</li>
                    <li><img src={urlSnippet} alt="snippet" width="60%" height="20%"/></li>
                    <li>Add encounter ID to the url, like this </li>
                    <ul>
                        <li>
                            <a style={{color: "white"}} href="/dnd/aa3f3817-f44b-4116-b2e5-39e1eebc9f7d">
                                dmbuddy.com/dnd/aa3f3817-f44b-4116-b2e5-39e1eebc9f7d
                            </a>
                        </li>
                    </ul>
                    <li>FIGHT!</li>
                </ul>
                <hr/>
                <strong>Upload Backgrounds</strong>
                <hr/>
                <ul>
                    <li>
                        Upload your own background images or set Youtube links that will auto play and auto loop!
                    </li>
                    <li>
                        <img id={"backgroundDemo"} className='backgroundDemo' src={backgroundDemo} alt={"help"}/>
                    </li>
                </ul>
            </ul>
            <ul className='instructions'>
                <strong>Features</strong>
                <hr/>
                <ul>
                    <strong>Character/Monsters:</strong>
                    <hr/>
                    <ul>
                        <li>
                            Names, Portraits, Initiative, HP, Exhaustion Lvl, Death Saves all live from DND beyond!
                        </li>
                        <li>
                            Live stat updates with Dynamic coloring and blood spatters based on current HP, Skull Overlay for dead creatures
                        </li>
                        <li>
                            <img className='iconDemo' src={iconDemo} alt={"help"}/>
                        </li>
                        <li>
                            Click Portraits to add buffs/debuffs to help tracking in combat
                        </li>
                        <li>
                            <img className='effectsDemo' src={effectsDemo} alt={"help"}/>
                        </li>
                    </ul>
                    <strong> Toggle buttons:</strong>
                    <hr/>
                    <ul>
                        <li>
                            Show Enemies, Upload Backgrounds, Timer 
                        </li>
                        <li>
                            <img className='toggleButton1Demo' src={toggleButton1} alt={"help"}/>
                        </li>
                        <li>
                            Hide Enemies, Hide Dead Enemies, Timer (click), Restart Timer, Play/Pause Timer
                        </li>
                        <li>
                            <img className='toggleButton2Demo' src={toggleButton2} alt={"help"}/>
                        </li>
                        <li>
                            Stats refresh every 5 minutes but can also be manually Refreshed
                        </li>
                        <li>
                            <img className='refreshDemo' src={refreshDemo} alt={"help"}/>
                        </li>
                    </ul>
                </ul>
            </ul>
        </div>
    );
}

export default HowTo;

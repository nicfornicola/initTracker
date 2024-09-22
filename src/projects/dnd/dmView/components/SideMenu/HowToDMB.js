import '../../style/App.css';
import React from 'react';
import toggleButton2 from "../../../pics/demo/toggleButton2.png"
import iconDemo from "../../../pics/demo/iconDemo.png"
import effectsDemo from "../../../pics/demo/effectsDemo.png"
import refreshDemo from "../../../pics/demo/refreshDemo.png"
import background13 from "../../pics/backgrounds/happyTavern.png"
 
function HowTo() {
    return (
        <div className="instructionsBackGround" style={{backgroundImage: `url(${background13})`}}>
            <ul className='instructions'>
                <strong>Create an encounter! </strong> <i>(add me on discord if you have any questions or feedback: Staygo)</i>
                <hr/>
                <ul>
                    <li>Name your encounter</li>
                    <li>Click creatures to view detailed stat blocks</li>
                    <li>Add creatures by hovering and clicking the + in the search list</li>
                    <li>Remove a creature by hovering and clicking the read X next its hp</li>
                    <li>Click creature portraits in your encounter to upload custom art</li>
                    <li>Change creature names and AC with ease</li>
                    <li>Handle healing, damaging, temporary hp and custom overrides by clicking a creatures hp</li>
                    <li>When a fight breaks out, click Auto Initative or manually enter initative rolls to the left of the creatures portrait</li>
                    <li>If you really want to get fancy, click Play, to open a dynamic player view made with love just for the players! (see the player view how to)</li>
                    <li>Click the {'<< and >>'} to track turns, (when you are done with turn tracking go back to Round 0, Turn 0, to remove the blue tracker</li>
                    <li>Need some hidden creatures in combat? Make their initative negative so hide them from the playerview</li>
                    <li>Save plenty of encounters in the "Encounters..." tab, click an encounter to get load it up!</li>
                </ul>
                <hr/>
                <strong>Side Menu</strong>
                <hr/>
                <ul>
                    <li>Need more room while fighting? Click the Magnifying Glass on the left to toggle the search columns</li>
                    <li>Download a JSON file with all your encounters and custom images</li>
                    <li>Upload that JSON file!</li>
                    <hr/>
                    <li><strong>Importing Dnd Beyond Characters.</strong></li>
                    <ul>
                        <li>Go to your character sheet on Dnd_Beyond</li>
                        <li>Something like this <a href='https://www.dndbeyond.com/characters/12345678'>https://www.dndbeyond.com/characters/12345678</a></li>
                        <li>Get that number from the url. (123456780)</li>
                        <li>Enter it in the text box and click the green check.</li>
                        <li>Import more then one like this, 12345678,12345678,12345678 </li>
                        <li>PC's who import get Auto updating HP from Dnd_Beyond and the works!</li>

                    </ul>
                    
                </ul>
                
            </ul>
            <ul className='instructions'>
                <strong>Player View Features</strong>
                <hr/>
                <ul>
                    <strong>Character/Monsters:</strong>
                    <hr/>
                    <ul>
                        <li>
                            Names, Portraits, Initiative, HP, Exhaustion Lvl, Death Saves all live from Dm Buddy and DND beyond!
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
                            Move portaits (top, bottom, middle), Toggle enemy blood splatter, press again to toggle enemy HP, Hide/Show all enemies, Hide Dead Enemies, Upload/Set Background, Timer (click), Restart Timer, Play/Pause Timer
                        </li>
                        <li>
                            <img className='toggleButton2Demo' src={toggleButton2} alt={"help"}/>
                        </li>
                        <li>
                            Stats refresh every minute or so but can also be manually refresh (Only applicable if importing, Refresh, players, monsters, all)
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

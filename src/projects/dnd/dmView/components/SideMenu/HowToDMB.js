import '../../style/App.css';
import React from 'react';
import toggleButton2 from "../../../pics/demo/toggleButton2.png"
import iconDemo from "../../../pics/demo/iconDemo.png"
import effectsDemo from "../../../pics/demo/effectsDemo.png"
import background13 from "../../pics/backgrounds/happyTavern.png"
 
function HowTo() {
    return (
        <div className="instructionsBackGround" style={{backgroundImage: `url(${background13})`}}>
            <ul className='instructions'>
                <strong>DM View Help! </strong> <i>(add me on discord if you have any questions or feedback: Staygo)</i>
                <hr/>
                <details style={{ whiteSpace: "pre-wrap" }}>
                    <summary><strong>Side Menu</strong></summary>
                    <ul>
                        <li>Click {'<< or >>'} to hide/show the side menu</li>
                        <li>Click the Magnifying Glass to hide/show the search columns for more room for your encounter</li>
                        <li>Sign in options</li>
                        <li>Help Page! (your lookin at it)</li>
                    </ul>
                    <hr/>
                </details>
                <details style={{ whiteSpace: "pre-wrap" }}>
                    <summary><strong>Search Tab</strong></summary>
                    <hr/>
                    <p>All monster data comes from open5e.com</p>
                    <ul>
                        <li>Click creatures to view their stat blocks</li>
                        <li>Hover and click the '+' to add them to your encounter</li>
                        <li>If you are looking for a specific monster you can search for their name CR type or alignment</li>
                        <li>Monster are random by default and can be shuffled or sorted by clicking the buttons right of the search bar</li>
                    </ul>
                    <hr/>
                </details>
                <details style={{ whiteSpace: "pre-wrap" }}>
                    <summary><strong>Homebrew Tab</strong></summary>
                    <hr/>
                    <p>Homebrew is part of what makes DmBuddy special! Its super easy and quick to make changes before hand or on the fly</p>
                    <ul>
                        <li>Any creature can be used as a template for homebrewing and will save here </li>
                        <li>From here you can delete it or add it by hitting the 'x' or '+' </li>
                        <li>Monsters can be added to homebrew by adding them to an encounter, opening their statblock and clicking edit. There you can click "Save to Homebrew" or "Overwrite to Homebrew" if its already saved. More on that in the edit mode section</li>
                    </ul>
                    <hr/>
                </details>
                <details style={{ whiteSpace: "pre-wrap" }}>
                    <summary><strong>DndBeyond Imports Tab</strong></summary>
                    <hr/>
                    <p>If your players use DndBeyond, great! Import them here and show their avatars in the Streamed 'Player View'</p>
                    <ul>
                        <li>Import Players and whole encounters from DndBeyond, this imports everything you might need... names, images and monster stats!</li>
                        <li>You can import players by there 'Character Id' which can be found in the DndBeyond url when viewing their character online.  </li>
                        <ul>
                            <li> Players imported like this will have their Name, HP, avatar, exhaustion level and AC automatically refreshed every minute!</li>
                            <li> i.e. https://www.dndbeyond.com/characters/<strong>44429861</strong> (<strong>44429861</strong> is one of my PCs so try it out!)</li>
                            <li> Import more then one player at a time with a comma seperated list <i>i.e. 12345678,12345678,12345678</i></li>
                        </ul>
                        <li>Importing encounters is similar but instead go to your DndBeyond Encounters and find the Encounter Id</li>
                        <ul>
                            <li> i.e. https://www.dndbeyond.com/combat-tracker/<strong>66fd3695-5e48-426e-b03f-3c7bbd6512c8</strong> (This encounter is also real so give it a try!)</li>
                            <li> Encounter importing gets all players and monsters while also setting the encounter name to whatever it was on DndBeyond</li>
                            <li> Encounter importing is an easy way to get all your players imported in one go by making an encounter and added the campaign in DndBeyond</li>
                        </ul>
                    </ul>
                    <hr/>
                </details>
                <details style={{ whiteSpace: "pre-wrap" }}>
                    <summary><strong>Encounter Column - left to right - top to bottom</strong></summary>
                    <hr/>
                    <p>This is your current encounter, handle all of your stat tracking here, while also streaming the Player View for mega immersion! <i>(Since there is alot going on here, this will be broken up into smaller bits)</i></p>
                    <ul>
                        <details style={{ whiteSpace: "pre-wrap" }}>
                            <summary><strong>Top Most Buttons</strong></summary>
                            <ol>
                                <li>All your saved Encounters</li>
                                <li>New Encounter button... to make a New Encounter</li>
                                <li>Current Player View Stream!</li>
                                <ul>
                                    <li> '+' and '-' buttons to change the size of the player views icons</li>
                                    <li> Click one of your encounters to start the Steam, click another one to switch the player view to that encounter</li>
                                    <li> "Open Player View" to open up a new window to show on a 2nd monitor OR send that link to your players!</li>
                                    <li> Don't worry, they wont see anything you dont want them to! Monsters are hidden by default until you choose. (more about this in the Player View section)</li>
                                    <li> "Stop Streaming"... stops streaming... yeah</li>
                                </ul>
                                <li>Note: You can open and make last minute changes to encounter B on the DM side while streaming encounter A to your players. They will be so impressed with how prepared you are! (Way to go DM :D)</li>
                            </ol>
                            <hr/>
                        </details>
                        <details style={{ whiteSpace: "pre-wrap" }}>
                            <summary><strong>Encounter Title Buttons - left to right - top to bottom</strong></summary>
                            <ol>
                                <li>Title input</li>
                                <li>'Roll Init', Auto Roll Initative for all NPCs</li>
                                <li>Round and Turn Tracker</li>
                                <ul>
                                    <li>{'<< and >>'} to track turns, (when you are done with turn tracking go back to Round 0, Turn 0, to remove the blue outline</li>
                                </ul>
                                <li>Choose a default background or upload your own for the Dm and Player Views</li>
                                <ul>
                                    <li>This also includes gifs and youtube links that auto play and auto loop! (i.e. this 2 hour Red wood forest walk: https://www.youtube.com/watch?v=q9rQTB_Qr0A ) </li>
                                </ul>
                                <li>Manuel refresh button (only shows if imported players), refreshed DndBeyond stats for when you need them NOW (someone die?)</li>
                                <li>Built in Timer options - reset, pause/play</li>
                                ---------
                                <li>Hide/show all enemies (unless individually hidden)</li>
                                <li>Hide/Show specifically dead enemies (unless individually hidden)</li>
                                <li>Hide/Show icon blood overlay</li>
                                <ul>
                                    <i>Note: in the Player View, icons will get bloody when somone goes under 50% by default... your options are... </i>
                                    <li>None - No blood, No monster HP</li>
                                    <li>Bloodied - Yes blood, No monster HP</li>
                                    <li>Blood & HP - Yes blood, Yes monster HP</li>
                                </ul>
                            </ol>
                            <hr/>
                        </details>
                        <details style={{ whiteSpace: "pre-wrap" }}>
                            <summary><strong>Encounter Creature Rows</strong></summary>
                            <ol>
                                <li>Red, Grey, or Green highlight to show Ally, Neutral or Enemy at a glance</li>
                                <li>Initiative input (list resorts when initatives change)</li>
                                <li>Creature Avatar</li>
                                <ul>
                                    <li>Hover and click to upload a new image for this creature, this image will be saved in this menu for all creatures </li>
                                    <li>Click the image to select it for that creature</li>
                                </ul>
                                <li>Name, AC, Init bonus (All Editable here aswell as in the edit mode)</li>
                                <li>Individually Hide this Creature</li>
                                <li>Add conditions to their statblock and Player View Icon such as 'Hunters Mark', 'Bane' or 'Aid'</li>
                                <li>Change their row color (Dm View) and icon border color (Player View), 'team' (ally [green], neutral [grey], enemy [red]), Toggle Player and Pet on/off</li>
                                <ul>
                                    <li>Your team determines if the Player View hides this creature by default or not, Allies are shown, neutral and enemies hidden by default </li>
                                    <li>The only time HP is shown by default in Player View icons is for Players and Pets</li>
                                </ul>
                                <li>'x' to remove a creature from the encounter</li>
                                <li>Click the hp to edit</li>
                                <ul>
                                    <li>Temp HP</li>
                                    <li>Override Max HP</li>
                                    <li>Heal</li>
                                    <li>Damage</li>
                                </ul>
                                <li>Click an empty spot on the row to open this creatures stat block</li>
                            </ol>
                            <hr/>
                        </details>
                        <details style={{ whiteSpace: "pre-wrap" }}>
                            <summary><strong>Bottom Buttons</strong></summary>
                            <ol>
                                <li>Add Generic Player </li>
                                <li>Add Generic Dummy Monster </li>
                                <li>Add Global Token - this is to help track lair actions or environment actions, it acts as an enemy on the Player View </li>
                            </ol>
                        </details>
                    </ul>
                    <hr/>
                </details>
                <details style={{ whiteSpace: "pre-wrap" }}>
                    <summary><strong>Statblocks and Homebrew</strong></summary>
                    <hr/>
                    <p>Statblocks can be used as is or if your feeling frisky, click the edit button to mess around and create some homebrew!</p>
                    <ul>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        <summary><strong>StatBlock</strong></summary>
                        <ol>
                            <li>Statblocks have all the goods plus show conditions like 'Hunters Mark' when added</li>
                            <li>Actions and legendary action trackers appear when detected i.e. Legendary Resistance (3/Day)</li>
                            <li>Without going into edit mode, you can edit the Ability score and Ability Saves of a monster from here </li>
                            <li>'X' to close the statblock</li>
                        </ol>
                    </details>

                    <details style={{ whiteSpace: "pre-wrap" }}>
                        <summary><strong>Homebrew/Edit Mode</strong></summary>
                        <p>Click 'Edit' in the top right of a statblock to get into 'Edit Mode' </p>
                        <ol>
                            <li>'Edit Mode' allows you to change everything about a monster... go nuts</li>
                            <i>Note: I dont allow changing to the modifier since that is controlled by the overall score</i>
                            <li>Click the '+' to add the relative field</li>
                            <li>Hover over an actions and click '-' to remove it</li>
                            <li>When your done you have some options to how you want to save this beast...</li>
                            <ul>
                                <li>'Save to Hombrew' - saves to the homebrew tab for later.</li>
                                <li>'Overwrite Homebrew' - Overwrites the creature in the Homebrew Tab - (Only shows up after Saved to Homebrew)</li>
                                <li>'Save New Homebrew' - Saves a new creature to the Homebrew Tab - (Only shows up after Saved to Homebrew)</li>
                                <li>'Save Creature' - Goes back to the statblock, doesnt actually do any saving since I save the data when you click away from the input box</li>
                            </ul>
                        </ol>
                    </details>
                    </ul>
                    <hr/>
                </details>
                
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
                        <img className='iconDemo' src={iconDemo} alt={"help"}/>
                        <li>
                            Click Sparkle button to add buffs/debuffs to help tracking in combat
                        </li>
                        <img className='effectsDemo' src={effectsDemo} alt={"help"}/>
                    </ul>
                    <strong> Toggle buttons:</strong>
                    <hr/>
                    <ul>
                        <li>
                            Move portaits (top, bottom, middle), Toggle enemy blood splatter, Hide/Show all enemies, Hide Dead Enemies, Upload/Set Background, Timer (click), Restart Timer, Play/Pause Timer
                        </li>
                        <img className='toggleButton2Demo' src={toggleButton2} alt={"help"}/>
                    </ul>
                </ul>
            </ul>
        </div>
    );
}

export default HowTo;

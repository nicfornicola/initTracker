import '../../style/App.css';
import React from 'react';
import iconDemo from '../../../pics/demo/iconDemo.png'
import effectsDemo from '../../../pics/demo/effectsDemo.png'
import background13 from '../../pics/backgrounds/happyTavern.png'
import tabsHomebrew from '../../../pics/howto/tabsHomebrew.PNG'
import tabsImports from '../../../pics/howto/tabsImports.PNG'
import tabsSearch from '../../../pics/howto/tabsSearch.PNG'
import topMostButtons from '../../../pics/howto/topMostButtons.PNG'
import titleButtons1 from '../../../pics/howto/titleButtons1.PNG'
import titleButtons2 from '../../../pics/howto/titleButtons2.PNG'
import creatureRow1 from '../../../pics/howto/creatureRow1.PNG'
import creatureRow2 from '../../../pics/howto/creatureRow2.PNG'
import colorDemo from '../../../pics/howto/colorDemo.PNG'
import hpDemo from '../../../pics/howto/hpDemo.PNG'
import bottomButtons from '../../../pics/howto/bottomButtons.PNG'
import statblock from '../../../pics/howto/statblock.PNG'
import editMode from '../../../pics/howto/editMode.PNG'
import editModeButtons from '../../../pics/howto/editModeButtons.PNG'
import playerViewDemo from '../../../pics/demo/playerViewDemo.PNG'
 
function HowTo() {
    return (
        <div className='instructionsBackGround' style={{backgroundImage: `url(${background13})`}}>
            
            <ul className='instructions'>
                <strong>DM View </strong> 
                <i>(add me on discord if you have any questions or feedback: Staygo)</i>
                <hr/>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary><strong>Side Menu</strong></summary>
                    <ul>
                        <li>Click {'<< or >>'} to hide/show the side menu</li>
                        <li>Click the Magnifying Glass to hide/show the search columns for more room for your encounter</li>
                        <li>Sign in options</li>
                        <li>Help Page! (your lookin at it)</li>
                    </ul>
                    <hr/>
                </details>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary><strong>Search Tab</strong></summary>
                    <hr/>
                    <p>All monster data comes from open5e.com or if imported from DndBeyond</p>
                    <div className='demoFlex'>
                        <img src={tabsSearch} alt={'help'} style={{width: '30%'}}/>
                        <ul>
                            <li>Click creatures to view their stat blocks</li>
                            <li>Hover and click the '+' to add them to your encounter</li>
                            <li>If you are looking for a specific monster you can search for their name CR type or alignment</li>
                            <li>Monster are random by default and can be shuffled or sorted by clicking the buttons right of the search bar</li>
                        </ul>
                    </div>
                    
                    <hr/>
                </details>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary><strong>Homebrew Tab</strong></summary>
                    <hr/>
                    <p>Homebrew is part of what makes DmBuddy special! Its super easy and quick to make changes before hand or on the fly</p>
                    <div className='demoFlex'>
                        <img src={tabsHomebrew} alt={'help'} style={{width: '30%'}}/>
                        <ul>
                            <li>Any creature can be used as a template for homebrewing and will save here </li>
                            <li>From here you can delete it or add it by hitting the 'x' or '+' </li>
                            <li>Monsters can be added to homebrew by adding them to an encounter, opening their statblock and clicking edit. There you can click 'Save new Homebrew' or 'Overwrite to Homebrew' if its already saved. More on that in the edit mode section</li>
                        </ul>
                    </div>
                    <hr/>
                </details>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary><strong>DndBeyond Imports Tab</strong></summary>
                    <hr/>
                    <p>If your players use DndBeyond, great! Import them here and show their avatars in the Streamed 'Player View'</p>
                    <div className='demoFlex'>
                        <img src={tabsImports} alt={'help'} style={{width: '30%'}}/>
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
                    </div>
                    <hr/>
                </details>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary><strong>Encounter Column</strong></summary>
                    <hr/>
                    <p>This is your current encounter, handle all of your stat tracking here, while also streaming the Player View for mega immersion! <i>(Since there is alot going on here, this will be broken up into smaller bits)</i></p>
                    Left to right - top to bottom
                    <ul>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            <summary><strong>Top Most Buttons</strong></summary>
                            <div className='demoFlex'>
                                <img src={topMostButtons} alt={'help'} style={{width: '30%'}}/>
                                <ol>
                                    <li>'Encounters:' - All your saved Encounters</li>
                                    <li>'New Encounter button' - to make a New Encounter</li>
                                    <li>'Streaming' - How you control what encounter your players see on the 'Player View'!</li>
                                    <ul>
                                        <li> Click one of your encounters to start Streaming a 'Player View', click another one to switch the 'Player View' to that encounter</li>
                                        <li> '+' and '-' buttons to change the size of the 'Player Views' icons</li>
                                        <li> 'Open Player View' to open up a new tab to show on a 2nd monitor OR send that link to your players!</li>
                                         <i>Note: Don't worry, they wont see anything you dont want them to! Monsters are hidden by default until you choose. (more about this in the 'Player View' section)</i>
                                        <li> 'Stop Streaming'... stops streaming... yeah</li>
                                    </ul>
                                    <i>Note: The Dm View selected encounter and the 'Player View' encounter can be different. This means you can open and make last minute changes to encounter B on the DM side while streaming encounter A to your players. They will be so impressed with how prepared you are! (Way to go DM :D)</i>
                                </ol>
                            </div>
                            <hr/>
                        </details>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            <summary><strong>Encounter Title Buttons</strong></summary>
                            <table className='howToTable'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>     
                                        <td>                           
                                            <img src={titleButtons1} alt={'help'} />
                                        </td>
                                        <td>
                                            <ul>
                                                <li>Title input</li>
                                                <li>'Roll Init', Auto Roll Initative for all NPCs</li>
                                                <li>Choose a built-in background or upload your own for the Dm and Player Views</li>
                                                <ul>
                                                    <li>This also includes gifs and youtube links that auto play and auto loop! (i.e. this 2 hour Red wood forest walk: https://www.youtube.com/watch?v=q9rQTB_Qr0A ) </li>
                                                </ul>
                                                <li>Manuel refresh button - (only shows if imported players), refreshes DndBeyond stats for when you need them NOW (someone die?)</li>
                                                <li>Built in Timer options - reset, pause/play</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> 
                                            <img src={titleButtons2} alt={'help'}/>
                                        </td>
                                        <td>
                                            <ul>
                                                <li>'R: 0 - T: 0' - Round and Turn Tracker</li>
                                                <ul>
                                                    <li>{'<< and >>'} highlighted in blue to track turns, go back to Round 0 - Turn 0, to remove the blue highlight</li>
                                                </ul>
                                                ---------<br/>
                                                The remaining buttons only effect the 'Player View'
                                                <li>Hide/show all enemies (unless individually hidden)</li>
                                                <li>Hide/Show specifically dead enemies (unless individually hidden)</li>
                                                <li>Hide/Show icon blood overlay</li>
                                                <ul>
                                                    <i>Note: in the Player View, icons will get bloody when somone goes under 50% by default... your options are... </i>
                                                    <li>'None' - No blood, No monster HP</li>
                                                    <li>'Bloodied' - Yes blood, No monster HP</li>
                                                    <li>'Blood & HP' - Yes blood, Yes monster HP</li>
                                                </ul>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </details>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            <summary><strong>Encounter Creature Rows</strong></summary>
                            <table className='howToTable'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td> 
                                            <img src={creatureRow1} alt={'help'} />
                                        </td>
                                        <td>
                                            <ol>
                                                <li>Red, Grey, or Green highlight to show Ally, Neutral or Enemy at a glance</li>
                                                <li>Initiative input (list resorts when initatives change)</li>
                                                <li>Creature Avatar</li>
                                                <ul>
                                                    <li>Hover and click to upload a new image for this creature, (this image will be saved in this menu for all creatures)</li>
                                                    <li>Click the image to select it for that creature</li>
                                                </ul>
                                                <li>Name, AC, Initiative bonus (All can be edited here aswell as in the 'Edit Mode')</li>
                                            </ol>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> 
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(50px, 1fr))'}}>
                                                <img className='effectsDemo' src={creatureRow2} alt={'help'} style={{border: '5px solid white', padding: '5px'}} />
                                                <div>2.<img className='effectsDemo' src={colorDemo} alt={'help'} style={{width: '100%'}}/></div>
                                                <div>3.<img className='effectsDemo' src={effectsDemo} alt={'help'} style={{width: '100%'}}/></div>
                                                <div>4.<img className='effectsDemo' src={hpDemo} alt={'help'} /></div>
                                            </div>
                                        </td>
                                        <td>
                                            <ol>
                                                <li>'Eye ball' - Individually Hide this Creature</li>
                                                <li>'Flag' - Change their row color (Dm View) and icon border color (Player View), 'team' (ally [green], neutral [grey], enemy [red]), Toggle Player and Pet on/off</li>
                                                <ul>
                                                    <li>Your team determines if the Player View hides this creature by default or not, Allies are shown, neutral and enemies hidden by default </li>
                                                    <li>The only time HP is shown by default in Player View icons is for Players and Pets</li>
                                                </ul>
                                                <li>'Sparkles' - Add conditions to their statblock and Player View Icon such as 'Hunters Mark', 'Bane' or 'Aid'</li>
                                                <li>HP changes color based off current HP - click to edit</li>
                                                <ul>
                                                    <li>Temp HP (blue)</li>
                                                    <li>Override Max HP</li>
                                                    <li>Heal</li>
                                                    <li>Damage</li>
                                                </ul>
                                                <li>'x' to remove a creature from the encounter</li>
                                                <li>Click an empty spot on the row to open this creatures stat block</li>
                                            </ol>
                                        </td>
                                    </tr>
                                </tbody>                               
                            </table>
                        </details>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            <summary><strong>Bottom Buttons</strong></summary>
                            <div className='demoFlex'>
                                <img src={bottomButtons} alt={'help'} style={{width: '40%'}}/>
                                <ol>
                                    <li>Add Generic Player </li>
                                    <li>Add Generic Dummy Monster </li>
                                    <li>Add Global Token - this is to help track lair actions or environment actions, it acts as an enemy on the Player View </li>
                                    Note: Use these when your players meet/fight someone unexpected! Change the images and names for the 'Player View' and they will be so impressed!
                                </ol>
                            </div>
                        </details>
                    </ul>
                </details>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary><strong>Statblocks and Homebrew</strong></summary>
                    <hr/>
                    <p>Statblocks can be used as is or if your feeling frisky, click the Edit Button to mess around and create some homebrew!</p>
                    <ul>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        <summary><strong>StatBlock</strong></summary>
                        <div className='demoFlex'>
                        <img src={statblock} alt={'help'} style={{width: '40%'}}/>

                        <ol>
                            <li>Statblocks have all the goods, plus it will show conditions like 'Hunters Mark' when added</li>
                            <li>Actions and legendary action trackers appear when detected i.e. Legendary Resistance (3/Day)</li>
                            <li>Without going into edit mode, you can edit the Ability score and Ability Saves of a monster from here </li>
                            <li>'X' to close the statblock</li>
                            <p>Click 'Edit' in the top right of a statblock to get into 'Edit Mode' </p>
                        </ol>
                        </div>
                        <hr/>
                    </details>

                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        <summary><strong>Homebrew/Edit Mode</strong></summary>
                        <p>Click 'Edit' in the top right of a statblock to get into 'Edit Mode' </p>
                        <div className='demoFlex'>
                            <div>
                                <img src={editMode} alt={'help'} style={{width: '100%'}}/>
                                <p>After 'Saving to Homebrew'</p>
                                <img src={editModeButtons} alt={'help'} style={{width: '100%'}}/>
                            </div>
                            <ol>
                                <li>'Edit Mode' allows you to change everything about a monster... go nuts</li>
                                <i>Note: I dont allow changing to the modifier since that is controlled by the overall score</i>
                                <li>Click the '+' to add another trait/actions/etc</li>
                                <li>Hover over an actions title and click '-' to remove it</li>
                                <li>When your done you have some options to how you want to save this beast...</li>
                                <ul>
                                    <li><b>'Save to Hombrew'</b> - Saves the current creature and adds it to the 'Homebrew Tab' for later.</li>
                                    <li><b>'Overwrite Homebrew'</b> - Saves the current creature and Overwrites the creature in the Homebrew Tab - (Only shows up after 'Saved to Homebrew')</li>
                                    <li><b>'Save New Homebrew'</b> - Saves the current creature and adds a new creature to the Homebrew Tab - (Only shows up after 'Saved to Homebrew')</li>
                                    <li><b>'Save Creature'</b> - Goes back to the statblock</li>
                                </ul>
                            </ol>
                        </div>
                    </details>
                    </ul>
                    <hr/>
                </details>
                
            </ul>
            <ul className='instructions'>
                <strong>Player View</strong>
                <hr/>
       
                        <img className='iconDemo' src={playerViewDemo} alt={'help'} style={{border: '1px solid white'}}/>

                        <li>
                            Names, Portraits, Initiative, HP, Exhaustion Lvl, Death Saves all live from Dm Buddy and DND beyond!
                        </li>
                        <li>
                            Live stat updates with Dynamic coloring and blood spatters based on current HP, Skull Overlay for dead creatures
                        </li>
                            <img className='iconDemo' src={iconDemo} alt={'help'} style={{border: '1px solid white'}}/>
                        <li>
                            Karion has 2 points of exhaustion and has the 'Confused' condition, his hp is 35/77 and his initiative was 22
                        </li>
                        <li>
                            Archer is dead
                        </li>
                        <li>
                            Druid has the 'Hunters Mark' condition
                        </li>
                        <li>
                            Esmond is dead 0/92, had 4 points of exhaustion with 1 death save and 3 death fails, his initative was 2
                        </li>
            </ul>
        </div>
    );
}

export default HowTo;

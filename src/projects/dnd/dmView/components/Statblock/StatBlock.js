import '../../../dmView/style/App.css';
import React, { useEffect, useState } from 'react';
import { levelData, effectImgMap, sizeOptions, typeOptions, alignmentOptions, raceOptions, isProd } from '../../constants';
import SkillGrid from '../SkillGrid';
import StatblockDropdown from './StatblockDropdown';
import EditStat from './EditStat';
import EditStatBig from './EditStatBig';
import GridWrap from './GridWrap';

function getSpells(spellString) {
    let formattedSections = ""
    if(spellString.includes('*')) {
        // Split the text on asterisks and trim any whitespace
        const sections = spellString.split('*').map(section => section.trim());
        
        // Create an array of JSX elements
        formattedSections = sections.map((section, index) => {
            if (index === 0) return null; // Skip the first element as it is before the first asterisk
            
            // Split the section into the name and description
            const [name, description] = section.split(':').map(part => part.trim());
                return (
                    <li key={index + name}>
                        <strong>{name}: </strong> {description}
                    </li>
                );
        });

        return (
            <>
                {sections[0]} 
                <ul>
                    {formattedSections}
                </ul>
            </>
        )

    } else {    // Regular expression to handle introduction text and spell levels with and without colons
        const introductionPattern = /^(.+?)(?=Cantrips \(at will\)|\d{1,2}(?:st|nd|rd|th)?-level)/s;
        const spellPattern = /(\d{1,2}(?:st|nd|rd|th)?)-level \((\d+) slot(?:s)?\):?\s*([\s\S]+?)(?=(?:\d{1,2}(?:st|nd|rd|th)?)-level \(\d+ slot(?:s)?\):?|$)/g;
        const cantripsPattern = /Cantrips \(at will\):\s*([\s\S]+?)(?=(?:\d{1,2}(?:st|nd|rd|th)?)-level \(\d+ slot(?:s)?\):?|$)/;
    
        const spells = [];
        let introduction = '';
    
        // Extract introduction text
        const introMatch = introductionPattern.exec(spellString);
        if (introMatch) {
            introduction = introMatch[1].trim();
        }
    
        // Handle Cantrips separately
        const cantripsMatch = cantripsPattern.exec(spellString);
        if (cantripsMatch) {
            const cantripNames = cantripsMatch[1].split(/\s{2,}/).map(spell => spell.trim()).filter(spell => spell);
            spells.push({
                level: 'Cantrips (at will)',
                spellNames: cantripNames
            });
        }
    
        // Handle other spell levels
        let match;
        while ((match = spellPattern.exec(spellString)) !== null) {
            const level = `${match[1]}-level (${match[2]} slot${match[2] > 1 ? 's' : ''})`;
            const spellNames = match[3].split(/\s{2,}/).map(spell => spell.trim()).filter(spell => spell);
            spells.push({
                level,
                spellNames
            });
        }
    
        // Create JSX elements
        const formattedSections = spells.map((spell, index) => (
            <li key={index + spell.level}>
                <strong>{spell.level}:</strong> {spell.spellNames.join(', ')}
            </li>
        ));
    
        return (
            <>
                {introduction}
                <ul>
                    {formattedSections}
                </ul>
            </>
        );
    }
}

function renderActions(actionsString) {
    // If its a string its coming from the database so convert it to a json array
    if (typeof actionsString === "string") {
        // Replace outer curly braces with square brackets since its coming from postgres where {} = []
        const formattedString = actionsString.replace(/^{/, '[').replace(/}$/, ']');
        return JSON.parse(formattedString).map(item => JSON.parse(item));
    } else {
        // Its alrady a json array so we chillin
        return actionsString
    }
}

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

function capsFirstLetter(word) {
    if (!word)
        return ''; // Handle empty or undefined input
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function addSign(modNumber) {
    if (modNumber == null)
        return '+0'

    if (modNumber >= 0) {
        return `+${modNumber}`;
    }

    return `${modNumber}`; // Negative number already has a minus sign
}

const CreautureInfo = ({creature}) => {
    let string = ``

    if(creature.size) {
        string += `${creature.size}`
    }

    if(creature.creature_type) {
        string += ` ${creature.creature_type}`
    }
    
    if(creature.subtype) {
        string += ` (${creature.subtype})`
    }

    if(creature.group && creature.group !== "null") {
        string += ` (${creature.group})`
    } 
    
    if(creature.creature_alignment) {
        string += ` (${creature.creature_alignment})`
    }

    return <p><i>{string}</i></p>
}

const StatBlock = ({encounterSelectedCreature, img, closeStatBlock}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [creature, setCreature] = useState({...encounterSelectedCreature})

    useEffect(() => {
        setCreature({...encounterSelectedCreature})
    }, [encounterSelectedCreature]);

    if(creature.dnd_b_player_id) {
        return null;
    }

    const fullEditStatBlock = () => {
        setIsEditMode(!isEditMode)
    }

    return (
        <div className='statBlock'>
            <div className='infoContainer'>
                <div className='statblockOptionsFlex'>
                    <button className='statblockEdit' onClick={fullEditStatBlock}>{isEditMode ? <>Save</> : <>Edit</>} </button>
                    <button className='statblockX' onClick={closeStatBlock}>❌</button>
                </div>

                {isEditMode ? (
                    <div className='statBlockScroll' style={{
                        overflowX: 'hidden',
                        overflowY: 'auto'
                    }}>
                        <div className='topInfo shadowBox' style={{padding: '10px'}}>
                            {/* Edit creature image could be here too */}
                            <GridWrap>
                                <EditStat label={`Name ${!isProd ? creature.creatureGuid : ''}`} content={creature.name}/>
                                <StatblockDropdown label={"Size"} options={sizeOptions} content={creature?.size}/>
                                <StatblockDropdown label={"Type"} options={typeOptions} content={creature?.creature_type}/>
                                <StatblockDropdown label={"Race"} options={raceOptions} content={creature?.subtype}/> 
                                <StatblockDropdown label={"Alignment"} options={alignmentOptions} content={creature?.creature_alignment}/>
                                <div style={{display: 'flex'}}>
                                    <EditStat label={"CR"} type='number' content={creature?.challenge_rating}/>
                                </div>
                            </GridWrap>
                            <hr className="editlineSeperator" />

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <GridWrap >
                                    <EditStat label={"Max Hp"} type='number' content={creature?.hit_points}/>
                                    <EditStat label={"Armor Class"} type='number' content={creature?.armor_class}/>
                                    <EditStat label={"Init Bonus"} type='number' content={creature?.challenge_rating}/>
                                </GridWrap>
                                <span style={{border: '1px solid grey'}}/>
                                <GridWrap columns={6}>
                                    <EditStat label={"Walk"} type='number' content={creature?.speed?.walk}/>
                                    <EditStat label={"Climb"} type='number' content={creature?.speed?.climb}/>
                                    <EditStat label={"Burrow"} type='number' content={creature?.speed?.burrow}/>
                                    <EditStat label={"Swim"} type='number' content={creature?.speed?.swim}/>
                                    <EditStat label={"Fly"} type='number' content={creature?.speed?.fly}/>
                                    <EditStat label={"Hover"} type='checkbox' content={creature?.speed}/>
                                </GridWrap>
                            </div>
                            <hr className="editlineSeperator" />

                            <SkillGrid creature={creature} edit={true}/>
                        </div>
                        <hr className="editlineSeperator" />
                        <EditStatBig label={"Traits"} content={renderActions(creature?.special_abilities)}/>
                        <hr className="editlineSeperator" />

                        <EditStatBig label={"Actions"} content={renderActions(creature?.actions)}/>
                        <EditStatBig label={"Bonus Actions"} content={renderActions(creature?.bonus_actions)}/>
                        <EditStatBig label={"Reactions"} content={renderActions(creature?.reactions)}/>
                        <hr className="editlineSeperator" />

                        <EditStatBig label={"Legendary Actions"} content={renderActions(creature?.legendary_actions)}/>
                        <EditStatBig label={"Lair Actions"} content={null}/>
                        <hr className="editlineSeperator" />

                        <GridWrap >
                            <EditStat label={"Vulnerabilites"} content={creature?.damage_vulnerabilities}/>
                            <EditStat label={"Resistances"} content={creature?.damage_resistances}/>
                            <EditStat label={"Immunities"} content={creature?.damage_immunities}/>
                            <EditStat label={"Condition Immunities"} content={creature?.condition_immunities}/>
                            <EditStat label={"Senses"} content={capsFirstLetter(creature?.senses)}/>
                            <EditStat label={"Languages"} content={creature?.damage_vulnerabilities}/>
                            <EditStat label={"Environments"} content={creature?.environments}/>
                        </GridWrap>
                        <hr className="lineSeperator" />
                    </div>
                ) : (
                    <>
                        <div className='topInfo shadowBox'>
                            <h1 className='creatureName titleFontFamily'>{creature.name}</h1>
                            {creature.effects.length > 0 &&
                                <div style={{backgroundColor: "black", width: 'fit-content', borderRadius: 5}}>
                                    {creature.effects.map((effect) => (
                                        <img alt='effect' className='effect' src={effectImgMap[effect]}/>
                                    ))}
                                </div>
                            }
                            <img className="img" src={img} alt={"Creature Img"}/>

                            <div className='creatureType'>
                                <hr className="lineSeperator" />
                                <p className='source'>{creature.document__title}</p>
                                <CreautureInfo creature={creature}/>
                            </div>
                            <div className='stickyStatGrid textShadow' >
                                <p className="stickyStatItem"><strong>AC</strong>&nbsp;{creature.armor_class} 
                                    {creature.armor_desc && creature.armor_desc !== "()" && 
                                        <span className='extraInfo'> &nbsp; {creature.armor_desc} </span>
                                    } 
                                </p>
                                <p className="stickyStatItem"><strong>Initiative</strong>&nbsp;{addSign(creature.dexterity_save)} <span className='extraInfo'>&nbsp;({creature.dexterity_save+10})</span></p>
                                <p className="stickyStatItem stickyStatExtraWide">
                                    <strong>HP</strong>&nbsp;{creature.hit_points_current}/{creature.hit_points} 
                                    {creature.hit_points_temp !== 0 && (
                                        <span className='tempHp'>&nbsp;(+{creature.hit_points_temp}) </span>
                                    )}
                                    {creature.hit_dice && (
                                        <span className='extraInfo'>&nbsp;({creature.hit_dice})</span>
                                    )}
                                    
                                </p>
                                <p className="stickyStatItem"></p>
                                <p className="stickyStatItem stickyStatExtraWide">
                                    <strong>Speed</strong>&nbsp;
                                    
                                    {creature.speed && Object.entries(creature.speed).map(([key, value], index, array) => (
                                        <span key={index + key}>
                                            {capsFirstLetter(key)}{key !== "hover" && <> {value}</>}{index < array.length - 1 ? ',' : ''}&nbsp;
                                        </span>
                                    ))}
                                </p>
                                <p className="stickyStatItem"></p>
                            </div>
                            <SkillGrid creature={creature}/>
                        </div>
                            
                        <div className="statBlockScroll">
                            {creature.skills.length !== 0 && (
                                <p>
                                    <strong>Skills </strong>
                                    <span >{creature.skills}</span>
                                </p>
                            )}
                            {creature.damage_vulnerabilities && (
                                <p><strong>Vulnerabilities</strong> {creature.damage_vulnerabilities}</p>
                            )}
                            {creature.damage_resistances && 
                                <p><strong>Resistances</strong> {creature.damage_resistances}</p>
                            }
                            {creature.damage_immunities && (
                                <p><strong>Immunities</strong> {creature.damage_immunities}</p>
                            )}
                            {creature.condition_immunities && (
                                <p><strong>Condition Immunities</strong> {creature.condition_immunities}</p>
                            )}
                            {creature.senses && (
                                <p><strong>Senses</strong> {capsFirstLetter(creature.senses)}</p>                        
                            )}

                            {creature.languages && (
                                <p><strong>Languages</strong> {creature.languages}</p>
                            )}
                            {creature.challenge_rating &&
                                <p>
                                    <strong>CR </strong>{creature.challenge_rating}
                                    <i>({levelData[creature.challenge_rating]['xp']} XP)</i> 
                                </p>
                            }
                            
                            
                            {creature.from === "dnd_b" && !creature.isReleased &&
                                <div style={{border: '1px solid red', wordWrap: 'break-word'}}><strong>Alert!</strong> This creature comes from a paid source on DndB so only minimal data is available :( <a href={creature.link}>{creature.link}</a></div>
                            }
                            {creature.special_abilities && 
                                <>
                                    <h1 className='infoTitle'>TRAITS</h1>
                                    <hr className="lineSeperator" />
                                    {creature.from === "dnd_b" ? (
                                        <>
                                            {creature.special_abilities &&
                                                <div className='actionInfo' dangerouslySetInnerHTML={{ __html: creature.special_abilities }} />
                                            }
                                        </>
                                    ) : (
                                        renderActions(creature.special_abilities).map((ability, index) => (
                                            <div className='actionInfo' key={index+ability.name}>
                                                <strong>{ability.name}: </strong>
                                                {ability.name === "Spellcasting" ? (
                                                    <>
                                                        {getSpells(getDesc(ability))}
                                                    </>
                                                ) : (
                                                    <>
                                                        {getDesc(ability)}
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </>
                            }
                            

                            {creature.actions && 
                                <>
                                    <h1 className='infoTitle'>ACTIONS</h1>
                                    <hr className="lineSeperator" />

                                    {creature.from === "dnd_b" ? (
                                        <>
                                            {creature.actions &&
                                                <div className='actionInfo' dangerouslySetInnerHTML={{ __html: creature.actions }} />
                                            }
                                        </>
                                    ) : (
                                        renderActions(creature.actions).map((action, index) => (
                                            <div className='actionInfo' key={index+action.name}>
                                                <strong>{action.name}:</strong> {getDesc(action)}
                                            </div>
                                        ))
                                    )}
                                </>
                            }
                            

                            {creature.bonus_actions && creature.bonus_actions.length !== 0 && (
                                <>
                                    <h1 className='infoTitle'>BONUS ACTIONS</h1>
                                    <hr className="lineSeperator" />
                                    {renderActions(creature.bonus_actions).map((action, index) => (
                                        <div className='actionInfo' key={index+action.name}>
                                            <strong>{action.name}:</strong> {getDesc(action)}
                                        </div>
                                    ))}
                                </>
                            )}

                            {creature.reactions && creature.reactions.length !== 0 && (
                                <>
                                    <h1 className='infoTitle'>REACTIONS</h1>
                                    <hr className="lineSeperator" />
                                    {renderActions(creature.reactions).map((reaction, index) => (
                                        <div className='actionInfo' key={index+reaction.name}>
                                            <strong>{reaction.name}:</strong> {getDesc(reaction)}
                                        </div>
                                    ))}
                                </>
                            )}

                            {creature.legendary_actions && 
                                <>
                                    <h1 className='infoTitle'>LEGENDARY ACTIONS</h1>
                                    <hr className="lineSeperator" />
                                    {creature.from === "dnd_b" ? (
                                        <>
                                            {creature.actions &&
                                                <div className='actionInfo' dangerouslySetInnerHTML={{ __html: creature.legendary_actions }} />
                                            }
                                        </>
                                    ) : (
                                        creature.legendary_actions.length !== 0 && (
                                            <>
                                                
                                                <div className='actionInfo'>{creature.legendary_desc}</div>
                                                {renderActions(creature.legendary_actions).map((legAction, index) => (
                                                    <div className='actionInfo' key={index+legAction.name}>
                                                        <strong>{legAction.name}:</strong> {getDesc(legAction)}
                                                    </div>
                                                ))}
                                            </>
                                        )
                                    )}
                                </>
                            }
                            
                            {creature.environments && (
                                <div className='extraInfo'>
                                    <hr className="lineSeperator" />
                                    <strong>Environments: </strong>
                                    <span> {creature.environments}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
                
                
                <hr className="lineSeperator" />
                {creature.from === 'dnd_b' && 
                    <a href={creature.link}>DndB StatBlock</a>
                }
            </div>
        </div>
    );
}

export default StatBlock;

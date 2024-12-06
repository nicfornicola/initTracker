import '../../../dmView/style/App.css';
import React from 'react';
import { getLevelData, effectImgMap} from '../../constants';
import SkillGrid from '../SkillGrid';
import ContentArray from './ContentArray';
import ContentString from './ContentString';
import { ThreeDots } from 'react-loader-spinner';


function formatSpeed(speed) {
    const order = ['walk', 'climb', 'burrow', 'swim', 'fly', 'hover'];
    
    const entries = order
        .filter(key => speed[key] && (key !== 'hover' || speed[key]))  // Include only truthy values
        .map(key => [key, speed[key]]);
    
    const result = entries
        .map(([key, value], i, arr) => `${capsFirstLetter(key)}${key !== 'hover' ? ` ${value}` : ''}${i < arr.length - 1 ? ', ' : ''}`)
        .join('');
    
    return result;
}

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

const CreatureInfo = ({creature}) => {
    let string = ``

    if(creature.size && creature.size !== '--') {
        string += `${creature.size}`
    }

    if(creature.creature_type && creature.creature_type !== '--') {
        string += ` ${creature.creature_type}`
    }
    
    if(creature.subtype && creature.subtype !== '--') {
        string += ` (${creature.subtype})`
    }

    if(creature.group && creature.group !== "null" && creature.group !== '--') {
        string += ` (${creature.group})`
    } 
    
    if(creature.creature_alignment && creature.creature_alignment !== '--') {
        string += ` (${creature.creature_alignment})`
    }

    return <p><i>{string}</i></p>
}

const BaseStatBlock = ({creature, closeStatBlock, loading}) => {
    console.log("basestatblock", creature)
    return (
        <div className='statBlock'>
            <div className='infoContainer'>
                {loading ? (
                    <div className='statBlockSpinner'>
                        <ThreeDots
                            visible={true}
                            height="50"
                            width="50"
                            color="grey"
                            radius="1"
                            ariaLabel="three-dots-loading"
                        /> 
                    </div>
                ) : (
                    <>
                        <div className='statblockOptionsFlex'>
                            <button className='statblockX' onClick={closeStatBlock}>❌</button>
                        </div>
                        <div className='topInfo shadowBox'>
                            <h1 className='creatureName titleFontFamily'>{creature.name}</h1>
                            {creature.effects.length > 0 &&
                                <div style={{backgroundColor: "black", width: 'fit-content', borderRadius: 5}}>
                                    {creature.effects.map((effect) => (
                                        <img alt='effect' className='effect' src={effectImgMap[effect]}/>
                                    ))}
                                </div>
                            }
                            <img className="img" src={creature.avatarUrl} alt={"Creature Img"}/>

                            <div className='creatureType'>
                                <hr className="lineSeperator" />
                                <p className='source'>{creature.document__title}</p>
                                <CreatureInfo creature={creature}/>
                            </div>
                            <div className='stickyStatGrid textShadow' >
                                <p className="stickyStatItem"><strong>AC</strong>&nbsp;{creature.armor_class} 
                                    {creature.armor_desc && creature.armor_desc !== "()" && 
                                        <span className='extraInfo'> &nbsp; {creature.armor_desc} </span>
                                    } 
                                </p>
                                <p className="stickyStatItem"><strong>Initiative</strong>&nbsp;{addSign(creature.dexterity_save)} 
                                    <span className='extraInfo'>&nbsp;({parseInt(creature.dexterity_save)+10})</span>
                                </p>
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
                                    {formatSpeed(creature.speed)}
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

                            <ContentString label={'Vulnerabilities'} contentString={creature.damage_vulnerabilities} />
                            <ContentString label={'Resistances'} contentString={creature.damage_resistances} />
                            <ContentString label={'Immunities'} contentString={creature.damage_immunities} />
                            <ContentString label={'Condition Immunities'} contentString={creature.condition_immunities} />
                            <ContentString label={'Senses'} contentString={creature.senses} />
                            <ContentString label={'Languages'} contentString={creature.languages} />
                            <ContentString label={'CR'} contentString={creature.challenge_rating} italics={`(${getLevelData(creature.challenge_rating)} XP)`}/>
                            
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
                                        creature.special_abilities.map((ability, index) => {
                                            // Skip rendering if name is "None" and desc is "--"
                                            if (ability.name === "None" && ability.desc === "--") {
                                                return null;
                                            }
                                    
                                            return (
                                                <div className='actionInfo' key={index + ability.name}>
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
                                            );
                                        })
                                    )}
                                </>
                            }
                            

                            {creature.actions && 
                                <>
                                    {creature.from === "dnd_b" ? (
                                        <>
                                            <h1 className='infoTitle'>ACTIONS</h1>
                                            <hr className="lineSeperator" />
                                            {creature.actions &&
                                                <div className='actionInfo' dangerouslySetInnerHTML={{ __html: creature.actions }} />
                                            }
                                        </>
                                    ) : (
                                        <ContentArray label={'ACTIONS'} contentArray={creature.actions}/>

                                    )}
                                </>
                            }
                            
                            <ContentArray label={'BONUS ACTIONS'} contentArray={creature.bonus_actions}/>
                            <ContentArray label={'REACTIONS'} contentArray={creature.reactions}/>
                            
                            {creature.legendary_actions && 
                                <>
                                    
                                    {creature.from === "dnd_b" ? (
                                        <>
                                            <h1 className='infoTitle'>LEGENDARY ACTIONS</h1>
                                            <hr className="lineSeperator" />
                                            {creature.actions &&
                                                <div className='actionInfo' dangerouslySetInnerHTML={{ __html: creature.legendary_actions }} />
                                            }
                                        </>
                                    ) : (
                                        <ContentArray label={'LEGENDARY ACTIONS'} contentArray={creature.legendary_actions} labelDesc={creature.legendary_desc} actions_count={creature.legendary_actions_count}/>
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
                        
                        
                        <hr className="lineSeperator" />
                        {creature.from === 'dnd_b' && 
                            <a href={creature.link}>DndB StatBlock</a>
                        }

                    </>
                )}
            </div>
        </div>
    );
}

export default BaseStatBlock;

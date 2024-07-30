import '../style/App.css';
import React from 'react';
import { levelXPData } from '../constants';
import SkillGrid from './SkillGrid';

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

const StatBlock = ({creature, img, closeFunction }) => {
    console.log(creature)
    return (
        <div className='statBlock'>
            <div className='infoContainer'>
                <button className='statblockX' onClick={closeFunction}>❌</button>
                <div className="topCard">
                    <div className='topInfo shadowBox'>
                        <img className="img" src={img} alt={"Search Img"}/>

                        <h1 className='creatureName titleFontFamily'>{creature.name}</h1>
                        <div className='creatureType'>
                            <hr className="lineSeperator" />
                            <p className='source'>{creature.document__title}</p>
                            <p><i>{creature.size} {creature.type},  {creature.subtype && <> ({creature.subtype}), </>} {creature.group && <> ({creature.group}), </>} {creature.alignment}</i></p>
                        </div>
                        <div className='stickyStatGrid textShadow' >
                            <p className="stickyStatItem"><strong>AC</strong>&nbsp;{creature.armor_class} {creature.armor_desc && <span className='extraInfo'>&nbsp;({creature.armor_desc}) </span>} </p>
                            <p className="stickyStatItem"><strong>Initiative</strong>&nbsp;{addSign(creature.dexterity_save)} <span className='extraInfo'>&nbsp;({creature.dexterity_save+10})</span></p>
                            <p className="stickyStatItem"><strong>HP</strong>&nbsp;{creature.hit_points}/{creature.hit_points} <span className='extraInfo'>&nbsp;({creature.hit_dice})</span></p>
                            <p className="stickyStatItem"></p>
                            <p className="stickyStatItem">
                                <strong>Speed</strong>&nbsp;
                                {Object.entries(creature.speed).map(([key, value], index, array) => (
                                    <span key={index + key}>
                                        {capsFirstLetter(key)} {value}{index < array.length - 1 ? ',' : ''}&nbsp;
                                    </span>
                                ))}
                            </p>
                            <p className="stickyStatItem"></p>
                        </div>
                        <SkillGrid creature={creature}/>
                    </div>
                </div>
                    
                <div className="statBlockScroll">
                    {creature.skills && Object.keys(creature.skills).length !== 0 && (
                        <p>
                            <strong>Skills </strong>
                            {Object.entries(creature.skills).map(([key, value], index) => (
                                <span key={index+key}>{capsFirstLetter(key)} {addSign(value)}, </span>
                            ))}
                        </p>
                    )}
                    {creature.damage_vulnerabilities && (
                        <p><strong>Vulnerabilities</strong> {creature.damage_vulnerabilities}</p>
                    )}
                    {creature.damage_resistances && (
                        <p><strong>Resistances</strong> {creature.damage_resistances}</p>
                    )}
                    {creature.damage_immunities && (
                        <p><strong>Immunities</strong> {creature.damage_immunities}</p>
                    )}
                    {creature.condition_immunities && (
                        <p><strong>Condition Immunities</strong> {creature.condition_immunities}</p>
                    )}
                    <p><strong>Senses</strong> {capsFirstLetter(creature.senses)}</p>
                    <p><strong>Languages</strong> {creature.languages}</p>
                    <p><strong>CR </strong>{creature.cr} <i>({levelXPData[creature.challenge_rating]} XP)</i></p>


                    <h1 className='infoTitle'>TRAITS</h1>
                    <hr className="lineSeperator" />
                    {creature.special_abilities?.map((ability, index) => (
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
                    ))}

                    <h1 className='infoTitle'>ACTIONS</h1>
                    <hr className="lineSeperator" />
                    {creature.actions?.map((action, index) => (
                        <div className='actionInfo' key={index+action.name}>
                            <strong>{action.name}:</strong> {getDesc(action)}
                        </div>
                    ))}

                    {creature.bonus_actions && creature.bonus_actions.length !== 0 && (
                        <>
                            <h1 className='infoTitle'>BONUS ACTIONS</h1>
                            <hr className="lineSeperator" />
                            {creature.bonus_actions.map((action, index) => (
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
                            {creature.reactions.map((reaction, index) => (
                                <div className='actionInfo' key={index+reaction.name}>
                                    <strong>{reaction.name}:</strong> {getDesc(reaction)}
                                </div>
                            ))}
                        </>
                    )}

                    {creature.legendary_actions && creature.legendary_actions.length !== 0 && (
                        <>
                            <h1 className='infoTitle'>LEGENDARY ACTIONS</h1>
                            <hr className="lineSeperator" />
                            <div className='actionInfo'>{creature.legendary_desc}</div>
                            {creature.legendary_actions.map((legAction, index) => (
                                <div className='actionInfo' key={index+legAction.name}>
                                    <strong>{legAction.name}:</strong> {getDesc(legAction)}
                                </div>
                            ))}
                        </>
                    )}

                    {creature.environments && creature.environments.length !== 0 && (
                        <div className='extraInfo'>
                            <hr className="lineSeperator" />
                            <strong>Environments: </strong>
                            {creature.environments.map((value) => (
                                <span key={value}>{value}, </span>
                            ))}
                        </div>
                    )}
                </div>
                <hr className="lineSeperator" />
            </div>
        </div>
    );
}

export default StatBlock;

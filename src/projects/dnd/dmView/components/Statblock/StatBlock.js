import '../../../dmView/style/App.css';
import React, {useState, useEffect} from 'react';
import { getLevelData, effectImgMap, sizeOptions, typeOptions, alignmentOptions, raceOptions, isProd, addSign, generateUniqueId } from '../../constants';
import SkillGrid from '../SkillGrid';
import EditStatDropdown from './EditStatDropdown';
import EditStat from './EditStat';
import EditStatBig from './EditStatBig';
import GridWrap from './GridWrap';
import ContentArray from './ContentArray';
import ContentString from './ContentString';
import ActionTracker from './ActionTracker';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';
import { ThreeDots } from 'react-loader-spinner';
import EditAvatar from './EditAvatar';

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

const StatBlock = ({selectedIndex, currentEncounter, setCurrentEncounter, closeStatBlock, loading=false, searchingFor=null, handleUploadMonsterImage, socket}) => {

    const [creature, setCreature] = useState(currentEncounter.creatures[selectedIndex])
    const {addToHomebrewList} = useHomebrewProvider();
    const [isEditMode, setIsEditMode] = useState(currentEncounter.encounterName === "newhomebrew")
    
    // If selectedIndex changes a new creature was clicked
    useEffect(() => {
        setCreature(selectedIndex !== null ? currentEncounter.creatures[selectedIndex] : null)
        setIsEditMode(currentEncounter.encounterName === "newhomebrew")
    // eslint-disable-next-line
    }, [currentEncounter.creatures[selectedIndex], selectedIndex]);

    const handleChange = (e, cKey, category = undefined, index = undefined, send = false) => {
        // From EditStatBig add and remove buttonns
        const { value, checked, type } = e.target;
        if(['add', 'remove'].includes(cKey)) {
            handleUserArrayActions(cKey, category, index)
        } else if(index !== undefined) {
            //Array options, Actions, Bonus Actions
            handleArrayChange(value, cKey, category, index, send)
        } else if(category) {
            //Nested objects, speed
            handleNestedChange(type === 'checkbox' ? checked : value, cKey, category, send)
        } else {
            //Single change on the top level, name, size, type
            handleValueChange(value, cKey, send)
        }
    }
   
    
    const handleValueChange = (value, cKey, send) => {

        // also change current hp if max hp is changing and the creature is at full hp 
        let hpCurrent = {};

        if(cKey === 'hit_points' && parseInt(creature.hit_points) === parseInt(creature.hit_points_current)) {
            hpCurrent = {hit_points_current: value}
        }

        setCreature((prev) => ({
            ...prev,
            ...hpCurrent,
            [cKey]: value
        }));

        if (send) {
            if(parseInt(value) !== parseInt(currentEncounter.creatures[selectedIndex][cKey])) {
                setCurrentEncounter((prev) => ({
                    ...prev,
                    creatures: prev.creatures.map((oldCreature, i) =>
                        i === selectedIndex ? { ...creature } : oldCreature
                    ),
                }));

                if(cKey === 'hit_points' && parseInt(creature.hit_points) === parseInt(creature.hit_points_current)) {
                    socket.emit('playerHpChange', {hit_points: value, hit_points_current: value}, creature.creatureGuid, "dm");
                } else {
                    socket.emit('statBlockEdit', currentEncounter.creatures[selectedIndex].creatureGuid, cKey, value);
                }
                
            }
        }
    };

    const handleNestedChange = (value, cKey, category, send) => {
        if (send || cKey === 'hover') {
            if(value !== currentEncounter.creatures[selectedIndex]?.[category]?.[cKey]) {
                socket.emit('statBlockEditNestedObject', currentEncounter.creatures[selectedIndex].creatureGuid, category, cKey, value);
                setCurrentEncounter((prev) => {
                    const updatedCreatures = [...prev.creatures];
                    updatedCreatures[selectedIndex] = {
                        ...updatedCreatures[selectedIndex],
                        [category]: {
                            ...updatedCreatures[selectedIndex][category],
                            [cKey]: value,
                        },
                    };
                    return {
                        ...prev,
                        creatures: updatedCreatures,
                    };
                });
            }
        } else {
            setCreature((prev) => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [cKey]: value
                }
            }));
        }
    };

    const handleArrayChange = (value, cKey, category, index, send = false) => {
        if (send) {
            if(value !== "None" && value !== "--" && value !== currentEncounter.creatures[selectedIndex]?.[category]?.[index]?.[cKey]) {
                socket.emit('statBlockEditArrayUpdate', value, category, index, cKey, currentEncounter.creatures[selectedIndex].creatureGuid);

                setCurrentEncounter((prev) => {
                    const updatedCreatures = [...prev.creatures];
                    const updatedCategoryArray = updatedCreatures[selectedIndex][category] !== null ? [...updatedCreatures[selectedIndex][category]] : [{name: '', desc: ''}];

                    updatedCategoryArray[index] = {
                        ...updatedCategoryArray[index],
                        [cKey]: value,
                    };

                    updatedCreatures[selectedIndex] = {
                        ...updatedCreatures[selectedIndex],
                        [category]: updatedCategoryArray,
                    };

                    return {
                        ...prev,
                        creatures: updatedCreatures,
                    };
                });
            }
                
        } else {
            setCreature(prev => {
                // this catches the array object being empty i.e. [{}] instead of [{name: '', desc: ''}]
                const updatedArray = prev[category] !== null ? [...prev[category]] : [{name: '', desc: ''}]; // Copy the whole actions array
                updatedArray[index] = {
                    ...updatedArray[index], // Unwrap the old one  
                    [cKey]: value, // Then update the specific field of that index
                };
                return {
                    ...prev,
                    [category]: updatedArray, // Set the updated actions array for the creature
                };
            });
        }
    };

    const handleRechargeCheck = (addCheck, cKey, nested, actionIndex) => {
        if(nested) {
            setCurrentEncounter((prev) => {
                const updatedCreatures = [...prev.creatures];
                const updatedAction = updatedCreatures[selectedIndex][cKey];

                let newCount = updatedAction[actionIndex].rechargeCount;
                addCheck ? newCount++ : newCount--

                updatedAction[actionIndex] = {
                    ...updatedAction[actionIndex],
                    rechargeCount: newCount
                }

                updatedCreatures[selectedIndex] = {
                    ...updatedCreatures[selectedIndex],
                    [cKey]: [...updatedAction],
                };
    
                return {
                    ...prev,
                    creatures: updatedCreatures,
                };
            });
        } else {
            setCurrentEncounter((prev) => {
                const updatedCreatures = [...prev.creatures];
                let newCount = updatedCreatures[selectedIndex][cKey];
                addCheck ? newCount++ : newCount--
                updatedCreatures[selectedIndex] = {
                    ...updatedCreatures[selectedIndex],
                    [cKey]: newCount,
                };
    
                socket.emit('creatureActionCountChange', newCount, cKey, currentEncounter.creatures[selectedIndex].creatureGuid);
    
                return {
                    ...prev,
                    creatures: updatedCreatures,
                };
            });
        }
    }

    const handleUserArrayActions = (cKey, category, index) => {
        let updatedArray = []

        if(cKey === 'add') {
            let actionsArray = currentEncounter.creatures[selectedIndex][category] || []
            updatedArray = [...actionsArray, {name: 'None', desc: '--'}]
        } else if (cKey === 'remove') {
            updatedArray = [...currentEncounter.creatures[selectedIndex][category].filter((_, i) => i !== index)]
        }

        if(socket)
            socket.emit("statBlockEditArrayAction", category, index, currentEncounter.creatures[selectedIndex].creatureGuid, cKey)

        setCurrentEncounter((prev) => {
            const updatedCreatures = [...prev.creatures];

            updatedCreatures[selectedIndex] = {
                ...updatedCreatures[selectedIndex],
                [category]: updatedArray,
            };

            return {
                ...prev,
                creatures: updatedCreatures,
            };
        });

    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode)
    }

    const handleAddToHomebrew = (creature, action="") => {
        let homebrewCreature = creature;
        //If it does not have a homebrew guid or new homebrew is clicked, add one then send it
        if(!creature?.dmb_homebrew_guid || action === "new") {
            homebrewCreature = {...creature, dmb_homebrew_guid: generateUniqueId()}
            setCreature(homebrewCreature)
            setCurrentEncounter(prev => {
                prev.creatures[selectedIndex] = homebrewCreature
                return prev
            })
        }
        // Give the homebrew version a different creatureGuid
        addToHomebrewList({...homebrewCreature})
    }

    if(creature?.dnd_b_player_id) {
        return null;
    } else return (
        <div className='statBlock'>
            <div className='infoContainer'>
                {loading || !creature ? (
                    <div className='statBlockSpinner'>
                        <p>Rolling History for</p>
                        <div className="monsterEncounterIconContainer">
                            <img className="monsterSearchIcon" src={searchingFor?.avatarUrl} alt={"list Icon"} />
                        </div>
                        <strong> {searchingFor?.name}</strong>
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
                        <div className='statblockOptionsFlex' style={isEditMode ? {justifyContent: 'center', top: '-5px'} : {justifyContent: 'flex-end', top: ''}}>
                            {isEditMode && 
                                <>
                                    {creature?.dmb_homebrew_guid && <button className='statblockEdit' onClick={() => handleAddToHomebrew(creature, "new")}> Save New Homebrew </button>}
                                    <button className='statblockEdit' onClick={() => handleAddToHomebrew(creature)}>{creature?.dmb_homebrew_guid ? <>Save Homebrew</> : <>Save new Homebrew</>}</button>
                                </>
                            }

                            {currentEncounter.encounterGuid ?                             
                                <button className='statblockEdit' onClick={toggleEditMode}>{isEditMode ? <>Save Creature</> : <>Edit</>} </button>
                            :   // need a few options for this button since the statblock can be multiple things,
                                // if in edit mode on the "Add new Homebrew" template then close the whole statblock, but if its a creature with data then cancel takes you back to the statblock
                                <button className='statblockEdit' onClick={isEditMode && currentEncounter.encounterName === 'newhomebrew' ? closeStatBlock : toggleEditMode}>{isEditMode ? <>Cancel</> : <>{creature?.dmb_homebrew_guid ? 'Edit' : 'Use as Homebrew Template'}</>} </button>
                            }

                            {!isEditMode && <button className='statblockX' onClick={closeStatBlock}>❌</button>}
                        </div>
                        {isEditMode ? (
                            <div style={{overflowX: 'hidden', overflowY: 'auto'}}>
                                <div className='topInfo shadowBox'>
                                    <GridWrap columns={3}>
                                        <div className='encounterCreatureLeftContainer' >
                                            <EditAvatar handleUploadMonsterImage={handleUploadMonsterImage} creature={creature}/>
                                        </div>
                                        <EditStat label={`Name ${!isProd ? creature?.creatureGuid : ''}`} value={creature?.name || ''} cKey={'name'} handleChange={handleChange} />
                                        <EditStatDropdown label={`Race ${!isProd ? creature?.dmb_homebrew_guid : ''}`} options={raceOptions} value={creature.subtype} cKey={'subtype'} handleChange={handleChange}/> 
                                    </GridWrap>
                                    <hr className="editlineSeperator" />
                                    <GridWrap>
                                        <EditStatDropdown label={"Size"} options={sizeOptions} value={creature.size} cKey={'size'} handleChange={handleChange}/>
                                        <EditStatDropdown label={"Type"} options={typeOptions} value={creature.creature_type} cKey={'creature_type'} handleChange={handleChange}/>
                                        <EditStatDropdown label={"Alignment"} options={alignmentOptions} value={creature.creature_alignment} cKey={'creature_alignment'} handleChange={handleChange}/>
                                    </GridWrap>
                                    <hr className="editlineSeperator" />
                                    <GridWrap>
                                        <EditStat label={"Max Hp"} value={creature.hit_points} cKey={'hit_points'} handleChange={handleChange} type='number'/>
                                        <EditStat label={'AC'} value={creature.armor_class} cKey={'armor_class'} handleChange={handleChange} type='number'/>
                                        <EditStat label={"Init Bonus"} value={addSign(creature.dexterity_save)} cKey={'dexterity_save'} handleChange={handleChange} type='number'/>
                                    </GridWrap>
                                    <hr/>
                                    <GridWrap columns={6} scroll={'auto'}>
                                        <EditStat label={"Walk"} value={creature.speed.walk || 0} cKey={'walk'} category={'speed'} handleChange={handleChange} type='number' />
                                        <EditStat label={"Climb"} value={creature.speed.climb || 0} cKey={'climb'} category={'speed'} handleChange={handleChange} type='number' />
                                        <EditStat label={"Burrow"} value={creature.speed.burrow || 0} cKey={'burrow'} category={'speed'} handleChange={handleChange} type='number' />
                                        <EditStat label={"Swim"} value={creature.speed.swim || 0} cKey={'swim'} category={'speed'} handleChange={handleChange} type='number' />
                                        <EditStat label={"Fly"} value={creature.speed.fly || 0} cKey={'fly'} category={'speed'} handleChange={handleChange} type='number' />
                                        <EditStat label={"Hover"} value={creature.speed.hover || false} cKey={'hover'} category={'speed'} handleChange={handleChange} type='checkbox' />
                                    </GridWrap>
                                    <hr className="editlineSeperator" />
                                    <SkillGrid creature={creature} edit={true} handleChange={handleChange}/>
                                </div>
                                <GridWrap columns={2} paddingTop={15}>
                                    <EditStat label={"Vulnerabilites"} value={creature.damage_vulnerabilities} cKey={'damage_vulnerabilities'} handleChange={handleChange} />
                                    <EditStat label={"Resistances"} value={creature.damage_resistances} cKey={'damage_resistances'} handleChange={handleChange} />
                                    <EditStat label={"Senses"} value={creature.senses} cKey={'senses'} handleChange={handleChange} />
                                    <EditStat label={"Immunities"} value={creature.damage_immunities} cKey={'damage_immunities'} handleChange={handleChange} />
                                    <EditStat label={"Condition Immunities"} value={creature.condition_immunities} cKey={'condition_immunities'} handleChange={handleChange} />
                                </GridWrap>
                                <hr className="editlineSeperator" />
                                    <EditStatBig label={"Traits"} content={creature?.special_abilities} category={'special_abilities'} handleChange={handleChange}/>
                                <hr className="editlineSeperator" />
                                    <EditStatBig label={"Actions"} content={creature?.actions} category={'actions'} handleChange={handleChange}/>
                                <hr className="editlineSeperator" />
                                    <EditStatBig label={"Bonus Actions"} content={creature?.bonus_actions} category={'bonus_actions'} handleChange={handleChange}/>
                                <hr className="editlineSeperator" />
                                    <EditStatBig label={"Reactions"} content={creature?.reactions} category={'reactions'} handleChange={handleChange}/>
                                <hr className="editlineSeperator" />
                                    <EditStatBig label={"Legendary Actions"} content={creature?.legendary_actions} category={'legendary_actions'} handleChange={handleChange}/>
                                <hr className="editlineSeperator" />
                                    <EditStatBig label={"Lair Actions"} content={creature?.lair_actions} category={'lair_actions'} handleChange={handleChange}/>
                                <hr className="editlineSeperator" />
                                <GridWrap>
                                    <EditStat label={"Languages"} value={creature.languages} cKey={'languages'} handleChange={handleChange} />
                                    <EditStat label={"Environments"} value={creature.environments} cKey={'environments'} handleChange={handleChange} />
                                    <div style={{display: 'flex'}}>
                                        <EditStat label={"CR"} value={creature.challenge_rating} cKey={'challenge_rating'} handleChange={handleChange} type='number'/>
                                    </div>
                                </GridWrap>
                                <hr className="lineSeperator" />
                            </div>
                        ) : (
                            <>
                                <div className='topInfo shadowBox'>
                                    <h1 className='creatureName titleFontFamily'>{creature?.name}</h1>
                                    {creature.effects.length > 0 &&
                                        <div style={{backgroundColor: "black", width: 'fit-content', borderRadius: 5}}>
                                            {creature.effects.map((effect) => (
                                                <img alt='effect' className='effect growImage' src={effectImgMap[effect]}/>
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
                                            <span className='extraInfo'>&nbsp;({parseInt(creature.dexterity_save)+10 || 10})</span>
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
                                    <SkillGrid creature={creature} handleChange={handleChange}/>
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
                                                            {ability.rechargeCount !== 0 ? (
                                                                <div className={`actionToken-container`}>
                                                                    <strong>{ability.name} </strong>
                                                                    <ActionTracker 
                                                                        actions_count={ability.rechargeCount}
                                                                        label={ability.name}
                                                                        cKey={'special_abilities'}
                                                                        nested={true}
                                                                        handleCheck={handleRechargeCheck}
                                                                        actionIndex={index}
                                                                    />
                                                                </div>
                                                            ) : ( 
                                                                <strong>{ability.name}: </strong>
                                                            )}

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
                                                <ContentArray label={'ACTIONS'} contentArray={creature.actions} cKey={'actions'} handleCheck={handleRechargeCheck} nested={true}/>

                                            )}
                                        </>
                                    }
                                    
                                    <ContentArray label={'BONUS ACTIONS'} contentArray={creature.bonus_actions} cKey={'bonus_actions'} handleCheck={handleRechargeCheck} nested={true}/>
                                    <ContentArray label={'REACTIONS'} contentArray={creature.reactions} cKey={'reactions'} handleCheck={handleRechargeCheck} nested={true}/>
                                    
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
                                                <ContentArray label={'LEGENDARY ACTIONS'} contentArray={creature.legendary_actions} labelDesc={creature.legendary_desc} actions_count={creature.legendary_actions_count} handleCheck={handleRechargeCheck} cKey={'legendary_actions_count'}/>
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
                    </>
                )}
                
            </div>
        </div>
    );
}

export default StatBlock;

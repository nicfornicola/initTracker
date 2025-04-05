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
import { BoldifyReplace } from './BoldifyReplace';
import SpellCasting from './SpellList';
import EditSpellCasting from './EditSpellCasting';

function exists(value) {
    return value && value !== '0';
}

function formatSpeed(speed) {
    const order = ['walk', 'climb', 'burrow', 'swim', 'fly', 'hover'];
    const entries = order
        .filter(key => exists(speed[key])) 
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
                        <strong className='titleColor'>{name}: </strong> {description}
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
                <strong className='titleColor'>{spell.level}:</strong> {spell.spellNames.join(', ')}
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
        string += `${creature.size} -`
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

    if(creature?.alignment) {
        string += ` (${creature.alignment})`
    }

    return <p><i>{string}</i></p>
}

const colors = {
    0: "green",
    1: "orange",
    2: "brown",
}

const StatBlock = ({selectedIndex, indexOf, currentEncounter, setCurrentEncounter, closeStatBlock, loading=false, searchingFor=null, handleUploadMonsterImage, socket}) => {
    // Creature can be null from SearchColumn but not from EncounterColumn, Statblock is not shown if from EncounterColumn
    const [creature, setCreature] = useState(currentEncounter?.creatures[selectedIndex])
    const [creatureReset, setCreatureReset] = useState(currentEncounter?.creatures[selectedIndex])
    const {addToHomebrewList} = useHomebrewProvider();
    const [isEditMode, setIsEditMode] = useState(currentEncounter?.encounterName === "dmbuddy_newhomebrew")
    const [showFullImage, setShowFullImage] = useState(false)
    // If selectedIndex changes a new creature was clicked
    useEffect(() => {
        let newCreature = selectedIndex !== null ? currentEncounter?.creatures[selectedIndex] : null
        setCreature(newCreature)

        //only change creatureReset if its actually since this useeffect trigger on cancel
        if(newCreature.creatureGuid !== creatureReset.creatureGuid)
            setCreatureReset(newCreature)
        
    // eslint-disable-next-line
    }, [currentEncounter?.creatures[selectedIndex], selectedIndex]);

    useEffect(() => {
        // Auto set edit mode to true if its a from scratch Homebrew
        setIsEditMode(currentEncounter?.encounterName === "dmbuddy_newhomebrew")
    // eslint-disable-next-line
    }, [currentEncounter?.creatures[selectedIndex]?.creatureGuid]);

    const handleSpellChange = (e, cKey, path = undefined, index = undefined, send = false) => {
        const { value } = e.target;
        // From EditStatBig add and remove buttons for SpellCasting ensure path is only "spellcasting"
        console.table({value, cKey, path, index})
        if(['add', 'remove', 'change'].includes(cKey)) {

            // , maybe ability later
            if(path.includes(".")) {
                handleUserSpellActions(cKey, path, index, value, send)
            } else {
                // cKey is add or remove, adding or removing from total spellcasting [], path is spellcasting
                handleUserArrayActions(cKey, path, index)
            }
        } else if(index !== undefined) {
            //name, headerEntries
            handleArrayChange(value, cKey, path, index, send)
        }

    }

    const handleUserSpellActions = (cKey, path, index, newValue = undefined, send = false) => {
        let pathItems = path.split(".")
        let pathKey = pathItems[0]
        let spellType = pathItems[1]
        let spellIndex = parseInt(pathItems.at(-1))
        let spellCastingList = creature.spellcasting
        console.table({pathKey, spellType, spellIndex, newValue})

        if(cKey === 'add') {
            let newSpell = spellType > 0 ? '{@spell New Spell}' : '{@spell New Cantrip}'
            if(pathKey === 'spells') {
                let spellObjTemplate = {
                    [spellType]: {
                        slots: newValue,
                        spells: []
                    }
                }

                if(!spellCastingList[index].spells) {
                    spellCastingList[index].spells = spellObjTemplate
                } else if(!spellCastingList[index].spells[spellType]) {
                    spellCastingList[index].spells[spellType] = {...spellObjTemplate[spellType]}
                }
                spellCastingList[index].spells[spellType].spells.push(newSpell)
            } else if(pathKey === 'daily' || pathKey === "week" || pathKey === "lr" || pathKey === "sr") {

                const timeFrame = pathKey 

                let spellObjTemplate = {
                    [spellType]: []
                }

                if(!spellCastingList[index][timeFrame]) {
                    spellCastingList[index][timeFrame] = spellObjTemplate
                } else if(!spellCastingList[index][timeFrame][spellType]) {
                    spellCastingList[index][timeFrame][spellType] = []
                }

                spellCastingList[index][timeFrame][spellType].push(newSpell)
            } else if(pathKey === 'will') {

                if(!spellCastingList[index].will) {
                    spellCastingList[index].will = []
                }
                spellCastingList[index].will.push(newSpell)
            }
        } else if (cKey === 'remove') {
            if(pathKey === 'spells') {

                if(spellIndex)
                    spellCastingList[index].spells[spellType].spells = spellCastingList[index].spells[spellType].spells.filter((_, i) => i !== spellIndex)
                else {
                    delete spellCastingList[index].spells[spellType]
                }

            } else if(pathKey === 'daily' || pathKey === "week" || pathKey === "lr" || pathKey === "sr") {
                const timeFrame = pathKey 

                if(spellIndex)
                    spellCastingList[index][timeFrame][spellType] = spellCastingList[index][timeFrame][spellType].filter((_, i) => i !== spellIndex)
                else {
                    delete spellCastingList[index][timeFrame][spellType]
                }

            } else if(pathKey === 'will') {
                if(spellIndex)
                    spellCastingList[index].will = spellCastingList[index].will.filter((_, i) => i !== spellIndex)
                else {
                    delete spellCastingList[index].will
                }
            }
        }  else if (cKey === 'change') {
            if(pathKey === 'spells') {
                spellCastingList[index].spells[spellType].spells[spellIndex] = newValue
            } else if(pathKey === 'daily' || pathKey === "week" || pathKey === "lr" || pathKey === "sr") {
                spellCastingList[index][pathKey][spellType][spellIndex] = newValue
            } else if(pathKey === 'will') {
                spellCastingList[index].will[spellIndex] = newValue
            }
        }
        
        if(send) {
            setCurrentEncounter((prev) => {
                const updatedCreatures = [...prev.creatures];
    
                updatedCreatures[selectedIndex] = {
                    ...updatedCreatures[selectedIndex],
                    spellcasting: [...spellCastingList],
                };
    
                return {
                    ...prev,
                    creatures: updatedCreatures,
                };
            });
            //socket does not exist in search column statblock
            socket?.emit("creatureSpellCastingChange", spellCastingList, currentEncounter.creatures[selectedIndex].creatureGuid)
        } else {
            setCreature((c) => ({
                ...c,
                spellcasting: [...spellCastingList]
            }));
        }
    };

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
        } else if(cKey === "legendary_actions_count") {
            if(0 < value < 10)
                value *= 10
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

                // This is a weird check for the search selected creatures that have their skills (i.e. STR or STR_Save) edited
                if(currentEncounter.encounterName === 'dmbuddy_selected' && !isEditMode) {
                    handleAddToHomebrew(creature)
                }

                if(cKey === 'hit_points' && parseInt(creature.hit_points) === parseInt(creature.hit_points_current)) {
                    socket?.emit('playerHpChange', {hit_points: value, hit_points_current: value}, creature.creatureGuid, "dm");
                } else {
                    socket?.emit('statBlockEdit', currentEncounter.creatures[selectedIndex].creatureGuid, cKey, value);
                }
                
            }
        }
    };

    const handleNestedChange = (value, cKey, category, send) => {
        if (send || cKey === 'hover') {
            if(value !== currentEncounter.creatures[selectedIndex]?.[category]?.[cKey]) {
                socket?.emit('statBlockEditNestedObject', currentEncounter.creatures[selectedIndex].creatureGuid, category, cKey, value);
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

                const abilityKeys = ["special_abilities", "actions", "bonus_actions", "reactions"];
                let updateSlots = 0
                if(cKey === 'name' && abilityKeys.includes(category)) {
                    const match = value.match(/\((\d+)\/[^)]+\)/); // Match (X/any text) pattern
                    if(match) {
                        updateSlots = parseInt(match[1]) * 10
                    }
                }

                socket?.emit('statBlockEditArrayUpdate', value, category, index, cKey, currentEncounter.creatures[selectedIndex].creatureGuid);
                
                setCurrentEncounter((prev) => {
                    const updatedCreatures = [...prev.creatures];
                    const updatedCategoryArray = updatedCreatures[selectedIndex][category] !== null ? [...updatedCreatures[selectedIndex][category]] : [{name: '', desc: ''}];

                    updatedCategoryArray[index] = {
                        ...updatedCategoryArray[index],
                        [cKey]: value,
                    };

                    if(updateSlots) {
                        updatedCategoryArray[index].rechargeCount = updateSlots
                        console.table({updateSlots, category, index, cKey: 'rechargeCount'});

                        socket?.emit('statBlockEditArrayUpdate', updateSlots, category, index, "rechargeCount", currentEncounter.creatures[selectedIndex].creatureGuid);
                    }

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
        // If actions bonus action...
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

                socket?.emit("statBlockEditArrayUpdate", newCount, cKey, actionIndex, 'rechargeCount', currentEncounter.creatures[selectedIndex].creatureGuid)

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
            // If legendary actions
            setCurrentEncounter((prev) => {
                const updatedCreatures = [...prev.creatures];
                let newCount = updatedCreatures[selectedIndex][cKey];
                addCheck ? newCount++ : newCount--
                updatedCreatures[selectedIndex] = {
                    ...updatedCreatures[selectedIndex],
                    [cKey]: newCount,
                };
    
                socket?.emit('creatureActionCountChange', newCount, cKey, currentEncounter.creatures[selectedIndex].creatureGuid);
    
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
            let newObject = {name: 'None', desc: '--'}
            if(category === 'spellcasting') {
                newObject = {
					"name": "Spellcasting",
					"type": "spellcasting",
					"headerEntries": [
						`${creature.name} is a Xth-level spellcaster. Spellcasting ability is CHA|WIS|INT (spell save {@dc X}, {@hit X} to hit with spell attacks). They regain expended spell slots when they finish a short or long rest, and know the following spells:`
					],
                    "spells": {
                        "0": {
							"slots": 0,
							"spells": ['{@spell New Cantrip}']
						},
						"1": {
							"slots": 3,
							"spells": ['{@spell New Spell}']
						}
					},
					"displayAs": "trait"
				}
            }

            let actionsArray = currentEncounter.creatures[selectedIndex][category] || []
            updatedArray = [...actionsArray, newObject]
        } else if (cKey === 'remove') {
            updatedArray = [...currentEncounter.creatures[selectedIndex][category].filter((_, i) => i !== index)]
        }

        socket?.emit("statBlockEditArrayAction", category, index, currentEncounter.creatures[selectedIndex].creatureGuid, cKey)

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
        //reset creature on cancel when selected from search column
        if(currentEncounter.encounterName === 'dmbuddy_selected' && isEditMode === true) {
            setCurrentEncounter(prev => {
                prev.creatures[selectedIndex] = creatureReset
                return prev
            })
        }
        setIsEditMode(!isEditMode)
    }

    const handleAddToHomebrew = (creature, action="") => {
        let homebrewCreature = creature;
        //If new homebrew is clicked
        let isNewEntry = action === "new"
        if(isNewEntry) {
            homebrewCreature = {...creature, dmb_homebrew_guid: generateUniqueId()}
            setCreature(homebrewCreature)
            setCurrentEncounter(prev => {
                prev.creatures[selectedIndex] = homebrewCreature
                return prev
            })
        }
        // Give the homebrew version a different creatureGuid
        addToHomebrewList({...homebrewCreature})
        setIsEditMode(false)
    }

    if(creature?.dnd_b_player_id) {
        return null;
    } else return (
        <div className='infoContainer'>
            {loading || !creature ? (
                <div className='statBlockSpinner'>
                    <p><i>Rolling History...</i></p>
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
                    {isEditMode ? (
                        <div style={{overflowX: 'hidden', overflowY: 'auto'}}>
                            <div className='topInfo shadowBox'>
                                <div className='statBlockTopButtons'>
                                    <button className="statblockEdit" style={{visibility: 'visible'}} onClick={() => handleAddToHomebrew(creature, "new")}>
                                        Save New Homebrew
                                    </button>
                                    {creature?.dmb_homebrew_guid &&
                                        <button className="statblockEdit" style={{visibility: 'visible'}} onClick={() => handleAddToHomebrew(creature)}>
                                            Save Homebrew
                                        </button>
                                    }
                                    <button className="statblockEdit" style={{visibility: 'visible'}} onClick={toggleEditMode}>
                                        {currentEncounter.encounterGuid ? 'Save Creature' : 'Cancel'}
                                    </button>
                                </div>
                                
                                <div className='encounterCreatureLeftContainer' >
                                    <EditAvatar handleUploadMonsterImage={handleUploadMonsterImage} creature={creature}/>

                                    <GridWrap columns={3}>
                                        <EditStat label={`Name ${!isProd ? creature?.creatureGuid : ''}`} value={creature?.name || ''} cKey={'name'} handleChange={handleChange} />
                                        <EditStatDropdown label={`Race ${!isProd ? creature?.dmb_homebrew_guid : ''}`} options={raceOptions} value={creature.subtype} cKey={'subtype'} handleChange={handleChange}/> 
                                    </GridWrap>
                                </div>

                                <hr className="editlineSeperator" />
                                <GridWrap columns={3}>
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
                                <EditSpellCasting label={"Spell Casting"} spellcasting={creature?.spellcasting} category={'spellcasting'} handleChange={handleSpellChange}/>
                            <hr className="editlineSeperator" />
                                <EditStatBig label={"Actions"} content={creature?.actions} category={'actions'} handleChange={handleChange}/>
                            <hr className="editlineSeperator" />
                                <EditStatBig label={"Bonus Actions"} content={creature?.bonus_actions} category={'bonus_actions'} handleChange={handleChange}/>
                            <hr className="editlineSeperator" />
                                <EditStatBig label={"Reactions"} content={creature?.reactions} category={'reactions'} handleChange={handleChange}/>
                            <hr className="editlineSeperator" />
                                <EditStatDropdown label={"Legendary Actions Count"} options={[0,1,2,3,4,5,6,7,8,9,10]} value={Math.floor(creature?.legendary_actions_count/10) || 0} cKey={'legendary_actions_count'} handleChange={handleChange}/>
                                <EditStatBig label={"Legendary Actions"} content={creature?.legendary_actions} category={'legendary_actions'} handleChange={handleChange}/>
                            <hr className="editlineSeperator" />
                                <EditStatBig label={"Lair Actions"} content={creature?.lair_actions} category={'lair_actions'} handleChange={handleChange}/>
                            <hr className="editlineSeperator" />
                            <GridWrap columns={2}>
                                <EditStat label={"Languages"} value={creature.languages} cKey={'languages'} handleChange={handleChange} />
                                {/* <EditStat label={"Environments"} value={creature.environments} cKey={'environments'} handleChange={handleChange} /> */}
                                <div style={{display: 'flex'}}>
                                    <EditStat label={"CR"} value={creature.challenge_rating} cKey={'challenge_rating'} handleChange={handleChange} type='number'/>
                                </div>
                            </GridWrap>
                            <hr className="lineSeperator" />
                        </div>
                    ) : (
                        <>  
                            <div className='statblockOptionsFlex'>
                                <div>
                                    <button className="statblockEditInfo" onClick={() => setShowFullImage(!showFullImage)}>i</button>
                                </div>
                                <div className='statblockOptionsRight'>
                                    <button className="statblockEdit" onClick={toggleEditMode}>
                                        {(currentEncounter.encounterGuid || creature?.dmb_homebrew_guid)
                                            ? "Edit"
                                            : "Use as Homebrew Template"
                                        }
                                    </button>
                                    <button className='statblockX' onClick={closeStatBlock}><span style={{fontSize: '11px'}}>❌</span></button>
                                </div>
                            </div>

                            <div className='topInfo shadowBox'>
                                
                                <img className={showFullImage ? "clearImage" : "behindImage"} src={creature.avatarUrl} alt={"Creature Img"} />
                                {!showFullImage && 
                                    <>
                                        <h1 className='creatureName titleFontFamily'>{creature?.name}&nbsp;</h1>
                                        
                                        <div className='creatureType'>
                                            <hr className="lineSeperator" />
                                            <CreatureInfo creature={creature}/>
                                            {(currentEncounter.encounterName !== 'dmbuddy_selected' && currentEncounter.encounterName !== 'dmbuddy_newhomebrew') && 
                                                <div className='selectedIndicater siStatBlock' style={{backgroundColor: colors[indexOf]}}> {indexOf+1}</div>
                                            }    
                                        </div>
                                        {creature.effects.length > 0 &&
                                            <div style={{backgroundColor: "black", width: 'fit-content', height: '42px', borderRadius: 5}}>
                                                {creature.effects.map((effect) => (
                                                    <img alt='effect' className='effect growImage' src={effectImgMap[effect]}/>
                                                ))}
                                            </div>
                                        }
                                        <div className='stickyStatGrid textShadow' >
                                            <p className="stickyStatItem">
                                                <strong className='titleColor'>AC&nbsp;</strong>
                                                <BoldifyReplace desc={creature.armor_class} />
                                                {creature.armor_desc && creature.armor_desc !== "()" && 
                                                    <>&nbsp;<BoldifyReplace desc={creature.armor_desc} /></>
                                                } 
                                            </p>
                                            <p className="stickyStatItem">
                                                <strong className='titleColor'>Initiative</strong>&nbsp;{addSign(creature.dexterity_save)} 
                                                <span className='extraInfo'>&nbsp;({parseInt(creature.dexterity_save)+10 || 10})</span>
                                            </p>
                                            <p className="stickyStatItem stickyStatExtraWide">
                                                <strong className='titleColor'>HP&nbsp;</strong>{creature.hit_points_current}/{creature.hit_points} 
                                                {creature.hit_points_temp !== 0 && (
                                                    <span className='tempHp'>&nbsp;(+{creature.hit_points_temp}) </span>
                                                )}
                                                {creature.hit_dice && (
                                                    <span className='extraInfo'>&nbsp;({creature?.hit_dice})</span>
                                                )}
                                                
                                            </p>
                                            <p className="stickyStatItem"></p>
                                            <p className="stickyStatItem stickyStatExtraWide">
                                                <strong className='titleColor'>Speed</strong>&nbsp;
                                                {formatSpeed(creature.speed)}
                                            </p>
                                            <p className="stickyStatItem"></p>
                                        </div>
                                        <SkillGrid creature={creature} handleChange={handleChange}/>
                                    </>
                                }

                            </div>
                                
                            <div className="statBlockScroll">
                                <ContentString label={'Skills'} contentString={creature.skills} />
                                <ContentString label={'Vulnerabilities'} contentString={creature.damage_vulnerabilities} />
                                <ContentString label={'Resistances'} contentString={creature.damage_resistances} />
                                <ContentString label={'Immunities'} contentString={creature.damage_immunities} />
                                <ContentString label={'Condition Immunities'} contentString={creature.condition_immunities} />
                                <ContentString label={'Senses'} contentString={creature.senses} />
                                <ContentString label={'Languages'} contentString={creature.languages} />
                                <ContentString label={'CR'} contentString={creature.challenge_rating} italics={`(${getLevelData(creature.challenge_rating)} XP)`}/>
                            
                                {(creature.special_abilities && creature.special_abilities.length > 0) && 
                                    <>
                                        <h1 className='infoTitle'>TRAITS</h1>
                                        <hr className="lineSeperator" />
                                            {creature.special_abilities.map((ability, index) => {
                                                // Skip rendering if name is "None" and desc is "--"
                                                if (ability.name === "None" && ability.desc === "--") {
                                                    return null;
                                                }
                                        
                                                return (
                                                    <div className='actionInfo' key={index + ability.name}>
                                                        {ability.rechargeCount !== 0 ? (
                                                            <div className={`actionToken-container`}>
                                                                <strong className='titleColor'><BoldifyReplace name={ability.name} /> </strong>
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
                                                            <strong className='titleColor'><BoldifyReplace name={ability.name} /> </strong>
                                                        )}
                                                        <span className='infoDesc'>
                                                            {ability.name === "Spellcasting" ? (
                                                                <>
                                                                    {getSpells(getDesc(ability))}
                                                                </>
                                                            ) : (
                                                                <BoldifyReplace desc={ability?.desc} />
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                        })}
                                    </>
                                }
                                
                                <SpellCasting creature={creature}/>

                                <ContentArray label={'ACTIONS'} contentArray={creature.actions} cKey={'actions'} handleCheck={handleRechargeCheck} nested={true}/>
                                <ContentArray label={'BONUS ACTIONS'} contentArray={creature.bonus_actions} cKey={'bonus_actions'} handleCheck={handleRechargeCheck} nested={true}/>
                                <ContentArray label={'REACTIONS'} contentArray={creature.reactions} cKey={'reactions'} handleCheck={handleRechargeCheck} nested={true}/>
                                <ContentArray label={'LEGENDARY ACTIONS'} contentArray={creature.legendary_actions} labelDesc={creature.legendary_desc} actions_count={creature.legendary_actions_count} handleCheck={handleRechargeCheck} cKey={'legendary_actions_count'}/>
                                <ContentArray label={'LAIR ACTIONS'} contentArray={creature.lair_actions} labelDesc={creature.legendary_desc} actions_count={creature.legendary_actions_count} handleCheck={handleRechargeCheck} cKey={'legendary_actions_count'}/>
                                
                                {/* {creature.environments && (
                                    <div className='extraInfo'>
                                        <hr className="lineSeperator" />
                                        <strong>Environments: </strong>
                                        <span> {creature.environments}</span>
                                    </div>
                                )} */}
                            </div>
                            <hr className="lineSeperator" />
                            {creature.sourceShort && 
                                <div>
                                    <strong className='source'>Source: {creature.sourceShort}, page {creature.page}</strong>
                                </div>
                            }
                            
                        </>
                    )}
                    <hr className="lineSeperator" />
                </>
            )}
            
        </div>
    );
}

export default StatBlock;

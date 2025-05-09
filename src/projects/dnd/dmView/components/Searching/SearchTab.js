import React, {useState, useEffect} from 'react';
import { generateUniqueId, INIT_ENCOUNTER_NAME, COLOR_GREEN, COLOR_RED} from '../../constants'
import { ThreeDots } from 'react-loader-spinner'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';
import 'react-tabs/style/react-tabs.css';
import greenCheck from '../../pics/icons/check.png'
import refresh from '../../pics/icons/refresh.png'
import OptionButton from '../EncounterColumn/OptionButton';
import { useUser } from '../../../../../providers/UserProvider';
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'
import SearchImportRefresh from './SearchImportRefresh';

const alignmentOptions = [
    'good', 'evil', 'neutral',
    'true', 'unaligned', 'lawful',
    'chaotic', 'lawful good', 'neutral good',
    'chaotic good', 'lawful neutral', 
    'true neutral', 'chaotic neutral',
    'lawful evil','nuetral evil',
    'chaotic evil','unaligned' 
]

function getKey(c) {
    let keyExtra = ""
    if(c?.from === 'dnd_b')
        keyExtra = c.dnd_b_player_id
    else if(c?.dmb_homebrew_guid)
        keyExtra = c?.dmb_homebrew_guid
    else 
        keyExtra = c.sourceShort

    return c.name + keyExtra;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}

function highlightSubstring(substring, fullString) {
    if (!substring) return fullString;
    const parts = fullString.split(new RegExp(`(${escapeRegExp(substring)})`, 'gi')); // Split on the substring, keeping it in the result

    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === substring.toLowerCase() ? (
                    <b key={index} style={{
                        textShadow: '1px 1px 2px gray',
                    }}>{part}</b> 
                ) : (
                    part 
                )
            )}
        </span>
    );
}

const SearchTab = ({displayedItems, setCurrentEncounter, encounterGuid, searchTerm, setSearchSelectedCreature, loadingPack, setLoadingPack, socket}) => {    
    const {removeFromImportList} = useImportedPlayers();
    const {removeFromHomebrewList} = useHomebrewProvider();

    // Set the selected creature in search bar on left and gets the data from open5e
    const handleSearchSelectCreature = async (creature, action, event, index) => {
        event.stopPropagation();
        // This is the non loading version of the creature
        let loadingPackage = {index: index, action: action, searchingFor: creature}
        if(action === 'select')
            setSearchSelectedCreature(null);
        if(creature?.creatureGuid !== undefined) {
            if(action === "add" || (action === "select" && !creature?.dnd_b_player_id)) {
                setLoadingPack(loadingPackage)
                handleSelectCreature(creature, action)                
            }
        }
    };

    const handleSelectCreature = (creature, action) => {
        if(action === "add") {
            let newCreature = {...creature, creatureGuid: generateUniqueId(), encounterGuid: encounterGuid}
            setCurrentEncounter(prev => {
                if(prev.creatures.length === 0 && prev.encounterName === INIT_ENCOUNTER_NAME) {
                    socket.emit("newEncounter", encounterGuid)
                }
              
                // If there are no creatures in this list, then create the encounter in the database and add to it
                socket.emit("addCreatureToEncounter", newCreature)
              
                // Return the updated state with the new creature added
                return {
                  ...prev,
                  creatures: [...prev.creatures, newCreature]
                };
            });           
        }
        else if(action === "select") {
            if(creature.dmb_homebrew_guid) {
                setSearchSelectedCreature({...creature});
            } else {
                let newGuid = generateUniqueId();
                setSearchSelectedCreature({...creature, creatureGuid: newGuid});
            }
        }

        setLoadingPack({index: null, action: null, searchingFor: null})
    };

    const colors = {
        "enemy": COLOR_RED,
        "neutral": '#999999',
        "ally": COLOR_GREEN,
        "pet": COLOR_GREEN
    }

    return (
        <>
            {displayedItems.length > 0 ? ( displayedItems?.map((creature, index) => (
                <li
                    className='listItem'
                    key={getKey(creature)}
                    onClick={(e) => handleSearchSelectCreature(creature, "select", e, index)}
                >
                    <div className='searchListCreatureContainer animated-box' 
                        style={creature?.alignment ? {borderLeft: `6px solid ${colors[creature?.alignment]}`} : {}}
                    >
                        <div className="monsterEncounterIconContainer">
                            <img className="monsterSearchIcon" src={creature.avatarUrl} alt={"list Icon"} />
                        </div>
                        <div className='searchListCreatureDetails'>
                            <span>
                                <strong>{highlightSubstring(searchTerm, creature.name)}</strong>  
                            </span>
                            <div className='searchCreatureSmallDetails'>
                                {creature?.from === 'dnd_b' ? (
                                    <>
                                        <span className='monsterSearchDetailText'>{creature?.campaign && <b>{creature.campaign} - </b>}</span>
                                        <span className='monsterSearchDetailText'>{highlightSubstring(searchTerm, creature.dnd_b_player_id)}</span>
                                    </>
                                ) : (
                                    <>
                                        {creature?.dmb_homebrew_guid ? (
                                            <>
                                                <span className='monsterSearchDetailText'> CR: {creature.challenge_rating}</span>
                                                {creature?.creature_type !== "--" && <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, creature.creature_type)}</span>}
                                                <span className='monsterSearchDetailText'> - {creature?.dmb_homebrew_guid}</span>
                                                <span className='monsterSearchDetailText'> - {creature?.alignment}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className='monsterSearchDetailText'> CR: {creature.cr}</span>
                                                <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, creature.creature_type)}</span>
                                                <span className='monsterSearchDetailText'> - {creature.sourceShort}</span>
                                                {(searchTerm.length >= 4 && alignmentOptions.includes(searchTerm.toLowerCase())) && 
                                                    <span className='monsterSearchDetailText' style={{textShadow: '1px 1px 2px gray',}}> 
                                                        - <b>{searchTerm.toLowerCase()}</b>
                                                    </span>
                                                }
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {index === loadingPack.index &&
                            <div className='grow'>
                                <ThreeDots
                                    visible={true}
                                    height="20"
                                    width="35"
                                    color="black"
                                    radius="1"
                                    ariaLabel="three-dots-loading"
                                />
                            </div>
                        }
                        <div className='searchListButtonContainer'>
                            {(creature?.dnd_b_player_id || creature?.dmb_homebrew_guid) &&
                                <button className='searchCreatureX' onClick={(event) => {
                                    event.stopPropagation()
                                    creature?.dnd_b_player_id ? removeFromImportList(creature, index) : removeFromHomebrewList(creature, index)
                                }}>
                                    ❌
                                </button>
                            }
                            {(creature?.dnd_b_player_id) &&
                                <SearchImportRefresh creature={creature} encounterGuid={encounterGuid}/>
                            }
                            <button className='monsterSearchAdd' onClick={(e) => handleSearchSelectCreature(creature, "add", e, index)}>
                                ➕
                            </button>
                        </div>

                    </div>
                </li>
            ))) : (
                <div className='searchListCreatureContainer'>No creatures found</div>
            )}
        </>
    );
}

export default SearchTab;
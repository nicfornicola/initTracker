import React from 'react';
// import data from '../monsterJsons/5eCoreRules.json'; // Adjust the import path as necessary
import { generateUniqueId, INIT_ENCOUNTER_NAME, backendUrl} from '../../constants'
import axios from 'axios';
import Open5eToDmBMapper from '../../mappers/Open5eToDmBMapper'
import { ThreeDots } from 'react-loader-spinner'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';
import 'react-tabs/style/react-tabs.css';

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
        keyExtra = c.filterDimensions.source

    return c.name + keyExtra;
}

function highlightSubstring(substring, fullString) {
    if (!substring) return fullString;
    const parts = fullString.split(new RegExp(`(${substring})`, 'gi')); // Split on the substring, keeping it in the result

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
        } else {
            setLoadingPack(loadingPackage)
            axios.get(`${backendUrl}/open5e_monster_import/`, {
                params: { link: creature.link } // Include the link in query parameters
            }).then(response => {
                return Open5eToDmBMapper(response.data, creature.avatarUrl); 
            }).then(mappedCreature => {
                handleSelectCreature(mappedCreature, action);
            }).catch(error => {
                console.warn(`Error loading creature: ${creature.id}`, error);
            });

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
            setSearchSelectedCreature({...creature, creatureGuid: generateUniqueId()});
        }

        setLoadingPack({index: null, action: null, searchingFor: null})
    };

    return (
        <>
            {displayedItems.length > 0 ? ( displayedItems?.map((creature, index) => (
                <li
                    className='listItem'
                    key={getKey(creature)}
                    onClick={(e) => handleSearchSelectCreature(creature, "select", e, index)}
                >
                    <div className='searchListCreatureContainer animated-box'>
                        <div className="monsterEncounterIconContainer">
                            <img className="monsterSearchIcon" src={creature.avatarUrl} alt={"list Icon"} />
                        </div>
                        <div className='searchListCreatureDetails'>
                        <strong>{highlightSubstring(searchTerm, creature.name)}</strong>
                            <div className='searchCreatureSmallDetails'>
                                {creature?.from === 'dnd_b' ? (
                                    <>
                                        <span className='monsterSearchDetailText'>{highlightSubstring(searchTerm, creature.type)}</span>
                                        <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, creature.dnd_b_player_id)}</span>
                                    </>
                                ) : (
                                    <>
                                        {creature?.dmb_homebrew_guid ? (
                                            <>
                                                <span className='monsterSearchDetailText'> CR: {creature.challenge_rating}</span>
                                                {creature?.creature_type !== "--" && <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, creature.creature_type)}</span>}
                                                <span className='monsterSearchDetailText'> - {creature?.dmb_homebrew_guid}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className='monsterSearchDetailText'> CR: {creature.filterDimensions.level}</span>
                                                <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, creature.filterDimensions.type.split(' ')[0])}</span>
                                                <span className='monsterSearchDetailText'> - {creature.filterDimensions.sourceShort}</span>
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
                                    X
                                </button>
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
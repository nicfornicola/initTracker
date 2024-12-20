import React from 'react';
// import data from '../monsterJsons/5eCoreRules.json'; // Adjust the import path as necessary
import { generateUniqueId, INIT_ENCOUNTER_NAME, backendUrl} from '../../constants'
import axios from 'axios';
import Open5eToDmBMapper from '../../mappers/Open5eToDmBMapper'
import { ThreeDots } from 'react-loader-spinner'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
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
    const {setImportedPlayers} = useImportedPlayers();

    // Set the selected creature in search bar on left and gets the data from open5e
    const handleSearchSelectCreature = async (creature, action, event, index) => {
        event.stopPropagation();

        if(creature?.dnd_b_player_id !== undefined) {
            if(action === "add") {
                setLoadingPack({index: index, action: action})
                handleSelectCreature(creature, action)                
            }
        } else {
            setLoadingPack({index: index, action: action})
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
        else if(action === "select")
            setSearchSelectedCreature(creature);

        setLoadingPack({index: null, action: null})
    };


    return (
        <>
            {displayedItems.length > 0 ? ( displayedItems?.map((item, index) => (
                <li
                    className='listItem'
                    key={item.id + (item?.from === 'dnd_b' ? item.dnd_b_player_id : item.filterDimensions.source)}
                    onClick={(e) => handleSearchSelectCreature(item, "select", e, index)}
                >
                    <div className='searchListCreatureContainer animated-box'>
                        <img className="monsterSearchIcon" src={item.avatarUrl} alt={"list Icon"} />
                        <div className='searchListCreatureDetails'>
                        <strong>{highlightSubstring(searchTerm, item.name)}</strong>
                            <div className='searchCreatureSmallDetails'>
                                {item?.from === 'dnd_b' ? (
                                    <>
                                        <span className='monsterSearchDetailText'>{highlightSubstring(searchTerm, item.type)}</span>
                                        <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, item.dnd_b_player_id)}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className='monsterSearchDetailText'> CR: {item.filterDimensions.level}</span>
                                        <span className='monsterSearchDetailText'> - {highlightSubstring(searchTerm, item.filterDimensions.type.split(' ')[0])}</span>
                                        <span className='monsterSearchDetailText'> - {item.filterDimensions.sourceShort}</span>
                                        {(searchTerm.length >= 4 && alignmentOptions.includes(searchTerm.toLowerCase())) && 
                                            <span className='monsterSearchDetailText' style={{textShadow: '1px 1px 2px gray',}}> 
                                                - <b>{searchTerm.toLowerCase()}</b>
                                            </span>
                                        }
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
                        {item?.dnd_b_player_id && 
                            <button className='encounterCreatureX' style={{left: '5%'}} onClick={() => {
                                setImportedPlayers(prev => prev.filter((_, i) => i !== index))
                            }}>
                                X
                            </button>
                        }
                        <button className='monsterSearchAdd' onClick={(e) => handleSearchSelectCreature(item, "add", e, index)}>
                            ➕
                        </button>
                    </div>
                </li>
            ))) : (
                <div className='searchListCreatureContainer'>No creatures found</div>
            )}
        </>
    );
}

export default SearchTab;
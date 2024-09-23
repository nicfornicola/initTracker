import React, { useState, useEffect } from 'react';
// import data from '../monsterJsons/5eCoreRules.json'; // Adjust the import path as necessary
import {monsterList, imagesAvailable, proxyUrl, generateUniqueId} from '../constants'
import axios from 'axios';
import StatBlock from './StatBlock';
import Open5eToDmBMapper from '../mappers/Open5eToDmBMapper'
import { InfinitySpin } from 'react-loader-spinner'

// Function to get the image URL based on the type
const getImageUrl = (creature) => {
    const wordsArray = creature.filterDimensions.type.split(' ');

    switch (wordsArray[0].toLowerCase()) {
        case "aberration":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/aberration.jpg";
        case "beast":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/beast.jpg";
        case "celestial":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/celestial.jpg";
        case "construct":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/construct.jpg";
        case "dragon":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/dragon.jpg";
        case "elemental":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/elemental.jpg";
        case "fey":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/fey.jpg";
        case "fiend":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/fiend.jpg";
        case "giant":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/giant.jpg";
        case "humanoid":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg";
        case "monstrosity":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/monstrosity.jpg";
        case "ooze":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/ooze.jpg";
        case "plant":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/plant.jpg";
        case "undead":
            return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/undead.jpg";
      default:
        return "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/beast.jpg"; 
    }
}

const SearchList = ({setCurrentEncounter}) => {
    const [searchSelectedCreature, setSearchSelectedCreature] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(15);
    const [filteredItems, setFilteredItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const filtered = monsterList.filter(item => {
                    return item.name.toLowerCase().includes(searchTerm.toLowerCase())
                }
            );

            const promises = filtered.slice(0, itemsToShow).map(async creature => {

                if ('avatarUrl' in creature) {
                    return creature
                } else {
                    let creatureData
                    if(imagesAvailable.includes(creature.filterDimensions.source)) {
                        creatureData = await getCreatureImage(creature.name);
                    } else {
                        let img = getImageUrl(creature)
                        creatureData = {avatarUrl: img, largeAvatarUrl: img}
                    }

                    if('largeAvatarUrl' in creatureData)
                        creature.largeAvatarUrl = creatureData.largeAvatarUrl

                    if('avatarUrl' in creatureData)
                        creature.avatarUrl = creatureData.avatarUrl

                    return creature 
                }
            });
            const displayItems = await Promise.all(promises);

            setFilteredItems(filtered);
            setDisplayedItems(displayItems);
            setLoading(false)

        }
        fetchData();

    }, [searchTerm, itemsToShow]);

    const getCreatureImage = async (name) => {
        try {
            let test = false
            if(test) {
                return {avatarUrl: "https://www.dndbeyond.com/avatars/0/10/636238825974097081.jpeg", largeAvatarUrl: "https://www.dndbeyond.com/avatars/thumbnails/30761/774/400/347/638061093283829548.png"}
            } else {
                const urlName = name.replace(/ /g, '-');
                const url = `${proxyUrl}https://monster-service.dndbeyond.com/v1/Monster?search=${urlName}&take=1`
                const response = await axios.get(url).then(res => {
                    let data = res.data.data
                    if(data.length > 0) {
                        return data[0]
                    }
                    else { 
                        return res
                    }
                })
                return response
            }
            

        } catch (error) {
            console.error('Error fetching filtered creatures:', error);
        }
    };

    const handleSetSearchTerm = (term) => {
        setItemsToShow(term.length <= 1 ? 15 : Math.min(15, filteredItems.length));
        setSearchTerm(term)
    };

    
    // Set the number of list items to 10 more when hit the limit
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop - 2 <= clientHeight) {
            setItemsToShow(prev => Math.min(prev + 15, filteredItems.length));
            e.target.scrollTop -= 10
        }
    };

    // Set the selected creature in search bar on left and gets the data from open5e
    const handleSearchSelectCreature = async (creature, action, event) => {
        event.stopPropagation();

        try {
            let selectedCreature = await axios.get(creature.link).then(res => {
                return Open5eToDmBMapper(res.data, creature.avatarUrl)
            })

            handleAddCreatureToEncounter(selectedCreature, action)

        } catch (error) {
            console.warn(error)
        }  
    };

    const handleAddCreatureToEncounter = (creature, action) => {
        let newCreature = {...creature, guid: generateUniqueId()}

        if(action === "add") {
            setCurrentEncounter(prev => ({...prev, currentEncounterCreatures: [...prev.currentEncounterCreatures, newCreature]}));
        }
        else if(action === "select")
            setSearchSelectedCreature(newCreature);
    };

    return (
        <>
            <div className='column columnBorder'>
                <div className='infoContainer'>
                    <input
                        className='searchBar'
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => handleSetSearchTerm(e.target.value)}
                    />
                    Results Load{loading ? 'ing...' : 'ed: ' + displayedItems.length}
                    <div
                        className='monsterSearch'
                        onScroll={handleScroll}
                    >
                        <ul className='monsterSearchList'>
                            {loading ? 
                            <InfinitySpin
                                visible={true}
                                width="200"
                                ariaLabel="infinity-spin-loading"
                            /> :
                            
                            displayedItems.map((item, index) => (
                                <li
                                    // className='monsterSearchItem animated-label'
                                    className='listItem'
                                    key={item.id + item.filterDimensions.source}
                                    onClick={(e) => handleSearchSelectCreature(item, "select", e)}
                                >
                                    <div className='searchListCreatureContainer animated-box'>
                                        <span>
                                            <img className="monsterSearchIcon" src={item.avatarUrl} alt={"list Icon"} />
                                            {index} {item.name} - <span className='monsterSearchSource'>{item.filterDimensions.sourceShort}</span>
                                        </span>
                                        <button className='monsterSearchAdd' onClick={(e) => handleSearchSelectCreature(item, "add", e)}>
                                            ➕
                                        </button>
                                    </div>
                                    
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='column animated-label'>
            {searchSelectedCreature ? (
                <StatBlock creature={searchSelectedCreature} img={searchSelectedCreature.avatarUrl} closeFunction={() => setSearchSelectedCreature(false)}/>
            ) : (
                <>{'No Search Creature Selected'}</>
            )}
            </div>
            
        </>
    );
}

export default SearchList;
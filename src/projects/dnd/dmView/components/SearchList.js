import React, { useState, useEffect } from 'react';
// import data from '../monsterJsons/5eCoreRules.json'; // Adjust the import path as necessary
import {monsterList, imagesAvailable, proxyUrl} from '../constants'
import axios from 'axios';
import StatBlock from './StatBlock';

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

const SearchList = ({setCurrentEncounterCreatures}) => {
    const [searchSelectedCreature, setSearchSelectedCreature] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(15);
    const [filteredItems, setFilteredItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


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

            // console.log("filtered", filtered.length)
            // console.log("displayItems", displayItems.length)

            setFilteredItems(filtered);
            setDisplayedItems(displayItems);
        }
        fetchData();

    }, [searchTerm, itemsToShow]);

    const getCreatureImage = async (name) => {
        // Replace this with your API call to fetch filtered creatures
        try {

            let test = false
            if(test) {
                return {avatarUrl: "https://www.dndbeyond.com/avatars/0/10/636238825974097081.jpeg", largeAvatarUrl: "https://www.dndbeyond.com/avatars/thumbnails/30761/774/400/347/638061093283829548.png"}
            } else {
                console.log("API")
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
        if(term.length <= 1)
            setItemsToShow(15);
        else {
            setItemsToShow((Math.min(15, filteredItems.length)));
        }
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

    // Sets the selected creature in search bar on left and gets the data from open5e
    const handleSearchSelectCreature = async (creature) => {

        try {
            if('open5e' in creature) {
                handleAddCreatureToEncounter(creature);
            } else {
                const open5eMonster = await axios.get(creature.link).then(res => {
                    creature.open5e = res.data;
                    handleAddCreatureToEncounter(creature)
                    return creature
                })
    
                console.log("Selected:", open5eMonster.id, open5eMonster)
            }

        } catch (error) {
            console.log(error)
        }  
    };

    const handleAddCreatureToEncounter = (creature) => {
        setSearchSelectedCreature(creature);
        setCurrentEncounterCreatures(prev => [...prev, creature]);
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
                    Results Loaded: {displayedItems.length}
                    <div
                        className='monsterSearch'
                        onScroll={handleScroll}
                    >
                        <ul className='monsterSearchList'>
                            {displayedItems.map((item, index) => (
                                <li
                                    className='monsterSearchItem'
                                    key={item.id + item.filterDimensions.source}
                                    onClick={() => handleSearchSelectCreature(item)}
                                >
                                    <span>
                                        <img className="monsterSearchIcon" src={item.avatarUrl} alt={"list Icon"} />
                                        {index} {item.name} - <span className='monsterSearchSource'>{item.filterDimensions.sourceShort}</span>
                                    </span>
                                
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {searchSelectedCreature ? (
                <div className='column animated-box'>
                    <StatBlock creature={searchSelectedCreature.open5e} img={searchSelectedCreature.avatarUrl} closeFunction={() => setSearchSelectedCreature(false)}/>
                </div>
            ) : (
                <div> No Search Creature Selected </div>
            )}
        </>
    );
}

export default SearchList;
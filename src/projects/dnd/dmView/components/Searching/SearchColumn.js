import React, { useState, useEffect } from 'react';
// import data from '../monsterJsons/5eCoreRules.json'; // Adjust the import path as necessary
import {shuffledMonsterList, imagesAvailable, backendUrl, isDev, shuffleArray, sortedMonsterList, reversedMonsterList} from '../../constants'
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner'
import BaseStatBlock from '../Statblock/BaseStatBlock';
import OptionButton from '../EncounterColumn/OptionButton';
import Refresh from '../../pics/icons/refresh.png'
import Asort from '../../pics/icons/Asort.PNG'
import Zsort from '../../pics/icons/Zsort.PNG'
import SearchTab from './SearchTab';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';

// Function to get the image URL based on the type
const getDefaultImages = (creature) => {
    const monsterType = creature.filterDimensions.type.split(' ')[0].toLowerCase();

    switch (monsterType) {
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
const titles = ["Monster Search", "Homebrew", "Imports"]

const SearchColumn = ({setCurrentEncounter, encounterGuid, socket}) => {
    const defaultDisplayNumber = 20;
    const {importedPlayers} = useImportedPlayers();
    const {homebrewList} = useHomebrewProvider();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('shuffle');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchSelectedCreature, setSearchSelectedCreature] = useState(null);

    const [numberOfListItems, setNumberOfListItems] = useState(defaultDisplayNumber);
    const [displayedItems, setDisplayedItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingPack, setLoadingPack] = useState({index: null, action: null});

    console.log("Imported: ", importedPlayers)
    
    useEffect(() => {
        console.log("selectedIndex", titles[selectedIndex], selectedIndex)
        if(!isDev) {
            async function fetchData() {
                let list;
                if(selectedIndex === 0) {
                    if(sortType === "shuffle" || sortType === "reshuffle") {
                        list = shuffleArray(shuffledMonsterList)
                    } else if(sortType === 'A') {
                        list = sortedMonsterList
                    } else if(sortType === 'Z') {
                        list = reversedMonsterList
                    }
                } else if (selectedIndex === 1) {
                    list = homebrewList;
                } else if (selectedIndex === 2) {
                    list = importedPlayers;
                }
    
                const filtered = list.filter(item => {
                        let searchValue = searchTerm.toLowerCase()
                        if(selectedIndex === 0 || selectedIndex === 1)
                            return item.searchHint.toLowerCase().includes(searchValue) || item.filterDimensions.level === searchValue
                        else {
                            console.log(typeof searchValue)
                            console.log(searchValue)

                            console.log(typeof item.dnd_b_player_id)
                            console.log(item.dnd_b_player_id)

                            return [item.name.toLowerCase(), item.type.toLowerCase(), item.dnd_b_player_id.toLowerCase()]
                                .every(x => x.includes(searchValue))
                        }
                    }).slice(0, numberOfListItems);
                
                // Homebrew and Import do not need avatarUrls because they comes from the Dmb database
                if(selectedIndex === 0) {
                    const promises = filtered.map(async creature => {
                        if ('avatarUrl' in creature) {
                            return creature
                        } else {
                            let creatureData = imagesAvailable.includes(creature.filterDimensions.source)
                                ? await getDndBMonsterData(creature.name)
                                : {avatarUrl: getDefaultImages(creature)}
                            
                            if('avatarUrl' in creatureData)
                                creature.avatarUrl = creatureData.avatarUrl
        
                            return creature 
                        }
                    });

                    setDisplayedItems(await Promise.all(promises));
                }

                console.log("setLoading(false)")
                setLoading(false)
            }
    
            fetchData();
        }
    }, [searchTerm, numberOfListItems, sortType, selectedIndex]);

    const shuffleSearchList = () => {
        setLoading(true)
        setSortType(prev => prev === 'shuffle' ? 'reshuffle' : 'shuffle')
    }

    const sortSearchList = () => {
        if(sortType === "shuffle" || sortType === "reshuffle") {
            setSortType('A')
        } else if(sortType === "A") {
            setSortType('Z')
        } else {
            setSortType('A')
        }

        setLoading(true)
    }

    const getDndBMonsterData = async (name) => {
        try {
            const urlName = name.replace(/ /g, '-');
            const url = `${backendUrl}/dndb_get_monster_image/${urlName}`;

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

        } catch (error) {
            console.error('Error fetching filtered creatures:', error);
        }
    };

    const handleSetSearchTerm = (term) => {
        setSearchTerm(term)
    };

    
    // Set the number of list items to 10 more when hit the limit
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop - 2 <= clientHeight) {
            setNumberOfListItems(loading ? displayedItems.length : displayedItems.length+defaultDisplayNumber);
            e.target.scrollTop -= 10
        }
    };

    let sortMessage = sortType === "shuffle" || sortType === "reshuffle" || sortType === "Z" ? "Sort A-Z" : "Sort Z-A"

    return (
        <>
            <div className='column columnBorder'>
                <div className='infoContainer'>
                    <Tabs onSelect={(index) => {setLoading(true); setSelectedIndex(index)}} forceRenderTabPanel={true}>
                        <TabList>
                            <Tab>Search</Tab>
                            <Tab>Homebrew</Tab>
                            <Tab>Import</Tab>
                        </TabList>
                        <h3 className='titleFontFamily' style={{borderBottom: '1px solid #822000'}}>{titles[selectedIndex]}</h3>
                        <div className='encounterControlsContainer'>
                            <div className='searchInputFlex'>
                                <input
                                    className='searchBar'
                                    type="text"
                                    placeholder="Search by name, CR, type or alignment..."
                                    value={searchTerm}
                                    onChange={(e) => handleSetSearchTerm(e.target.value)}
                                />
                                <OptionButton src={sortType === "shuffle" || sortType === "reshuffle" || sortType === "Z" ? Asort : Zsort} message={sortMessage} onClickFunction={sortSearchList} wrapperClassName='searchListOption'/>
                                <OptionButton src={Refresh} message={'Shuffle List'} onClickFunction={shuffleSearchList} wrapperClassName='searchListOption' imgClassName={loading ? 'spinningImage' : ''}/>
                            </div>
                            {sortType.includes('shuffle') && 'Random '}Monsters Load{loading ? 'ing...' : 'ed: ' + displayedItems.length}
                        </div>
                        {loading ? (
                            <>
                                <TabPanel>
                                    <InfinitySpin visible={true} width="200" ariaLabel="infinity-spin-loading" />                      
                                </TabPanel>
                                <TabPanel>
                                    <InfinitySpin visible={true} width="200" ariaLabel="infinity-spin-loading" />                      
                                </TabPanel>
                                <TabPanel>
                                    <InfinitySpin visible={true} width="200" ariaLabel="infinity-spin-loading" />                      
                                </TabPanel>
                            </>
                        ) : ( 
                            <div className='monsterSearch' onScroll={handleScroll}>
                                <ul className='monsterSearchList'>
                                    <TabPanel>
                                        <SearchTab displayedItems={displayedItems}  setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} searchTerm={searchTerm} setSearchSelectedCreature={setSearchSelectedCreature} loadingPack={loadingPack} setLoadingPack={setLoadingPack} socket={socket}/>
                                    </TabPanel>
                                    <TabPanel>
                                        <SearchTab displayedItems={homebrewList}  setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} searchTerm={searchTerm} setSearchSelectedCreature={setSearchSelectedCreature} loadingPack={loadingPack} setLoadingPack={setLoadingPack} socket={socket}/>
                                    </TabPanel>
                                    <TabPanel>
                                        <SearchTab displayedItems={importedPlayers}  setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} searchTerm={searchTerm} setSearchSelectedCreature={setSearchSelectedCreature} loadingPack={loadingPack} setLoadingPack={setLoadingPack} socket={socket}/>
                                    </TabPanel>
                                </ul>
                            </div>
                        )}
                    </Tabs>
                </div>
            </div>
            <div className='column animated-label'>
            {(searchSelectedCreature || (loadingPack.index && loadingPack.action === 'select')) ? (
                <BaseStatBlock creature={searchSelectedCreature} closeStatBlock={() => setSearchSelectedCreature(null)} loading={loadingPack.index && loadingPack.action === 'select'}/>
            ) : (
                <>{'No Search Creature Selected'}</>
            )}
            </div>
            
        </>
    );
}

export default SearchColumn;
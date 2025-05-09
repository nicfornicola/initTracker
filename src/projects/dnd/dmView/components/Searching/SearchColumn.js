import React, { useState, useEffect } from 'react';
import {shuffledMonsterList, backendUrl, isDev, shuffleArray, sortedMonsterList, reversedMonsterList, homebrewTemplate, generateUniqueId} from '../../constants'
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner'
import StatBlock from '../Statblock/StatBlock';
import OptionButton from '../EncounterColumn/OptionButton';
import Refresh from '../../pics/icons/refresh.png'
import Asort from '../../pics/icons/Asort.PNG'
import Zsort from '../../pics/icons/Zsort.PNG'
import SearchTab from './SearchTab';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';
import InputCharacterId from '../SideMenu/InputCharacterId';
import InputEncounterId from '../SideMenu/InputEncounterId';
import magPlus from '../../pics/icons/magPlus.PNG'


// Function to get the image URL based on the type
const getDefaultImages = (creature) => {
    const monsterType = creature.creature_type;

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
const panels = Array(3).fill(null); // Creates an array with 3 elements

const SearchColumn = ({setCurrentEncounter, encounterGuid, handleUploadMonsterImage, uploadIconCreature, socket}) => {
    const defaultDisplayNumber = 20;
    const {importedPlayers} = useImportedPlayers();
    const {homebrewList} = useHomebrewProvider();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('shuffle');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchSelectedCreature, setSearchSelectedCreature] = useState(null);
    const [searchSelectedEncounter, setSearchSelectedEncounter] = useState({encounterName: "search", creatures: []});

    const [numberOfListItems, setNumberOfListItems] = useState(defaultDisplayNumber);
    const [displayedItems, setDisplayedItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingPack, setLoadingPack] = useState({index: null, action: null, searchingFor: null});

    const [error, setError] = useState(0);

    useEffect(() => {
        if(error !== 0) {
            setTimeout(() => {
                setError(0)
            }, 30000)
        }
    }, [error]);

    useEffect(() => {
        if(uploadIconCreature && uploadIconCreature.column === 'search') {
            setSearchSelectedCreature(uploadIconCreature)
        }
    }, [uploadIconCreature]);

    useEffect(() => {
        if(searchSelectedCreature) {
            homebrewList.forEach(creature => {
                if (searchSelectedCreature.dmb_homebrew_guid === creature.dmb_homebrew_guid || searchSelectedCreature.creatureGuid === creature.creatureGuid) {
                    setSearchSelectedCreature(creature)
                }
            });
        }
    }, [homebrewList]);

    useEffect(() => {
        if(searchSelectedCreature) {
            let encounterName = searchSelectedCreature.name === 'Homebrew Template' ? 'dmbuddy_newhomebrew' : 'dmbuddy_selected'
            let searchEncounter = {encounterName: encounterName, creatures: [{...searchSelectedCreature, creatureGuid: searchSelectedCreature.creatureGuid ?? generateUniqueId()}]}
            setSearchSelectedEncounter(searchEncounter)
        } else {
            setSearchSelectedEncounter(null)
        }
    }, [searchSelectedCreature]);
    
    useEffect(() => {
        if(!isDev) {
            async function fetchData() {
                let list;
                if(selectedIndex === 0) {
                    if(sortType === "shuffle" || sortType === "reshuffle") {
                        list = shuffledMonsterList
                    } else if(sortType === 'A') {
                        list = sortedMonsterList
                    } else if(sortType === 'Z') {
                        list = reversedMonsterList
                    }
                } else if (selectedIndex === 1) {
                    list = homebrewList;
                } else if (selectedIndex === 2) {
                    const sortedByCampaign = importedPlayers.sort((a, b) => {
                        const campaignA = a.campaign || ""; // Default to empty string if null/undefined
                        const campaignB = b.campaign || ""; // Default to empty string if null/undefined
                        return campaignA.localeCompare(campaignB);
                    });
                    list = sortedByCampaign;
                }

                const filtered = list.filter(item => {
                        let searchValue = searchTerm.toLowerCase()
                        return (selectedIndex === 0)
                            ? [item?.name, item?.creature_type, item?.subtype, item?.creature_alignment].map(x => (x || '').toLowerCase()).some(x => x.includes(searchValue)) || item?.challenge_rating === searchValue
                            : [item?.name, item?.type, item?.dnd_b_player_id].map(x => (x || '').toLowerCase()).some(x => x.includes(searchValue));

                    }).slice(0, numberOfListItems);

                // Homebrew and Import do not need avatarUrls because they come from the Dmb database
                if(selectedIndex === 0) {
                    const promises = filtered.map(async creature => {
                        if (creature.avatarUrl !== null ) {
                            return creature
                        } else {
                            let creatureData = await getDndBMonsterData(creature.name)
                            creature.avatarUrl = creatureData.avatarUrl ?? getDefaultImages(creature)

                            return creature 
                        }
                    });

                    setDisplayedItems(await Promise.all(promises));
                } else {
                    setDisplayedItems(filtered)
                }

                setLoading(false)
            }

            // Debounce delay of 200ms to before doing any filtering to allow for more accurate filtering and less renders
            const timeoutId = setTimeout(() => {
                fetchData();
            }, 200); 

            return () => clearTimeout(timeoutId); // Cleanup timeout
        }
    }, [searchTerm, numberOfListItems, sortType, selectedIndex, importedPlayers, homebrewList]);

    const addNewHomebrew = () => {
        let newHomebrew = {...homebrewTemplate, creatureGuid: generateUniqueId()}
        setSearchSelectedCreature(newHomebrew)
    }

    const shuffleSearchList = () => {
        setLoading(true)
        // This shuffle the shuffledMonsterList and then inside the useeffect it is set to displayedItems
        shuffleArray(shuffledMonsterList)
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
                return data.length > 0 ? data[0] : res
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
        if (scrollHeight - scrollTop - (clientHeight/4) <= clientHeight) {
            setNumberOfListItems(loading ? displayedItems.length : displayedItems.length+defaultDisplayNumber);
        }
    };

    const handleTabSelect = (index) => {
        if(index !== selectedIndex) {
            setLoading(true); 
            setSelectedIndex(index)
            setSearchTerm("")
        }
    }

    let sortMessage = sortType === "shuffle" || sortType === "reshuffle" || sortType === "Z" ? "Sort A-Z" : "Sort Z-A"
    let showStatBlock = (searchSelectedCreature && searchSelectedEncounter?.creatures.length > 0) || ((!isNaN(loadingPack.index) && loadingPack.action === 'select'))

    let widthType = ''; 
    if(!showStatBlock) {
        widthType = '45%'
    }

    return (
        <>
            <div className='column columnBorder' style={{width: widthType}}>
                <div className='infoContainer'>
                    <Tabs onSelect={(index) => handleTabSelect(index)} forceRenderTabPanel={true}>
                        <TabList>
                            <Tab>Search</Tab>
                            <Tab>Homebrew</Tab>
                            <Tab>DndBeyond Imports</Tab>
                        </TabList>
                        <h3 className='titleFontFamily' style={{borderBottom: '1px solid #822000'}}>{titles[selectedIndex]}</h3>
                        {selectedIndex === 2 && 
                            <div className='importInputsContainer'>
                                <div className='importInputs editHpGrow'>
                                    <InputCharacterId setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} setError={setError} socket={socket} />
                                    <InputEncounterId setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} setError={setError} socket={socket} />
                                </div>
                                <details >
                                    <summary>Import Help</summary>
                                    <div className='importErrorContainer'>
                                        <ul className='howToImportList'>
                                            <li className='importErrorMsg'>Character and Encounters ID's can be found in your DndBeyond Url i.e.</li>
                                            <ul>
                                                <li className='importErrorMsgLink'>Character ID - <i>https://www.dndbeyond.com/characters/</i><b>44429861</b></li>
                                                <li className='importErrorMsgLink'>Encounter ID - <i>https://www.dndbeyond.com/encounters/</i><b>ed9784fc-5aba-473a-9ae9-166fed396e8e</b></li>
                                            </ul>
                                            <li className='importErrorMsg'>DmBuddy will try to import all PC's in the same campaign as the imported players</li>
                                            <li className='importErrorMsg'>Import multiple players with a comma seperated list i.e. <b>12345678,9817263,19203912</b></li>
                                            <li className='importErrorMsg'>Importing Encounters will only get the players. Try adding monsters/NPC's from the search list</li>
                                        </ul>
                                        
                                    </div>
                                </details>
                            </div>
                        }
                        
                        <div className='encounterControlsContainer'>
                            <div className='searchInputFlex'>
                                <input
                                    className='searchBar'
                                    type="text"
                                    placeholder="Search by name, CR, type or alignment..."
                                    value={searchTerm}
                                    onChange={(e) => handleSetSearchTerm(e.target.value)}
                                />
                                {selectedIndex !== 2 && 
                                    <OptionButton src={magPlus} message={'Create New Homebrew'} onClickFunction={addNewHomebrew} wrapperClassName='searchListOption'/>
                                }

                                <OptionButton src={sortType === "shuffle" || sortType === "reshuffle" || sortType === "Z" ? Asort : Zsort} message={sortMessage} onClickFunction={sortSearchList} wrapperClassName='searchListOption'/>
                                <OptionButton src={Refresh} message={'Shuffle List'} onClickFunction={shuffleSearchList} wrapperClassName='searchListOption' imgClassName={loading ? 'spinningImage' : ''}/>
                            </div>
                            {sortType.includes('shuffle') && 'Random '}Monsters Load{loading ? 'ing...' : 'ed: ' + displayedItems.length}
                        </div>
                        {loading ? (
                            <>
                                {panels.map((_, index) => (
                                    <TabPanel key={titles[index] + "spinner"}>
                                        <InfinitySpin visible={true} width="200" ariaLabel="infinity-spin-loading" />                      
                                    </TabPanel>
                                ))}
                            </>
                        ) : ( 
                            <div className='monsterSearch' style={{height: selectedIndex === 2 ? '72.4%' : '81%' }} onScroll={handleScroll}>
                                <ul className='monsterSearchList'>
                                    {panels.map((_, index) => (
                                        <TabPanel key={titles[index]}>
                                            <SearchTab displayedItems={displayedItems} setCurrentEncounter={setCurrentEncounter} encounterGuid={encounterGuid} searchTerm={searchTerm} setSearchSelectedCreature={setSearchSelectedCreature} loadingPack={loadingPack} setLoadingPack={setLoadingPack} socket={socket} />
                                        </TabPanel>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Tabs>
                </div>
            </div>
            {showStatBlock && 
                <div className='column grow'>
                    <div className='statBlock'>
                        <StatBlock selectedIndex={0} currentEncounter={searchSelectedEncounter} setCurrentEncounter={setSearchSelectedEncounter} closeStatBlock={() => setSearchSelectedCreature(null)} loading={!isNaN(loadingPack.index) && loadingPack.action === 'select'} searchingFor={loadingPack.searchingFor} handleUploadMonsterImage={handleUploadMonsterImage}/>
                    </div>
                </div>
            }
        </>
    );
}

export default SearchColumn;
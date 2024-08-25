import React, { useState, useEffect, useRef } from 'react';
import EncounterListItem from './EncounterListItem'
import EncounterListItemDB from './EncounterListItemDB'

const EncounterList = ({handleSaveEncounter, handleUploadMonsterImage, setCurrentEncounterCreatures, currentEncounterCreatures, encounterSelectedCreature, setEncounterSelectedCreature, clickEncounterCreatureX}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [listSizeRect, setListSizeRect] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if(listRef.current) {
                setScrollPosition(listRef.current.scrollTop)
            }
        };

        const listElement = listRef.current;
        if(listElement) {
            listElement.addEventListener('scroll', handleScroll)
            const rect = listRef.current.getBoundingClientRect()
            setListSizeRect(rect)
        } 

        return () => {
            if(listElement) {
                listElement.removeEventListener('scroll', handleScroll)
            }
        };
    }, [])

    const resort = () => {
        currentEncounterCreatures.sort((a, b) =>  b.open5e.initiative - a.open5e.initiative);
        setCurrentEncounterCreatures([...currentEncounterCreatures]);
        setPlayerViewOnCreatureChange()
    }

    const setPlayerViewOnCreatureChange = () => {
        console.log("SAVED from list")
        handleSaveEncounter()
    }

    useEffect(() => {
        setPlayerViewOnCreatureChange()
    }, [currentEncounterCreatures])

    return (
        <div className='encounterCreaturesList' ref={listRef}>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                creatureListItem.open5e !== undefined ?
                    <EncounterListItem key={creatureListItem.guid + index} index={index} setCurrentEncounterCreatures={setCurrentEncounterCreatures} listSizeRect={listSizeRect} scrollPosition={scrollPosition} handleUploadMonsterImage={handleUploadMonsterImage} resort={resort} setPlayerViewOnCreatureChange={setPlayerViewOnCreatureChange} creatureListItem={creatureListItem} encounterSelectedCreature={encounterSelectedCreature} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX}/>
                    :
                    <EncounterListItemDB key={creatureListItem.guid + index} index={index} handleUploadMonsterImage={handleUploadMonsterImage} setPlayerViewOnCreatureChange={setPlayerViewOnCreatureChange} creatureListItem={creatureListItem} setEncounterSelectedCreature={setEncounterSelectedCreature} clickEncounterCreatureX={clickEncounterCreatureX} resort={resort}/>
                
            ))}
        </div>
  );
}

export default EncounterList;
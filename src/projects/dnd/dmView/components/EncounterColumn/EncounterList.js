import React, { useState, useEffect, useRef } from 'react';
import EncounterListItem from './EncounterListItem'
import {sortCreatureArray, INIT_ENCOUNTER_NAME} from '../../constants'

const EncounterList = ({currentEncounter, setCurrentEncounter, handleSaveEncounter, turnNum, handleUploadMonsterImage, setSelectedIndex, clickEncounterCreatureX, socket}) => {
    const [currentEncounterCreatures, setCurrentEncounterCreatures] = useState(currentEncounter.creatures);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [listSizeRect, setListSizeRect] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        setCurrentEncounterCreatures([...currentEncounter.creatures])
    }, [currentEncounter.creatures])

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

    const resort = (c) => {
        const updatedCreatures = currentEncounterCreatures.map(creature =>
            creature.creatureGuid === c.creatureGuid ? c : creature
        );
        setCurrentEncounter(prev => ({...prev, creatures: [...sortCreatureArray(updatedCreatures)]}));
    }

    const setPlayerViewOnCreatureChange = () => {
        if(currentEncounter.encounterName !== INIT_ENCOUNTER_NAME) {
            handleSaveEncounter()
        }
    }

    useEffect(() => {
        setPlayerViewOnCreatureChange()
        // eslint-disable-next-line
    }, [currentEncounterCreatures])

    return (
        <div className='encounterCreaturesList' ref={listRef}>
            {currentEncounterCreatures.map((creatureListItem, index) => (
                <EncounterListItem key={creatureListItem.creatureGuid + index} creatureListItem={creatureListItem} setCurrentEncounter={setCurrentEncounter} index={index} isTurn={index+1 === turnNum} listSizeRect={listSizeRect} scrollPosition={scrollPosition} handleUploadMonsterImage={handleUploadMonsterImage} resort={resort} setPlayerViewOnCreatureChange={setPlayerViewOnCreatureChange} setSelectedIndex={setSelectedIndex} clickEncounterCreatureX={clickEncounterCreatureX} socket={socket}/>
            ))}
        </div>
    );
}

export default EncounterList;
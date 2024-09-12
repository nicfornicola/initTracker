import axios from 'axios';
import { proxyUrl } from '../constants';
import DndBCharacterToDmBMapper from '../mappers/DndBMonsterToDmBMapper';

export const ImportDndBeyondMonsters = async (encounterMonsters) => {

    // Filter objects where type === 'monster'    
    const urlIds = [...new Set(encounterMonsters.map(monster => `ids=${monster.id}&`))].join('');
    const url = `${proxyUrl}https://monster-service.dndbeyond.com/v1/Monster?${urlIds}`; 

    let monstersRes = {}
    let mappedMonsters = []
    try {
        console.log("Monster-service - ImportDndBeyondMonsters - monster avatar urls")
        const response = await axios.get(url, { 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false, // Include credentials if needed
        });
        monstersRes = response.data.data;
        console.log("?", monstersRes)
        encounterMonsters.forEach(encounterMonster => {
            const foundMonsterRes = monstersRes.find(monster => monster.id === encounterMonster.id);

            if (foundMonsterRes) {
                mappedMonsters.push(DndBCharacterToDmBMapper(foundMonsterRes, encounterMonster));
            }
        });


    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
    const allSettledResponses = await Promise.allSettled(mappedMonsters);
    // Filter out the null or failed results and only return the successful ones
    const successfulResponses = allSettledResponses
        .filter(result => result.status === "fulfilled" && result.value !== null)
        .map(result => result.value);
    console.log(successfulResponses)

    return successfulResponses

};


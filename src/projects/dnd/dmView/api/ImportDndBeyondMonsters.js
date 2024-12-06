import axios from 'axios';
import { backendUrl } from '../constants';
import DndBCharacterToDmBMapper from '../mappers/DndBMonsterToDmBMapper';

export const ImportDndBeyondMonsters = async (encounterMonsters, encounterGuid) => {

    // Filter objects where type === 'monster'    
    const urlIds = [...new Set(encounterMonsters.map(monster => `ids=${monster.id}&`))].join('');

    if(urlIds === '') {
        console.log("No non-charters imports...")
        return []
    } else {
        const url = `${backendUrl}/dndb_monster_import/${urlIds}`;
    
        let monstersRes = {}
        let mappedMonsters = []
        try {
            console.log("Monster-service - ImportDndBeyondMonsters - monster avatar urls")
            const response = await axios.get(url, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                withCredentials: false,
            });
            monstersRes = response.data.data;
            encounterMonsters.forEach(encounterMonster => {
                const foundMonsterRes = monstersRes.find(monster => monster.id === encounterMonster.id);
                mappedMonsters.push(DndBCharacterToDmBMapper(foundMonsterRes, encounterMonster, encounterGuid));
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
    
        return successfulResponses
    }
};


import axios from 'axios';
import { getMaxHp } from './getMaxHp';
import { proxyUrl } from '../constants';

export const getCharacterStats = async (playerIds) => {
    console.log("Character-service in getCharacterStats - playerHP", playerIds)

    let i = 1;
    try {
        const baseUrl = `${proxyUrl}https://character-service.dndbeyond.com/character/v5/character/`;
        const promises = playerIds.map(async (playerId) => {
            try {
                
                if(playerId.includes("dnd_b"))
                    playerId = playerId.match(/\d+/g);         

                const url = `${baseUrl}${playerId}`;
                const response = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: false,
                });

                const resData = response.data.data;
                let maxHp = getMaxHp(resData); // Ensure getMaxHp is used correctly

                console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved")
                i++;
                let exLvl = resData.conditions.find(obj => obj.id === 4)
                return {
                    status: response.status,
                    id: resData.id.toString(),
                    maxHp: maxHp,
                    maxHpBonus: resData.bonusHitPoints,
                    maxHpOverride: resData.overrideHitPoints,
                    removedHp: resData.removedHitPoints,
                    tempHp: resData.temporaryHitPoints,
                    exhaustionLvl: exLvl ? exLvl.level : 0,
                    deathSaves: resData.deathSaves,
                    avatarUrl: resData.decorations.avatarUrl,
                    name: resData.name
                };
            } catch (error) {
                if (error.response && (error.response.status === 404 || error.response.status === 403)) {
                    console.log(i.toString() + "/" + playerIds.length)
                    i++;
                    return {
                        status: error.response.status,
                        id: playerId.toString(), // Use playerId directly from map function
                        maxHp: null,
                        maxHpBonus: null,
                        maxHpOverride: null,
                        removedHp: null,
                        tempHp: null,
                        exhaustionLvl: 0,
                        deathSaves: null
                    };
                }
                // Throw error to be caught by the outer catch block if needed
                throw error;
            }
        });

        const allResponses = await Promise.all(promises);
        return allResponses;
    } catch (error) {
        console.error("Error in getCharacterStats:", error.message);
        // Handle other errors if needed
        throw error; // Re-throw error for handling elsewhere if necessary
    }
};

export default getCharacterStats;
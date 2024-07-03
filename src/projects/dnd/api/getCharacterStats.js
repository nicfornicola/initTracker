import axios from 'axios';
import { getMaxHp } from './getMaxHp';
import { proxyUrl } from '../constants';

export const getCharacterStats = async (data) => {
    const playerIds = data.map(player => player.id);
    let i = 1;
    try {
        const baseUrl = `${proxyUrl}https://character-service.dndbeyond.com/character/v5/character/`;
        const promises = playerIds.map(async (playerId) => {
            try {
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
                if (resData.bonusHitPoints) {
                    maxHp += resData.bonusHp
                }
                console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved")
                i++;
                return {
                    status: response.status,
                    id: resData.id.toString(),
                    maxHp: maxHp,
                    bonusHp: resData.bonusHitPoints,
                    overrideHp: resData.overrideHitPoints,
                    removedHp: resData.removedHitPoints,
                    tempHp: resData.temporaryHitPoints,
                };
            } catch (error) {
                if (error.response && (error.response.status === 404 || error.response.status === 403)) {
                    console.log(i.toString() + "/" + playerIds.length)
                    i++;
                    return {
                        status: error.response.status,
                        id: playerId.toString(), // Use playerId directly from map function
                        maxHp: null,
                        bonusHp: null,
                        overrideHp: null,
                        removedHp: null,
                        tempHp: null,
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
import axios from 'axios';
import { getMaxHp } from '../../playerView/api/getMaxHp';
import { proxyUrl, generateUniqueId } from '../constants';

import ChampionImage from '../../playerView/pics/icons/refreshPlayers.png'

export const ImportDndBeyondCharacters = async (playerIds) => {
    console.log("Import Character-service in ImportDndBeyondCharacters")

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

                console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved")
                i++;
                let exLvl = resData.conditions.find(obj => obj.id === 4)
                return {
                    avatarUrl: resData.decorations.avatarUrl,
                    guid: generateUniqueId(),
                    link: "",
                    id: playerId.toString(), 
                    name: resData.name, 
                    path: "", 
                    searchHint: "",
                    from: "dnd_b",
                    dnd_b: {
                        type: "player",
                        name: resData.name, // Use playerId directly from map function
                        status: response.status,
                        id: playerId.toString(), 
                        hit_points: maxHp,
                        hit_points_current: maxHp - resData.removedHitPoints,
                        maxHpBonus: resData.bonusHitPoints,
                        maxHpOverride: resData.overrideHitPoints,
                        removedHp: resData.removedHitPoints,
                        hit_points_temp: resData.temporaryHitPoints,
                        exhaustionLvl: exLvl ? exLvl.level : 0,
                        deathSaves: resData.deathSaves,
                        initiative: 0
                    }
                };
            } catch (error) {
                if (error.response && (error.response.status === 404 || error.response.status === 403)) {
                    console.log(i.toString() + "/" + playerIds.length)
                    i++;
                    return {
                        type: "player",
                        avatarUrl: ChampionImage,
                        guid: generateUniqueId(),
                        link: "",
                        id: "dnd_b-notFound", // Use playerId directly from map function
                        name:  playerId.toString() + " Not Found", // Use playerId directly from map function
                        path: "", // Use playerId directly from map function
                        searchHint: "", // Use playerId directly from map function
                        dnd_b: {
                            status: error.response.status,
                            id: playerId.toString(), // Use playerId directly from map function
                            maxHp: 0,
                            maxHpBonus: 0,
                            maxHpOverride: 0,
                            removedHp: 0,
                            tempHp: 0,
                            exhaustionLvl: 0,
                            deathSaves: 0,
                            initiative: 0
                        }
                    };
                }
                // Throw error to be caught by the outer catch block if needed
                throw error;
            }
        });

        const allResponses = await Promise.all(promises);
        return allResponses;
    } catch (error) {
        console.error("Error in ImportDndBeyondCharacter:", error.message);
        // Handle other errors if needed
        throw error; // Re-throw error for handling elsewhere if necessary
    }
};

export default ImportDndBeyondCharacters;
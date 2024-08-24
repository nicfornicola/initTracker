import axios from 'axios';
import { getMaxHp } from '../../playerView/api/getMaxHp';
import { proxyUrl, generateUniqueId } from '../constants';

export const ImportDndBeyondCharacters = async (playerIds) => {
    console.log("Import Character-service in ImportDndBeyondCharacters");
    let i = 1;
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
            let maxHp = getMaxHp(resData);

            console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved");
            i++;
            let exLvl = resData.conditions.find(obj => obj.id === 4);
            return {
                avatarUrl: resData.decorations.avatarUrl || 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg',
                guid: generateUniqueId(),
                link: "",
                id: playerId.toString(),
                name: resData.name,
                path: "",
                searchHint: "",
                from: "dnd_b",
                dnd_b: {
                    type: "player",
                    name: resData.name,
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
            console.log(i.toString() + "/" + playerIds.length);
            i++;
            if (error.response) {
                if (error.response.status === 404) {
                    alert(`Could not find ID: '${playerId}' \n\nDnd Beyond Error: ${error.response.status}`);
                } else if (error.response.status === 403) {
                    alert(`Not Authorized for ID: ${playerId}`);
                }
            }
            return null; // Return null for failed requests
        }
    });

    const allSettledResponses = await Promise.allSettled(promises);

    // Filter out the null or failed results and only return the successful ones
    const successfulResponses = allSettledResponses
        .filter(result => result.status === "fulfilled" && result.value !== null)
        .map(result => result.value);

    return successfulResponses;
};

export default ImportDndBeyondCharacters;
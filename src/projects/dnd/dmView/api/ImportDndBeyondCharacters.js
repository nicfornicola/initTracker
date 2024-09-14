import axios from 'axios';
import { getSkillDetails } from '../../playerView/api/getSkillDetails';
import { proxyUrl } from '../constants';
import DndBCharacterToDmBMapper from '../mappers/DndBCharacterToDmBMapper'
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
            console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved! (" + playerId +")");
            i++;
            let skillDetails = getSkillDetails(resData)
            return DndBCharacterToDmBMapper(resData, skillDetails)
        } catch (error) {
            console.log(i.toString() + "/" + playerIds.length + " failed! (" + playerId +")");
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
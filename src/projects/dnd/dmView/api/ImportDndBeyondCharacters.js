import axios from 'axios';
import { getSkillDetails } from '../../playerView/api/getSkillDetails';
import { backendUrl } from '../constants';
import DndBCharacterToDmBMapper from '../mappers/DndBCharacterToDmBMapper'

export const ImportDndBeyondCharacters = async (playerIds, encounterGuid, encounterPlayerData=undefined) => {
    console.log("Import Character-service in ImportDndBeyondCharacters");
    let i = 1;
    const baseUrl = `${backendUrl}/dndb_character_import`;
    
    const promises = playerIds.map(async (playerId) => {
        try {
            const url = `${baseUrl}/${playerId}`;

            const response = await axios.get(url, {});
            const resData = response.data.data;
            console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved! (" + playerId +")");
            i++;
            let skillDetails = getSkillDetails(resData)
            return DndBCharacterToDmBMapper(resData, encounterGuid, skillDetails)
        } catch (error) {
            console.log(i.toString() + "/" + playerIds.length + " failed! (" + playerId +")");
            console.log(error)
            i++;
            if (error.response) {
                if (error.response.status === 404) {
                    alert(`Could not find ID: '${playerId}' \n\nDnd Beyond Error: ${error.response.status}`);
                } else if (error.response.status === 403) {
                    if(encounterPlayerData) {
                        const encounterPlayerInfo = encounterPlayerData.find(player => player.id === playerId);
                        return DndBCharacterToDmBMapper(encounterPlayerInfo);
                    } else {
                        alert(`Not Authorized for ID: ${playerId}\n\nSet privacy to public in DndBeyond to see player details`);
                    }
                }
            }
            return null
        }
    });
   

    const allSettledResponses = await Promise.allSettled(promises);

    const privatePlayers = allSettledResponses
        .filter(player => player.status === 'fulfilled' && player.value.status === 403)
        .map(player => player.value);
        
    if (privatePlayers.length > 0) {
        let resultString = '';
        
        privatePlayers.forEach(playerInfo => {
            resultString += playerInfo.name + ' (' + playerInfo.dnd_b_player_id + ')  |  ';
        });
        
        // Alert message with the result string
        alert('❗❗ ACTION RECOMMENDED - SCROLL FOR FIX❗❗\n' +
            'Dnd Beyond Privacy setting is set to Private for these characters...\n===========================\n' +
            resultString +
            '\n===========================\n' + 
            'HOW TO FIX: [Dnd_Beyond] -> [Go To Character] -> [Edit] -> [⚙️Home tab] -> [Character Privacy] -> [Privacy: Public]\n\n' +
            'You won’t be able to get HP, Avatar or other fun stuff until your players switch to Privacy: Public in their DnD Beyond settings\n\n');
            
    }

    // Filter out the null or failed results and only return the successful ones
    const successfulResponses = allSettledResponses
        .filter(result => result.status === "fulfilled" && result.value !== null)
        .map(result => result.value);

    return successfulResponses;
};

export default ImportDndBeyondCharacters;
import axios from 'axios';
import { getSkillDetails } from '../../playerView/api/getSkillDetails';
import { backendUrl, dummyDefault, COLOR_GREEN, generateUniqueId } from '../constants';
import DndBCharacterToDmBMapper from '../mappers/DndBCharacterToDmBMapper'

export const ImportDndBeyondCharacters = async (playerIds, encounterGuid, players=undefined, username=undefined, playerNames=undefined) => {
    
    console.log("Import Character-service in ImportDndBeyondCharacters");
    let i = 1;
    const baseUrl = `${backendUrl}/dndb_character_import`;
    let campaignName = null;
    const promises = playerIds.map(async (playerId) => {
        if(playerId.startsWith("preset")) {
            let newDummy = {
                ...dummyDefault,
                avatarUrl:  "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg",
                name: "Preset Player",
                alignment: "ally",
                border: COLOR_GREEN,
                type: "player",
                deathSaves: {
                    "failCount": 0,
                    "successCount": 0,
                    "isStabilized": true
                },
                creatureGuid: generateUniqueId(),
                encounterGuid: encounterGuid,
                dnd_b_player_id: 'preset',
                from: 'dnd_b',
                status: 200,
            }
            return newDummy
        } else {
            try {
                let url = `${baseUrl}/${playerId}`;
                if(username) {
                    url += `/${username}`
                }
                const response = await axios.get(url, {});
                const resData = response.data.data;

                // Get this to attach to unauthorized players also 
                if(resData.campaign.name) {
                    campaignName = resData.campaign.name
                }

                let skillDetails = getSkillDetails(resData)

                let mappedCharacter = DndBCharacterToDmBMapper(resData, encounterGuid, skillDetails)
                console.log(i.toString() + "/" + playerIds.length + " " + resData.name + " retrieved! (" + playerId +")");
                i++;
                return mappedCharacter
            } catch (error) {
                console.log(i.toString() + "/" + playerIds.length + " failed! (" + playerId +")");
                i++;

                if (error?.response.status === 404) {
                    alert(`Could not find ID: '${playerId}' \n\nDnd Beyond Error: ${error.response.status}`);
                } else if (error.response.status === 403 || error.response.status === 500) {
                    // This data is from an encounter so we can still create them as a dummy for refresh later 
                    if(players) {
                        const encounterPlayerInfo = players.find(player => player.id === playerId);
                        return DndBCharacterToDmBMapper(encounterPlayerInfo);
                    } else {
                        let name = "name_not_found";
                        if(playerNames) {
                            name = playerNames[i-2]
                        }
                        return {reason: "unauthorized", name: name, dnd_b_player_id: playerId, status: 500};
                    }
                }
                return null
            }
        }
        
    });
   

    const allSettledResponses = await Promise.allSettled(promises);
    const privatePlayers = allSettledResponses
        .filter(player => player.status === 'fulfilled' && (player.value.status === 403 || player.value.status === 500))
        .map(player => player.value);
        
    if (privatePlayers.length > 0) {
        let resultString = '';
        privatePlayers.forEach(playerInfo => {
            resultString += playerInfo.name + ' (' + playerInfo.dnd_b_player_id + ')\n';
        });
        
        // Alert message with the result string
        alert('❗❗ ACTION NEEDED ❗❗\n' +
            'Dnd Beyond Privacy setting is set to Private for these characters...\n===========================\n' +
            resultString +
            '===========================\n' + 
            'HOW TO FIX: [Dnd_Beyond] -> [Go To Character] -> [Edit] -> [⚙️Home tab] -> [Character Privacy] -> [Privacy: Public]\n\n' + 
            '(This message shows every auto refresh (1 minute) while a Private DndBeyond character is present)')
    }

    // Filter out the null or failed results and only return the successful ones
    const successfulResponses = allSettledResponses
        .filter(result => result.status === "fulfilled" && result.value !== null && result?.value?.reason !== 'unauthorized')
        .map(result => ({ ...result.value, campaign: campaignName}) );


    return successfulResponses;
};

export default ImportDndBeyondCharacters;
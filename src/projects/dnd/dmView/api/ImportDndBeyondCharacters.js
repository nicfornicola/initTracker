import axios from 'axios';
import { getSkillDetails } from '../../playerView/api/getSkillDetails';
import { backendUrl, dummyDefault, COLOR_GREEN, generateUniqueId } from '../constants';
import DndBCharacterToDmBMapper from '../mappers/DndBCharacterToDmBMapper'

export const ImportDndBeyondCharacters = async (playerIds, encounterGuid, players=undefined, username=undefined, playerNames=undefined, getExtra=true) => {
    console.log("Import Character-service in ImportDndBeyondCharacters");
    const baseUrl = `${backendUrl}/dndb_character_import`;
    let campaignName = null;
    let importedPlayerNames = {}
    
    let results = [];
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i]; // Remove the first ID from the array

        if(playerId.startsWith("preset")) {
            let newDummy = {
                ...dummyDefault,
                avatarUrl: "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg",
                name: "Preset Player",
                alignment: "ally",
                border: COLOR_GREEN,
                type: "player",
                deathSaves: {
                    failCount: 0,
                    successCount: 0,
                    isStabilized: true,
                },
                creatureGuid: generateUniqueId(),
                encounterGuid: encounterGuid,
                dnd_b_player_id: "preset",
                from: "dnd_b",
                status: 200,
            };
            console.log(`${(i+1).toString()}/${playerIds.length} Preset Player retrieved!`);
            results.push(newDummy);
        } else {
            try {
                let url = `${baseUrl}/${playerId}`;
                if(username) {
                    url += `/${username}`;
                }
                const response = await axios.get(url, {});
                const resData = response.data.data;

                // Add new character IDs to the playerIds array if not already present
                if(getExtra) {
                    resData.campaign.characters.forEach((character) => {
                        if (!playerIds.includes(character.characterId.toString())) {
                            playerIds.push(character.characterId.toString());
                            importedPlayerNames = {...importedPlayerNames, [character.characterId]: character.characterName + ' - ' + character.username}
                        }
                    });
                }
                
                // Get this to attach to unauthorized players also
                if (resData?.campaign?.name) {
                    campaignName = resData.campaign.name;
                }

                let skillDetails = getSkillDetails(resData);

                let mappedCharacter = DndBCharacterToDmBMapper(resData, encounterGuid, skillDetails);

                console.log(`${(i+1).toString()}/${playerIds.length} ${resData.name} retrieved! (${playerId})`);
                results.push(mappedCharacter);
            } catch (error) {
                console.log(`${(i+1).toString()}/${playerIds.length} failed! (${playerId}) [Trying to create dummy]`);
                if (error?.response?.status === 404) {
                    alert(`Could not find ID: '${playerId}' \n\nDnd Beyond Error: ${error.response.status}`);
                } else if (error?.response?.status === 403 || error?.response?.status === 500) {
                    // This data is from an encounter so we can still create them as a dummy for refresh later
                    if (players) {
                        console.log("Create failed dummy: encounter");
                        const encounterPlayerInfo = players.find((player) => player.id === playerId);
                        results.push(DndBCharacterToDmBMapper({...encounterPlayerInfo, status: 403}, encounterGuid));
                    } else if(importedPlayerNames[playerId]) {
                        console.log("Create failed dummy: campaign");
                        results.push(DndBCharacterToDmBMapper({name: importedPlayerNames[playerId], id: playerId, status: 403}, encounterGuid));
                    } else {
                        console.log("Create failed dummy: playerNames");
                        let name = "DndB-" + playerId || "name_not_found";
                        if (playerNames) {
                            name = playerNames[i];
                        }

                        results.push(DndBCharacterToDmBMapper({name: name, id: playerId, status: 403}, encounterGuid));
                    }
                }
            }
        }
    }

    // Filter private players
    const privatePlayers = results
        .filter(player => (player.status === 403 || player.status === 500))
        .map(player => player);

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
            '(This message shows every auto refresh (1 minute) while a Private DndBeyond character is in the current encounter)');
    }

    const successfulResponses = results.map(result => ({ ...result, campaign: campaignName }));
    return successfulResponses
};

export default ImportDndBeyondCharacters;
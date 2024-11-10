import axios from 'axios';
import { backendUrl } from '../constants';

export const ImportDndBeyondEncounter = async (gameId) => {
    console.log("DmView - Encounter-service in ImportDndBeyondEncounter - monsterHP, all initiatives")

    try {
        const url = `${backendUrl}/dndb_encounter_import/${gameId}`;
        
        //aa3f3817-f44b-4116-b2e5-39e1eebc9f7d
        return await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',

        },
        withCredentials: false, 
        }).then((res) => {
            const data = res.data.data
            let alertString = "====== Import Successful ====== \n\nEncounter: '" + data.name;
            let campaignString = data.campaign ? "'\nCampaign: '" + data.campaign.name + "'" : ''
            alert(alertString + campaignString)
            return res.data;
        });


    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
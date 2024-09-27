import axios from 'axios';
import { proxyUrl } from '../constants';

export const ImportDndBeyondEncounter = async (gameId) => {
  try {
    const url = `${proxyUrl}https://encounter-service.dndbeyond.com/v1/encounters/${gameId}`;
    
    //aa3f3817-f44b-4116-b2e5-39e1eebc9f7d
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',

      },
      withCredentials: false, 
    });

    console.log("DmView - Encounter-service in ImportDndBeyondEncounter - monsterHP, all initiatives")
    let alertString = "====== Import Successful ====== \n\nEncounter name: '" + response.data.data.name + "'\nCampaign: '" + response.data.data.campaign.name + "'"
    alert(alertString)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
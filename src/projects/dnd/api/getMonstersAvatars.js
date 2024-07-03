import axios from 'axios';
import { proxyUrl } from '../constants';

export const getMonstersAvatars = async (creatures) => {
    const allIds = creatures
        .filter(obj => obj.type === 'monster') // Filter objects where type === 'monster'
        .map(obj => `ids=${obj.id}&`);
    
    const urlIds = [...new Set(allIds)].join('');

    const url = `${proxyUrl}https://monster-service.dndbeyond.com/v1/Monster?${urlIds}`; 

    try {
        const response = await axios.get(url, { 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false, // Include credentials if needed
        });
        console.log("getMonstersAvatarsAPI")
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


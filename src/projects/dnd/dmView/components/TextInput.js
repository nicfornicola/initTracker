import React, { useState } from 'react';
import { generateUniqueId } from '../constants';
import { useUser } from '../../../../providers/UserProvider';

function getYouTubeThumbnail(url) {
    // Extract video ID from URL
    let videoId = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (videoId) {
        videoId = videoId[1];

        // Construct thumbnail URL
        let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        return thumbnailUrl;
    } else {
        console.error('Invalid YouTube URL');
        return null;
    }
}

const TextInput = ({setUploadedLinks, socket}) => {
    const [link, setLink] = useState('');
    const { username } = useUser();

    const handleChange = (event) => {
        setLink(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); 
        let validUrl = link.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
        if(validUrl) {
            let thumbNailUrl = getYouTubeThumbnail(link)
            let guid = generateUniqueId()
            setUploadedLinks((prevLinks) => [...prevLinks, {imageGuid: guid, image: thumbNailUrl}]);
            socket.emit("uploadNewImage", thumbNailUrl, "link", guid, username)
        } else {
            alert("Invalid Youtube Link 🤷")
        }
        
    };

    return (
        <form className="uploadContainer" onSubmit={handleSubmit}>
            <hr className='editlineSeperator'/> 
            <p style={{margin: 0}}>Upload Youtube Links</p> 
            <input 
                type="text" 
                value={link} 
                onChange={handleChange} 
                placeholder="Enter youtube link"
            />
            <button type="submit">Upload</button>
        </form>
    );
};

export default TextInput;

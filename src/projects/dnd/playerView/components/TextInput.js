import React, { useState } from 'react';

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

const TextInput = ({setUploadedLinks}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    let thumbnailUrl = getYouTubeThumbnail(inputValue)
    if(thumbnailUrl)
        setUploadedLinks((prevLinks) => [...prevLinks, thumbnailUrl]);
  };

  return (
    <form className="uploadContainer" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        placeholder="Enter youtube link"
      />
      <button type="submit">Upload Background</button>
    </form>
  );
};

export default TextInput;

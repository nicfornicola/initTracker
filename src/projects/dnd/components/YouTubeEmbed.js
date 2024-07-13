import React from 'react';

const YouTubeEmbed = ({ embedUrl }) => {
    return (
        <iframe 
            className="videoBackground" 
            src={embedUrl} 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share" 
        >
        </iframe>
    );
};

export default YouTubeEmbed;

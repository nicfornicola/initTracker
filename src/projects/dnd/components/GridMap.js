import '../style/App.css';
import React from 'react';
import { Grid } from '@mui/material';

const GridMap = ({ imageArr, setBackGroundImage, setYoutubeLink, isYoutubeLink = false }) => {
    const handleClick = (src) => {
        if (isYoutubeLink) { // https://www.youtube.com/watch?v=H-bd0eyF-HA&ab_channel=AnimatedBattleMaps
            const videoId = src.split("vi/")[1].split('/max')[0];
            if (videoId) {
                // Convert regular YouTube link to embeddable link
                //"https://www.youtube.com/embed/H-bd0eyF-HA

                let embedUrl = "https://www.youtube.com/embed/" + videoId

                const params = {
                    controls: 0,
                    mute: 1,
                    rel: 0,
                    autoplay: 1,
                    loop: 1,
                    playlist: videoId
                }

                // Mute by default and turn off controls so they dont show everytime on hover
                // Construct the query string with all parameters
                const queryParams = new URLSearchParams(params).toString();
                embedUrl += `?${queryParams}`;
                setYoutubeLink(embedUrl)
                setBackGroundImage(null);

            } else {
                console.error('Invalid YouTube URL');
                return;
            }
        } else {
            // Call setBackGroundImage with the modified src
            setBackGroundImage(src);
            setYoutubeLink("")
        }

    };

    return (
        <Grid container spacing={0.5}>
            {imageArr.map(src => (
                <Grid key={src} item xs={4}>
                    <img className="backgroundThumbnail" src={src} alt={"background"} onClick={() => handleClick(src)} />
                </Grid>
            ))}
        </Grid>
    );
};

export default GridMap;

import '../../dmView/style/App.css';
import React from 'react';
import { Grid } from '@mui/material';

const GridMap = ({ imageArr, handleClick, isYoutubeLink = false }) => {

    return (
        <Grid container spacing={0.5}>
            {imageArr.map((src, index) => (
                <Grid key={src + index.toString()} item xs={4}>
                    <img className="backgroundThumbnail" src={src} alt={"background"} onClick={() => handleClick(src, isYoutubeLink)} />
                </Grid>
            ))}
        </Grid>
    );
};

export default GridMap;

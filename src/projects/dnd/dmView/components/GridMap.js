import '../../dmView/style/App.css';
import React from 'react';
import { Grid } from '@mui/material';

const GridMap = ({imageArr, handleClick, isYoutubeLink = false}) => {
 
    return (
        <Grid container spacing={0.5}>
            {imageArr.map((imgObj, index) => (
                <Grid key={imgObj.imageGuid + index.toString()} item xs={4}>
                    <img className="backgroundThumbnail growImage" src={imgObj.image} alt={"background"} onClick={() => handleClick(imgObj, isYoutubeLink)} />
                </Grid>
            ))}
        </Grid>
    );
};

export default GridMap;
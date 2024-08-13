import '../style/App.css';
import React from 'react';
import { Grid } from '@mui/material';

const GridMap = ({imageArr, handleClick}) => {

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

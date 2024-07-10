import '../style/App.css';
import React from 'react';
import { Grid } from '@mui/material';

const GridMap = ({imageArr, setBackGroundImage}) => {
  return (
        <Grid container spacing={0.5}>
            {imageArr.map(src => (
                <Grid key={src} item xs={4}>
                    <img className="backgroundThumbnail" src={src} alt={"background"} onClick={() => setBackGroundImage(src)} />
                </Grid>
            ))}
        </Grid>
  );
};

export default GridMap;
import '../../dmView/style/App.css';
import React from 'react';
import { Grid } from '@mui/material';
import { useUser } from '../../../../providers/UserProvider.js';

const GridMap = ({imageArr, setImageArr, handleClick, isYoutubeLink = false, socket}) => {
    const { username } = useUser();
    const deleteImage = (imgObj) => {
        socket.emit("deleteImage", username, imgObj.imageGuid);
        setImageArr((prevImageArr) =>
            prevImageArr.filter((image) => image.imageGuid !== imgObj.imageGuid)
        );
    }

    return (
        <Grid container spacing={0.5}>
            {imageArr.map((imgObj, index) => (
                <Grid key={imgObj.imageGuid + index.toString()} item xs={4} className='imageContainer growImage'>
                    <img className="backgroundThumbnail" src={imgObj.image} alt={"background"} onClick={() => handleClick(imgObj, isYoutubeLink)} />
                    {imgObj.imageGuid !== 'constant' &&
                        <button className='imageX' onClick={() => deleteImage(imgObj)}>🗑️</button>
                    }
                </Grid>
            ))}
        </Grid>
    );
};

export default GridMap;
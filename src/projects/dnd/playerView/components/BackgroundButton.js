import '../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { backgroundImages } from '../constants';
import FileUpload from './FileUpload';
import TextInput from './TextInput';
import GridMap from './GridMap';

import backgroundButton from "../pics/icons/backgroundButton.png"
import Tooltip from './Tooltip';

const ImagePopup = ({setBackGroundImage, setYoutubeLink}) => {
    const [open, setOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedLinks, setUploadedLinks] = useState([]);

    const dialogRef = useRef(null);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        const handleClickOutside = (event) => {
            if ((dialogRef.current && !dialogRef.current.contains(event.target)) || event.target.tagName === 'IMG') {
                handleClose();
            }
        };
        
        open ? document.addEventListener('mousedown', handleClickOutside) : document.removeEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleClick = (src, isYoutubeLink) => {
        if (isYoutubeLink) { // https://www.youtube.com/watch?v=H-bd0eyF-HA&ab_channel=AnimatedBattleMaps
            const videoId = src.split("vi/")[1].split('/max')[0];
            if (videoId) {
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
                const queryParams = new URLSearchParams(params).toString();
                embedUrl += `?${queryParams}`;
                setYoutubeLink(embedUrl)
                setBackGroundImage(null);

            } else {
                console.error('Invalid YouTube URL');
                return;
            }
        } else {
            setBackGroundImage(src);
            setYoutubeLink("")
        }

    };

  return (
    <>
        <img className="option" alt='backgroundButton' src={backgroundButton} onClick={() => setOpen(true)}/>
        <Tooltip message={"Set Background"}/>

        <Dialog open={open} onClose={handleClose} ref={dialogRef} >
            <DialogContent >
                {uploadedLinks.length > 0 && (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploaded Youtube Links - ⚠️Cleared on page refresh⚠️</label>
                        <hr/>
                        <GridMap imageArr={uploadedLinks} handleClick={handleClick} isYoutubeLink={true} />
                        <hr/>
                    </>
                )}
                {uploadedFiles.length > 0 && (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploaded Images - ⚠️Cleared on page refresh⚠️</label>
                        <hr/>
                        <GridMap imageArr={uploadedFiles} handleClick={handleClick}/>
                        <hr/>
                    </>
                )}
                <GridMap imageArr={backgroundImages} handleClick={handleClick}/>
            </DialogContent>
            <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>
            <TextInput setYoutubeLink={setYoutubeLink} setUploadedLinks={setUploadedLinks} setOpen={setOpen}/>

        </Dialog>

    </>
  );
};

export default ImagePopup;
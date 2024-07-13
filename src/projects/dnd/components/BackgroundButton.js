import '../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { backgroundImages } from '../constants';
import FileUpload from './FileUpload';
import TextInput from './TextInput';
import GridMap from './GridMap';

import backgroundButton from "../pics/backgroundButton.png"
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
        
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

  return (
    <>
        <img className="option" alt='backgroundButton' src={backgroundButton} onClick={() => setOpen(true)}/>
        <Tooltip message={"Set Background"}/>

        <Dialog open={open} onClose={handleClose} ref={dialogRef} >
            <DialogContent >
                {uploadedLinks.length > 0 && (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploaded Videos - ⚠️Cleared on page refresh⚠️</label>
                        <hr/>
                        <GridMap imageArr={uploadedLinks} setYoutubeLink={setYoutubeLink} setBackGroundImage={setBackGroundImage} isYoutubeLink={true} />
                        <hr/>
                    </>
                )}
                {uploadedFiles.length > 0 && (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploaded Images - ⚠️Cleared on page refresh⚠️</label>
                        <hr/>
                        <GridMap imageArr={uploadedFiles} setYoutubeLink={setYoutubeLink} setBackGroundImage={setBackGroundImage}/>
                        <hr/>
                    </>
                )}
                <GridMap imageArr={backgroundImages} setYoutubeLink={setYoutubeLink} setBackGroundImage={setBackGroundImage}/>
            </DialogContent>
            <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>
            <TextInput setYoutubeLink={setYoutubeLink} setUploadedLinks={setUploadedLinks} setOpen={setOpen}/>

        </Dialog>

    </>
  );
};

export default ImagePopup;
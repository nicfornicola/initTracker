import '../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { backgroundImages } from '../constants';
import FileUpload from './FileUpload';
import GridMap from './GridMap';

import backgroundButton from "../pics/backgroundButton.png"

const ImagePopup = ({setBackGroundImage}) => {
    const [open, setOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

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
        <Dialog open={open} onClose={handleClose} ref={dialogRef} >
            <DialogContent >
                {uploadedFiles.length > 0 && (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploads - ⚠️Cleared on page refresh⚠️</label>
                        <hr/>
                        <GridMap imageArr={uploadedFiles} setBackGroundImage={setBackGroundImage}/>
                        <hr/>
                    </>
                )}
                <GridMap imageArr={backgroundImages} setBackGroundImage={setBackGroundImage}/>
            </DialogContent>
            <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>

        </Dialog>

    </>
  );
};

export default ImagePopup;
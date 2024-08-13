import '../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import FileUpload from './FileUpload';
import GridMap from './GridMap';


const ImagePopup = ({handleSaveEncounter, uploadIconCreature, setCurrentEncounterCreatures, currentEncounterCreatures, setUploadIconMenu, uploadIconMenu}) => {

    const [uploadedIcons, setUploadedIcons] = useState(JSON.parse(localStorage.getItem('uploadedIcons')) || []);
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((dialogRef.current && !dialogRef.current.contains(event.target)) || event.target.tagName === 'IMG') {
                setUploadIconMenu(false)
            }
        };
        
        uploadIconMenu ? document.addEventListener('mousedown', handleClickOutside) : document.removeEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    // eslint-disable-next-line
    }, [uploadIconMenu]);


    const handleClick = (src) => {
        currentEncounterCreatures.forEach(creature => {
            if(uploadIconCreature.guid === creature.guid) {
                creature.defaultImageUrl = creature.avatarUrl
                creature.avatarUrl = src
            }
        });
        setCurrentEncounterCreatures([...currentEncounterCreatures])
        handleSaveEncounter(currentEncounterCreatures)

    };

  return (
        <Dialog open={uploadIconMenu} onClose={() => setUploadIconMenu(false)} ref={dialogRef} >
            <DialogContent >
                {uploadedIcons.length > 0 && (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploaded Images</label>
                        <hr/>
                        <GridMap imageArr={uploadedIcons} handleClick={(handleClick)}/>
                    </>
                )}
            </DialogContent>
            <FileUpload uploadedFiles={uploadedIcons} setUploadedFiles={setUploadedIcons}/>
        </Dialog>
  );
};

export default ImagePopup;
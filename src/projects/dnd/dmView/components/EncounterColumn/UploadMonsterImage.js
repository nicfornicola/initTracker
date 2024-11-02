import '../../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import FileUpload from '../FileUpload';
import GridMap from '../GridMap';

const UploadMonsterImage = ({uploadIconCreature, setCurrentEncounter, creatures, setUploadIconMenu, uploadIconMenu, socket}) => {
    const [uploadedAvatars, setUploadedAvatars] = useState(JSON.parse(localStorage.getItem('uploadedAvatars')) || []);
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((dialogRef.current && !dialogRef.current.contains(event.target)) || event.target.tagName === 'IMG') {
                setUploadIconMenu(false)
            }
        };


        if(uploadIconMenu) {
            if(uploadedAvatars.length === 0) {
                socket.emit("getImages", "avatar", "Username");
                socket.on('sendImages', (images) => {
                    if(images.length === 0) {
                        console.log("No images")
                    } else {
                        let avatars = [];
                        images.forEach(image => {
                            console.log(image.imageGuid)
                            avatars.push(image.image)
                        })
                        setUploadedAvatars(avatars)
                    }
                });
            }

            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    // eslint-disable-next-line
    }, [uploadIconMenu]);

    const handleClick = (src) => {
        creatures.forEach(creature => {
            if(uploadIconCreature.creatureGuid === creature.creatureGuid) {
                creature.defaultImageUrl = creature.avatarUrl
                creature.avatarUrl = src
            }
        });
        setCurrentEncounter(prev => ({...prev, creatures: [...prev.creatures]}))
    };

  return (
        <Dialog open={uploadIconMenu} onClose={() => setUploadIconMenu(false)} ref={dialogRef} >
            <DialogContent >
                {uploadedAvatars.length > 0 ? (
                    <>     
                        <label htmlFor="grid" className='uploadedTitle'>Uploaded Images</label>
                        <hr/>
                        <GridMap imageArr={uploadedAvatars} handleClick={(handleClick)}/>
                    </>
                ) : (
                    <div>Uploaded Images will apear here...</div>
                )}

            </DialogContent>
            <FileUpload uploadedFiles={uploadedAvatars} setUploadedFiles={setUploadedAvatars} storageKey={"avatar"} socket={socket}/>
        </Dialog>
  );
};

export default UploadMonsterImage;
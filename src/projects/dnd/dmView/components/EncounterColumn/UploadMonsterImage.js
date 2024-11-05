import '../../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import FileUpload from '../FileUpload';
import GridMap from '../GridMap';
import { InfinitySpin } from 'react-loader-spinner';

const UploadMonsterImage = ({uploadIconCreature, setCurrentEncounter, setUploadIconMenu, uploadIconMenu, socket}) => {
    const [uploadedAvatars, setUploadedAvatars] = useState([]);
    const [loading, setLoading] = useState(true);

    const ref = useRef(null);

    const handleClose = () => {
        setUploadIconMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((ref.current && !ref.current.contains(event.target)) || event.target.tagName === 'IMG') {
                handleClose()
            }
        };

        if(uploadIconMenu) {
            if(uploadedAvatars.length === 0) {
                socket.emit("getImages", "avatar", "Username");
                socket.on('sendImagesAvatar', (images) => {
                    if(images.length === 0) {
                        console.log("No images")
                    } else {
                        let avatars = [];
                        images.forEach(image => {
                            console.log(image)
                            avatars.push({imageGuid: image.imageGuid, image: image.image})
                        })
                        
                        setUploadedAvatars(avatars)
                        setTimeout(() => {
                            setLoading(false);
                        }, 500);              
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

    const handleClick = (imageObj) => {
        setCurrentEncounter(prev => {
            const updatedCreatures = prev.creatures.map(creature => {
                if (uploadIconCreature.creatureGuid === creature.creatureGuid) {
                    return {...creature, avatarUrl: imageObj.image};
                }
                return creature;
            });
    
            socket.emit("creatureAvatarChange", imageObj.imageGuid, uploadIconCreature.creatureGuid, "dm");
            return {...prev, creatures: updatedCreatures};
        });
    };

    return (
            <Dialog open={uploadIconMenu} onClose={handleClose} ref={ref} >
                {loading ? 
                    <InfinitySpin
                        visible={true}
                        width="200"
                        ariaLabel="infinity-spin-loading"
                /> : 
                    <DialogContent >
                        {uploadedAvatars.length > 0 ? (
                            <>     
                                <label htmlFor="grid" className='uploadedTitle'>Uploaded Avatars</label>
                                <hr/>
                                <GridMap imageArr={uploadedAvatars} handleClick={handleClick}/>
                            </>
                        ) : (
                            <div>Uploaded Images will apear here...</div>
                        )}

                    </DialogContent> 
                }
                <FileUpload setUploadedFiles={setUploadedAvatars} storageKey={"avatar"} socket={socket}/>
            </Dialog>
    );
};

export default UploadMonsterImage;
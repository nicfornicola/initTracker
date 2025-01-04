import '../../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import FileUpload from '../FileUpload';
import GridMap from '../GridMap';
import { InfinitySpin } from 'react-loader-spinner';
import { useUser } from '../../../../../providers/UserProvider';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';

//if undefined 
const UploadMonsterImage = ({uploadIconCreature, setCurrentEncounter, setUploadIconMenu, uploadIconMenu, socket}) => {
    const [loading, setLoading] = useState(false);
    const [uploadedAvatars, setUploadedAvatars] = useState([]);
    const { username } = useUser();
    const {addToHomebrewList} = useHomebrewProvider();

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

                socket.emit("getImages", "avatar", username);
                socket.on('sendImagesAvatar', (images) => {
                    let avatars = [];
                    images.forEach(image => {
                        avatars.push({imageGuid: image.imageGuid, image: image.image})
                    })
                    
                    setUploadedAvatars(avatars)
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);              
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
        const homebrew = !!uploadIconCreature?.dmb_homebrew_guid;
        const search = uploadIconCreature?.encounterGuid === undefined;
        const encounter = uploadIconCreature?.encounterGuid === null;
        let type = 'encounterHomebrew'
        if(search) {
            type = 'search'
        } else if (encounter) {
            type = 'homebrew'
        } else if (!homebrew) {
            type = 'encounter'
        }

        if(type === 'encounter' || type === 'encounterHomebrew') {
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
        } else if(type === 'homebrew' || type === 'search')
            addToHomebrewList({...uploadIconCreature, avatarUrl: imageObj.image})
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
                                <div className='uploadImageTopInfo'>     
                                    <img src={uploadIconCreature.avatarUrl} alt={"list Icon"} width={75} style={{border: '1px solid black'}}/>
                                </div>
                                <div style={{display: 'flex', flex: '1', justifyContent: 'space-between'}}>
                                    <label htmlFor="grid" className='uploadedTitle'>Uploaded Avatars</label>
                                    <strong style={{marginRight: '4%'}}>{uploadIconCreature.name}</strong>
                                    Select a new icon
                                </div>

                                <hr className='editlineSeperator'/> 
                                <GridMap imageArr={uploadedAvatars} setImageArr={setUploadedAvatars} handleClick={handleClick} socket={socket}/>
                            </>
                        ) : (
                            <div>Uploaded Avatars will apear here...</div>
                        )}

                    </DialogContent> 
                }
                <FileUpload setUploadedFiles={setUploadedAvatars} storageKey={"avatar"} socket={socket}/>
            </Dialog>
    );
};

export default UploadMonsterImage;
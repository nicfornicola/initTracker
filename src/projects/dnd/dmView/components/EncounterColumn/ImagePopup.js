import '../../style/App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { backgroundImages } from '../../constants.js';
import FileUpload from '../FileUpload.js';
import TextInput from '../TextInput.js';
import GridMap from '../GridMap.js';
import { InfinitySpin } from 'react-loader-spinner';

import backgroundButton from "../../pics/icons/backgroundButton.png"
import OptionButton from './OptionButton';
import { useUser } from '../../../../../providers/UserProvider.js';


const ImagePopup = ({setPlayerViewBackground, encounterGuid, socket}) => {
    const [open, setOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedLinks, setUploadedLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { username } = useUser();

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

        if(open) {  
            if(uploadedFiles.length === 0 && uploadedLinks.length === 0) {
                socket.emit("getImages", "background", username);
                socket.on('sendImagesBackground', (backgrounds) => {
                    let images = [];
                    let links = [];
                    backgrounds.forEach(background => {
                        if(background.type === "link") {
                            // this is actually a youtube thumbs nail url
                            links.push(background) 
                        } else if (background.type === "background") {
                            images.push(background)
                        }
                    })
                    setUploadedLinks(links)
                    setUploadedFiles(images)
                        
                    setTimeout(()=> {
                        setLoading(false)
                    }, 500)
                });
            }
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
       
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [open]);

    const handleSetBackground = (type, src) => {
        setPlayerViewBackground({type: type, src: src})
    }

    const handleClick = (imageObj, isYoutubeLink) => {
        
        socket.emit("encounterBackgroundChange", imageObj, encounterGuid)

        if (isYoutubeLink) { // https://www.youtube.com/watch?v=H-bd0eyF-HA&ab_channel=AnimatedBattleMaps
            const videoId = imageObj.image.split("vi/")[1].split('/max')[0];
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
                handleSetBackground("youtube", embedUrl)

            } else {
                console.error('Invalid YouTube URL');
                return;
            }
        } else {
            handleSetBackground("image", imageObj.image)
        }

    };

  return (
    <>
        <OptionButton src={backgroundButton} message={"Set Background"} onClickFunction={() => setOpen(true)}/>
        <Dialog open={open} onClose={handleClose} ref={dialogRef} >
            {loading ? 
                <InfinitySpin
                    visible={true}
                    width="200"
                    ariaLabel="infinity-spin-loading"
            /> :
                <DialogContent >
                    <label htmlFor="grid" className='uploadedTitle'>Uploaded Youtube Links </label>
                    <hr/>
                    <TextInput setUploadedLinks={setUploadedLinks} socket={socket}/>
                    {uploadedLinks.length > 0 ? (
                        <>     
                            <GridMap imageArr={uploadedLinks} handleClick={handleClick} isYoutubeLink={true} />
                            <hr/>
                        </>
                    ) : (
                        <p>{'>'} No youtube links found</p>
                    )}
                    <label htmlFor="grid" className='uploadedTitle'>Uploaded Images</label>
                    <hr/>
                    <FileUpload setUploadedFiles={setUploadedFiles} storageKey={"background"} socket={socket}/>
                    {uploadedFiles.length > 0 ? (
                        <>     
                            <GridMap imageArr={uploadedFiles} handleClick={handleClick}/>
                            <hr/>
                        </>
                    ) : (
                        <p>{'>'} No background images found</p>
                    )}
                    <label htmlFor="grid" className='uploadedTitle'>Default Backgrounds</label>
                    <hr/>
                    <GridMap imageArr={backgroundImages} handleClick={handleClick}/>
                </DialogContent>
            }

        </Dialog>

    </>
  );
};

export default ImagePopup;
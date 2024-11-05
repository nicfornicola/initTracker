import React from 'react';
import { generateUniqueId } from '../constants';

const resizeImage = (img, maxWidth, maxHeight, quality) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a base64 string with reduced quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl); // Resolve the promise with the data URL
    });
};

// FileUpload component
const FileUpload = ({setUploadedFiles, storageKey, socket}) => {

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = async () => {
                    const maxWidth = storageKey === "background" ? 1280 : 300; // Maximum width
                    const maxHeight = storageKey === "background" ? 720 : 300; // Maximum height
                    const quality = storageKey === "background" ? .9 : 0.7; // Image quality (0.1 to 1)

                    const resizedImage = await resizeImage(img, maxWidth, maxHeight, quality);

                    let guid = generateUniqueId();
                    let userGuid = "Username"
                    setUploadedFiles(prevFiles => [...prevFiles, {type: storageKey, imageGuid: guid, image: resizedImage, userGuid: userGuid}]);
                    socket.emit("uploadNewImage", resizedImage, storageKey, guid, userGuid)
                };

                
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a .png, .jpg, or gif file.');
        }
    };

    return (
        <div className="uploadContainer">
            <label htmlFor="file-upload">Upload pngs, jpgs, gifs</label>         
            <br/>
            <input id="file-upload" type="file" accept=".png, .jpg, .jpeg, .gif" onChange={handleFileChange} />
        </div>
    );
};

export default FileUpload;
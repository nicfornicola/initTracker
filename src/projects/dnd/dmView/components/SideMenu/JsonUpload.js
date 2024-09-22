import React from 'react';
import JsonImg from '../pics/json.png'

function ImageUploader({uploadLocalStorage}) {
    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <li className="menuIcon" onClick={handleImageClick}>
            <img src={JsonImg} alt="Click to Upload" className="menuIcon" /> Upload Saves
            <input
                type="file"
                accept='.json'
                id="fileInput"
                style={{ display: 'none' }}
                onChange={uploadLocalStorage}
            />
        </li>
    );
}

export default ImageUploader;

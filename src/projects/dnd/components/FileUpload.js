import React from 'react';

// FileUpload component
const FileUpload = ({uploadedFiles, setUploadedFiles}) => {

    const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif')) {
        const reader = new FileReader();
            reader.onload = () => {
                const newFile = reader.result;
                setUploadedFiles((prevFiles) => [...prevFiles, newFile]);

                localStorage.setItem('uploadedFiles', JSON.stringify([...uploadedFiles, newFile]));
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a .png or .jpg file.');
        }
    };

    return (
        <div className="uploadContainer">
            <label htmlFor="file-upload">Upload pngs, jpgs, gifs or set a youtube video as the background! </label>         
            <br/>
            <input id="file-upload" type="file" accept=".png, .jpg, .jpeg, .gif" onChange={handleFileChange} />
        </div>
    );
};

export default FileUpload;
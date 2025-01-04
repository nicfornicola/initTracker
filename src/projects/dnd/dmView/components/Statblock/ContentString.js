import React from 'react';

function capsFirstLetter(word) {
    if (!word)
        return ''; // Handle empty or undefined input
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const ContentString = ({label, contentString, italics = undefined}) => {
    return contentString ? <p>
            <strong>{label}</strong> <span className='infoDesc'>{capsFirstLetter(contentString)}</span>
            {italics && <i className='infoDesc'>{italics}</i>}
        </p> : null
}

export default ContentString;
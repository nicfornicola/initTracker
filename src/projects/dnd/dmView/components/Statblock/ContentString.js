import React from 'react';

function capsFirstLetter(word) {
    if (!word)
        return ''; // Handle empty or undefined input
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const ContentString = ({label, contentString, italics = undefined}) => {
    return contentString ? <p>
            <strong>{label}</strong> {capsFirstLetter(contentString)}
            {italics && <i>{italics}</i>}
        </p> : null
}

export default ContentString;
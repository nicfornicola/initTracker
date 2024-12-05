import React from 'react';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const ContentArray = ({label, contentArray}) => {

    const filteredContent = contentArray?.filter(
        (action) => !(action.name === "None" && action.desc === "--")
    );

    if (!filteredContent?.length) {
        return null; // Return null if no valid actions remain
    }

    return (
        <>
            <h1 className='infoTitle'>{label}</h1>
            <hr className="lineSeperator" />
            {filteredContent.map((action, index) => (
                <div className='actionInfo' key={index + action.name}>
                    <strong>{action.name}:</strong> {getDesc(action)}
                </div>
            ))}
        </>
    );
}

export default ContentArray;
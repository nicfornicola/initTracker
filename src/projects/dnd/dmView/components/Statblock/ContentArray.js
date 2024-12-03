import React from 'react';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const ContentArray = ({label, contentArray}) => {


    if(contentArray && contentArray.length !== 0) {
        return (
            <>
                <h1 className='infoTitle'>{label}</h1>
                <hr className="lineSeperator" />
                {contentArray.map((action, index) => (
                    <div className='actionInfo' key={index+action.name}>
                        <strong>{action.name}:</strong> {getDesc(action)}
                    </div>
                ))}
            </>
        )
    } else {
        return null
    }
}

export default ContentArray;
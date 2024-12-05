import React from 'react';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const ContentArray = ({label, contentArray, labelDesc = null, boxes = undefined, handleCheck=undefined}) => {

    const filteredContent = contentArray?.filter(
        (action) => !(action.name === "None" && action.desc === "--")
    );

    if (!filteredContent?.length) {
        return null;
    }

    return (
        <>
            <h1 className='infoTitle'>{label}</h1>
            <hr className="lineSeperator" />
            {labelDesc && boxes && // check boxes to track "legendary actions"
                <div className='actionInfo'>
                    {labelDesc}
                    {boxes.map((checked, index)  => (
                        <input  
                            checked={checked}
                            onChange={(e) => handleCheck(e.target.checked, "legendary_actions_count", index)}
                        />
                    ))}
                   
                </div>
            }
            {filteredContent.map((action, index) => (
                <div className='actionInfo' key={index + action.name}>
                    <strong>{action.name}:</strong> {getDesc(action)}
                </div>
            ))}
            {label ===  'Legendary Actions'}
        </>
    );
}

export default ContentArray;
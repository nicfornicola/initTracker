import React from 'react';
import ActionTracker from './ActionTracker';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const ContentArray = ({label, contentArray, labelDesc = null, actions_count = undefined, handleCheck=undefined}) => {

    const filteredContent = contentArray?.filter(
        (action) => !(action.name === "None" && action.desc === "--")
    );

    if (!filteredContent?.length) {
        return null;
    }

    return (
        <>
            <div className={`actionToken-container`}>
                <h1 className='infoTitle'>{label} </h1>
                {actions_count && 
                    <ActionTracker 
                        actions_count={actions_count}
                        label={label}
                        handleCheck={handleCheck}
                    />
                }
            </div>
            <hr className="lineSeperator" />
            {labelDesc && // check boxes to track "legendary actions"
                <div className='actionInfo'>
                    {labelDesc}                
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
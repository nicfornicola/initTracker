import React from 'react';
import ActionTracker from './ActionTracker';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const ContentArray = ({label, contentArray, labelDesc = null, actions_count = undefined, handleCheck=undefined, cKey=undefined, nested=false}) => {

    const filteredContent = contentArray?.filter(
        (action) => !(action.name === "None" && action.desc === "--")
    );

    if (!filteredContent?.length) {
        return null;
    }

    return (
        <>
            {/* This is for legendary actions since it goes next to the big title */}
            <div className={`actionToken-container`}>
                <h1 className='infoTitle'>{label} </h1>
                {actions_count && handleCheck &&
                    <ActionTracker 
                        actions_count={actions_count}
                        label={label}
                        cKey={cKey}
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
                    {action?.rechargeCount !== 0 && !isNaN(action?.rechargeCount) && handleCheck ? (
                        <div className={`actionToken-container`}>
                            <strong>{action.name} </strong>
                            <ActionTracker 
                                actions_count={action.rechargeCount}
                                cKey={cKey}
                                nested={nested}
                                handleCheck={handleCheck}
                                actionIndex={index}
                            />
                        </div>
                    ) : ( 
                        <strong>{action.name}: </strong>
                    )}
                        <span className='infoDesc'>{getDesc(action)}</span>
                </div>
            ))}
            {label ===  'Legendary Actions'}
        </>
    );
}

export default ContentArray;
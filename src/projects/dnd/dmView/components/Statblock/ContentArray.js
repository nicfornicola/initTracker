import React from 'react';
import ActionTracker from './ActionTracker';
import { BoldifyReplace } from './BoldifyReplace.js';

const ContentArray = ({label, contentArray, labelDesc = null, actions_count = undefined, handleCheck=undefined, cKey=undefined, nested=false}) => {

    const filteredContent = contentArray?.filter(
        (action) => !(action.name === "None" && action.desc === "--")
    );

    if (!filteredContent?.length) {
        return null;
    }

    let showActionTracker = !!actions_count && !!handleCheck
    return (
        <>
            {/* This is for legendary actions since it goes next to the big title */}
            <div className={`actionToken-container`}>
                <h1 className='infoTitle'>{label}</h1>
                {showActionTracker &&
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
                            <strong><BoldifyReplace name={action.name} /></strong>
                            <ActionTracker 
                                actions_count={action.rechargeCount}
                                cKey={cKey}
                                nested={nested}
                                handleCheck={handleCheck}
                                actionIndex={index}
                            />
                        </div>
                    ) : ( 
                        <strong><BoldifyReplace name={action.name} /> </strong> 
                    )}
                    <BoldifyReplace desc={action?.desc} />
                </div>
            ))}
            {label ===  'Legendary Actions'}
        </>
    );
}

export default ContentArray;
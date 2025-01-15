import React, { useState } from 'react';

const ActionTracker = ({ actions_count, cKey, handleCheck, nested=false, actionIndex=undefined}) => {
    const [hoverIndex, setHoverIndex] = useState(null); // Track hover index

    if(0 < actions_count && actions_count < 10)
        actions_count *= 10

    const filledCircles = actions_count % 10;
    const totalCircles = Math.floor(actions_count / 10);
    let isHoveringFilled = filledCircles > hoverIndex

    const handleMouseEnter = (index) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    const handleClick = (index) => {
        if(hoverIndex === index) {
            setHoverIndex(prev => isHoveringFilled ? prev-100 : prev+100)
        }
        //This detemine adding or subtracting from rechargeCount
        let addCheck = index >= filledCircles
        handleCheck(addCheck, cKey, nested, actionIndex);
    };

    const getClass = (index) => {
        //if im hovering
        if(hoverIndex != null) {
            //over a filled box
            if(isHoveringFilled) {
                // and this index is right most
                if(index === filledCircles-1) {
                    return 'filled hover'
                }
    
            //over a unfilled box and this index is first unfilled
            } else if(index === filledCircles) {
                return 'unfilled hover'
            }
        }

        return index < filledCircles ? 'filled' : 'unfilled'
    }

    return (
        <>
            {Array.from({ length: totalCircles }).map((_, index) => (
                <div
                    key={index}
                    className={`actionToken ${getClass(index)}`}
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)} // Track hover
                    onMouseLeave={handleMouseLeave} // Reset hover when mouse leaves the container
                />
            ))}
        </>
    );
};

export default ActionTracker;
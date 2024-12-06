import React, { useState } from 'react';

const ActionTracker = ({ actions_count, label, handleCheck }) => {
    const [hoverIndex, setHoverIndex] = useState(null); // Track hover index
    const filledCircles = actions_count % 10;
    const totalCircles = Math.floor(actions_count / 10);
    console.log(filledCircles, "/", totalCircles)
    let isHoveringFilled = filledCircles > hoverIndex

    console.log()

    const handleMouseEnter = (index) => {
        setHoverIndex(index); // Set hover index on enter
    };

    const handleMouseLeave = () => {
        setHoverIndex(null); // Reset hover index
    };

    const handleClick = (index) => {
        if(hoverIndex === index) {
            setHoverIndex(prev => isHoveringFilled ? prev-10 : prev+10)
        }
        handleCheck(index < filledCircles, 'legendary_actions_count');
        
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
        <div className="actionToken-container">
            {Array.from({ length: totalCircles }).map((_, index) => (
                <div
                    key={index}
                    className={`actionToken ${getClass(index)}`}
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)} // Track hover
                    onMouseLeave={handleMouseLeave} // Reset hover when mouse leaves the container
                />
            ))}
        </div>
    );
};

export default ActionTracker;
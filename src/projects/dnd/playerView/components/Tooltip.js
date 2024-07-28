import React from 'react';
import '../style/App.css';

// ProfileCard Component
const Tooltip = ({message}) => {
    return (
        <span className="tooltiptext">
            {message}
        </span>
    );
};

export default Tooltip;
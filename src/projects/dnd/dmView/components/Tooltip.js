import React from 'react';
import '../../dmView/style/App.css';

const Tooltip = ({message}) => {
    return (
        <span className="tooltiptext">
            {message}
        </span>
    );
};

export default Tooltip;
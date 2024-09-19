import React, { useState } from 'react';
import Tooltip from "../../playerView/components/Tooltip"

const OptionButton = ({src, message, onClickFunction}) => {
    return (
        <div className='optionWrapper'>
            <img className="option" src={src} alt={message} onClick={onClickFunction} />
            <Tooltip message={message}/>
        </div>

    );
};

export default OptionButton;
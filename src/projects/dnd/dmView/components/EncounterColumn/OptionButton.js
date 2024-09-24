import React from 'react';
import Tooltip from "../Tooltip"
import '../../style/App.css';

const OptionButton = ({src, message, onClickFunction, style=""}) => {
    return (
        <div className='optionWrapper'>
            <img className={`option ${style}`} src={src} alt={message} onClick={onClickFunction} />
            <Tooltip message={message}/>
        </div>

    );
};

export default OptionButton;
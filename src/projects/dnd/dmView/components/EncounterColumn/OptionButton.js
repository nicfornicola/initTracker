import React from 'react';
import Tooltip from "../Tooltip"
import '../../style/App.css';

const OptionButton = ({src, message, onClickFunction, imgClassName="", imgStyle={}, imgRef=null}) => {
    return (
        <div className='optionWrapper'>
            <img className={`option ${imgClassName}`} style={imgStyle} src={src} alt={message} onClick={onClickFunction} ref={imgRef}/>
            <Tooltip message={message}/>
        </div>

    );
};

export default OptionButton;
import React from 'react';
import Tooltip from "../Tooltip"
import '../../style/App.css';
import { Popover } from '@base-ui-components/react/popover';

const OptionButton = ({src, message, onClickFunction, imgClassName="", wrapperClassName='', imgStyle={}, imgRef=null}) => {

    return  <Popover.Root openOnHover={true} delay={200}>
                <Popover.Trigger className='triggerButton'>
                    <div className={`optionWrapper ${wrapperClassName}`}>
                        <img className={`option ${imgClassName}`} style={imgStyle} src={src} alt={message} onClick={onClickFunction} ref={imgRef}/>
                    </div>
                </Popover.Trigger>
                <Popover.Portal >
                    <Popover.Positioner sticky={true} side='top' sideOffset='8'>
                        <Popover.Popup>
                            <Tooltip message={message}/>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>;
};

export default OptionButton;
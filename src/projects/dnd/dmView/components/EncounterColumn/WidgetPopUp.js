import React from 'react';
import '../../style/App.css';
import { Popover } from '@base-ui-components/react/popover';

const WidgetPopUp = ({trigger, popUp, onOpenChange, popOverClass, popOverClassContainer, alignOffset, sideOffset, triggerClass, align='end', side='bottom'}) => {
    return <Popover.Root onOpenChange={onOpenChange}>
                <Popover.Trigger className={`widgetPopupTrigger ${triggerClass}`} onClick={(event) => event.stopPropagation()}>
                    {trigger}
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Positioner align={align} side={side} sticky={true} alignOffset={alignOffset} sideOffset={sideOffset}>
                        <Popover.Popup className={`${popOverClassContainer} widgetPopover editHpGrow`}>
                            <Popover.Description className={popOverClass} render={<div/>}  onClick={(event) => event.stopPropagation()}>
                                {popUp}
                            </Popover.Description>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>;
};

export default WidgetPopUp;
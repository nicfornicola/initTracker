import SpellBlock from "./PopupBlocks/SpellBlock"
import { Popover } from '@base-ui-components/react/popover';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ConditionBlock from "./PopupBlocks/ConditionBlock";

const calcSourceTitle = (title) => {
    if(title === 'XPHB')
        return '2024'

    if(title === 'PHB')
        return '2014'

    return title
}

// Usage in a React Component
export const Popup = ({ items, elementObj }) => {
    return  <Popover.Root openOnHover={true} delay={500}>
                <Popover.Trigger className='triggerButton'>{elementObj.element}</Popover.Trigger>
                <Popover.Portal >
                    <Popover.Positioner align={'end'} sticky={true}>
                        <Popover.Popup className='hoverPopup'>
                            <Popover.Description key={elementObj.name} style={{all: 'unset'}} render={<div />}>
                                <Tabs>
                                    <TabList className='react-tabs__tab-list spellTabTitles'>
                                        {items.map((item) => (
                                            <Tab key={item.source}>{calcSourceTitle(item.source)}</Tab>
                                        ))}
                                    </TabList>
                                        {items.map((item) => (
                                            <TabPanel key={item.source}>
                                                {elementObj.valueType === 'spell' && <SpellBlock spell={item} />}
                                                {(elementObj.valueType === 'condition' ||
                                                  elementObj.valueType === 'status' ||
                                                  elementObj.valueType === 'disease') &&
                                                    <ConditionBlock condition={item}/>
                                                }
                                            </TabPanel>
                                        ))}
                                </Tabs>
                            </Popover.Description>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>;
}

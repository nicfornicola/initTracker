import {actionsConsts, skillsReplace, cleanPipes, titleCase, replace} from '../../replacements.js';
import { Popover } from '@base-ui-components/react/popover';
import InfoBlock from './InfoBlock.js';
import { exportSpells } from '../../constants.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const calcSourceTitle = (title) => {
    if(title === 'XPHB')
        return '2024'

    if(title === 'PHB')
        return '2014'

    return title
}

const getFormattedObj = (key, findKey, cPipes = false, tCase = true, bold = true) => {

    let sliceCount = findKey.length
    let element;
    let valueName;
    if(key.startsWith(findKey)) {
        element = key.slice(sliceCount)
        valueName = element
    }

    if(element) {
        if(cPipes) {
            element = cleanPipes(element)
            valueName = cleanPipes(valueName)
        }

        if(tCase)
            element = titleCase(element)

        if(bold) {
            element = <strong>{element}</strong>
        }
    } else {
        return null
    }

    return {
        name: valueName,
        element: element
    }
}



// Usage in a React Component
export const BoldifyReplace = ({ name, desc }) => {
    const str = (name || desc).toString();

    const formatPart = (part) => {
        // This is not in replace() becuase they are special
        if (part.startsWith("{@h}")) return <strong>Hit: {part.slice(4)}</strong>;
        if (part.startsWith("{@hit ")) return <strong>+{part.slice(6).replace("}", "")}</strong>;

        const match = part.match(/^\{@(.*?)\}$/);

        if (!match) return <span>{part}</span>;
        //actSaveFail
        const key = match[1];
        
        let element = replace(key)
        if(element)
            return element

        let elementObj = getFormattedObj(key, "spell ", true)

        if(elementObj) {
            const spells = exportSpells.filter(spell => spell.name.toLowerCase() === elementObj.name.toLowerCase());

            // If no spell found, dont do popup
            if(spells.length === 0) {
                return elementObj.element
            }

            return  <Popover.Root openOnHover={true} delay={500}>
                        <Popover.Trigger className='triggerButton'>{elementObj.element}</Popover.Trigger>
                        <Popover.Portal >
                            <Popover.Positioner align={'end'} sticky={true}>
                                <Popover.Popup className='hoverPopup'>
                                    <Popover.Description key={elementObj.name} style={{all: 'unset'}} render={<div />}>
                                        <Tabs>
                                            <TabList className='react-tabs__tab-list spellTabTitles'>
                                                {spells.map((spell) => (
                                                    <Tab key={spell.source}>{calcSourceTitle(spell.source)}</Tab>
                                                ))}
                                            </TabList>
                                                {spells.map((spell) => (
                                                    <TabPanel key={spell.source}>
                                                        <InfoBlock spell={spell} />
                                                    </TabPanel>
                                                ))}
                                        </Tabs>
                                    </Popover.Description>
                                </Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    </Popover.Root>;
        }
    };

    const formattedString = str.split(/(\{@h\}\d+ |\{@hit \d+\} to hit|{@.*?\})/)
        .map((part, index) => <span key={"highlighted" + index}>
                {formatPart(part)}
            </span>
        );

    return <span className={desc ? 'infoDesc' : ''}>{formattedString}</span>;
           
};
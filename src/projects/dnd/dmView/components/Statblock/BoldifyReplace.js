import {actionsConsts} from '../../replacements.js';
import { Popover } from '@base-ui-components/react/popover';
import spellsPhb from '../../monsterJsons/spells/spells-phb.json'
import InfoBlock from './InfoBlock.js';
import { cleanPipes, titleCase } from '../../constants.js';
const getRecharge = (str) => {
    if(str === '')
        return 6

    return str+'-6'
}

const getFormattedObj = (key, findKey, cleanPipes = false, tCase = true, bold = true) => {

    let sliceCount = findKey.length
    let element;
    let valueName;
    if(key.startsWith(findKey)) {
        element = key.slice(sliceCount)
        valueName = element
    }

    if(element) {
        if(cleanPipes)
            element = cleanPipes(element)

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
        // Check for specific patterns and return corresponding elements
        if (part.startsWith("{@h}")) return <strong>Hit: {part.slice(4)}</strong>;
        if (part.startsWith("{@hit ")) return <strong>+{part.slice(6).replace("}", "")}</strong>;

        const match = part.match(/^\{@(.*?)\}$/);

        if (!match) return <span>{part}</span>;

        const key = match[1];
        if (key.startsWith("condition ")) return <strong>{titleCase(cleanPipes(key.slice(10)))}</strong>;
        else if (key.startsWith("status ")) return <strong>{cleanPipes(key.slice(7))}</strong>;        
        else if (key.startsWith("dc ")) return <strong>DC {key.slice(3)}</strong>;
        else if (key.startsWith("hit ")) return <strong>+{key.slice(4)}</strong>;
        else if (key.startsWith("item ")) return <strong>{cleanPipes(key.slice(5))}</strong>;
        else if (key.startsWith("dice ")) return <strong>{key.slice(5)}</strong>;
        else if (key.startsWith("skill ")) return <strong>{key.slice(6)}</strong>;
        else if (key.startsWith("sense ")) return <strong>{key.slice(6)}</strong>;
        else if (key.startsWith("damage ")) return <strong>{key.slice(7)}</strong>;
        else if (key.startsWith("recharge")) return <strong>(Recharge {getRecharge(key.slice(8))})</strong>;
        else if (key.startsWith("creature ")) return <strong>{cleanPipes(key.slice(9))}</strong>;
        else if (key.startsWith("adventure ")) return <strong>{cleanPipes(key.slice(10))}</strong>;
        else if (key.startsWith("hitYourSpellAttack ")) return <strong>{cleanPipes(key.slice(18))}</strong>;
        else if (key.startsWith("action opportunity attack")) return <strong>Opportunity Attack</strong>;
        else if (key.startsWith("quickref difficult terrain||3")) return <strong>difficult terrain</strong>;
        else if (key.startsWith("quickref Cover||3||total cover")) return <strong>total cover</strong>;
        else if (key.startsWith("quickref saving throws|PHB|2|1|saving throw")) return <strong>saving throw</strong>;
        else if (key in actionsConsts) return <span>{actionsConsts[key]}</span>;

        let elementObj = getFormattedObj(key, "spell ")
        if(elementObj) {
            const spell = spellsPhb.spell.find(spell => spell.name.toLowerCase() === elementObj.name);
            return <Popover.Root openOnHover={true} delay={500}>
                    <Popover.Trigger className='triggerButton'>{elementObj.element}</Popover.Trigger>
                    <Popover.Portal >
                        <Popover.Positioner align={'end'} sticky={true}>
                            <Popover.Popup className='hoverPopup'>
                                <Popover.Description style={{all: 'unset'}}>
                                    <InfoBlock spell={spell}/>
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
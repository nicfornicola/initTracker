import {cleanPipes, titleCase, replace} from '../../replacements.js';
import { Popup } from './Popup.js';

import { exportSpells, conditionsExport, diseasesExport, statusExport } from '../../constants.js';

const calcSourceTitle = (title) => {
    if(title === 'XPHB')
        return '2024'

    if(title === 'PHB')
        return '2014'

    return title
}

const getFormattedObj = (key, findKey, cPipes = false, tCase = true, bold = true) => {

    let sliceCount = findKey.length + 1
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
        valueType: findKey,
        element: element
    }
}

const filterName = (items, elementObj) => {
    console.log("filter", elementObj.name)

    return items.filter(item => item.name.toLowerCase() === elementObj.name.toLowerCase());
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
        
        let elementObj;
        let popoverKeys = ["spell", "condition", "disease", "status"]
        elementObj = popoverKeys.map((popKey) => getFormattedObj(key, popKey, true)).find((obj) => obj !== null);
        // if its spell or condition, 
        if(elementObj) {
            if(elementObj.valueType === 'spell') {
                const spells = filterName(exportSpells, elementObj)
                // If no spell found, dont do popup
                if(spells.length === 0) {
                    return elementObj.element
                }
    
                return <Popup items={spells} elementObj={elementObj}/>
            } else if (elementObj.valueType === 'condition') {
                const conditions = filterName(conditionsExport, elementObj)
                // If no spell found, dont do popup
                if(conditions.length === 0) {
                    return elementObj.element
                }
    
                return <Popup items={conditions} elementObj={elementObj}/>
            }
            
        } else {
            // if {@x} was found i.e. bold a replace,
            return replace(key)
        }
    };

    const formattedString = str.split(/(\{@h\}\d+ |\{@hit \d+\} to hit|{@.*?\})/)
        .map((part, index) => <span key={"highlighted" + index}>
                {formatPart(part)}
            </span>
        );

    return <span className={desc ? 'infoDesc' : ''}>{formattedString}</span>;
};
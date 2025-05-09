import {cleanPipes, titleCase, replace} from '../../replacements.js';
import { Popup } from './Popup.js';

import { exportSpells, conditionsExport, diseasesExport, statusExport } from '../../constants.js';

const getFormattedObj = (key, findKey, cPipes = false, tCase = true, bold = true) => {

    let sliceCount = findKey.length + 1
    let element;
    let valueName;
    let search;
    if(key.startsWith(findKey)) {
        element = key.slice(sliceCount)
        valueName = element
    }

    if(element) {
        if(cPipes) {
            let elObj = cleanPipes(element)
            search = elObj.name
            element = elObj.textToBeShown
            valueName = cleanPipes(valueName).textToBeShown
        }

        if(tCase) {
            element = titleCase(element)
        }

        if(bold) {
            element = <strong>{element}</strong>
        }
    } else {
        return null
    }

    return {
        name: valueName,
        search: search,
        valueType: findKey,
        element: element
    }
}

const filterName = (items, elementObj) => {
    return items.filter(item => item.name.toLowerCase() === elementObj.search.toLowerCase());
}

// Usage in a React Component
export const BoldifyReplace = ({ name, desc }) => {
    console.table({name, desc})
    const str = (name || desc || "").toString();

    if(str === "") return null;

    const formatPart = (part) => {
        // This is not in replace() becuase they are special
        if (part.startsWith("{@h}")) return <strong>Hit: {part.slice(4)}</strong>;
        if (part.startsWith("{@hit ")) return <strong>+{part.slice(6).replace("}", "")}</strong>;

        const match = part.match(/^\{@(.*?)\}$/);

        if (!match) return <span>{part}</span>;
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
            } else if (elementObj.valueType === 'disease') {
                const diseases = filterName(diseasesExport, elementObj)
                // If no spell found, dont do popup
                if(diseases.length === 0) {
                    return elementObj.element
                }
    
                return <Popup items={diseases} elementObj={elementObj}/>
            } else if (elementObj.valueType === 'status') {
                const status = filterName(statusExport, elementObj)
                // If no spell found, dont do popup
                if(status.length === 0) {
                    return elementObj.element
                }
    
                return <Popup items={status} elementObj={elementObj}/>
            }
            
        } else {
            // if {@x} was found i.e. bold a replace,
            let replaced = replace(key)
            if(replaced)
                return replaced
            else {
                return <span>{key}!!!!!!!!!!!!!!</span>;
            }
        }
    };

    const formattedString = str.split(/(\{@h\}\d+ |\{@hit \d+\} to hit|{@.*?\})/)
        .map((part, index) => <span key={"highlighted" + index}>
                {formatPart(part)}
            </span>
        ); 

    return <span className={desc ? 'infoDesc' : ''}>{formattedString}</span>;
};
import {actionsConsts} from '../../replacements.js';

const getRecharge = (str) => {
    if(str === '')
        return 6

    return str+'-6'
}

const cleanPipes = (key) => {
    if(key.includes("||")) { // {@status name||textToBeShown}
        return key.split('||')[1]; 
    }else if(key.includes("|")) {
        return key.split('|')[0]; 
    }

    return key
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
        if (key.startsWith("dc ")) return <strong>DC {key.slice(3)}</strong>;
        if (key.startsWith("hit ")) return <strong>+{key.slice(4)}</strong>;
        if (key.startsWith("item ")) return <strong>{cleanPipes(key.slice(5))}</strong>;
        if (key.startsWith("dice ")) return <strong>{key.slice(5)}</strong>;
        if (key.startsWith("skill ")) return <strong>{key.slice(6)}</strong>;
        if (key.startsWith("spell ")) return <strong>{key.slice(6)}</strong>;
        if (key.startsWith("sense ")) return <strong>{key.slice(6)}</strong>;
        if (key.startsWith("status")) return <strong>{cleanPipes(key.slice(7))}</strong>;
        if (key.startsWith("damage ")) return <strong>{key.slice(7)}</strong>;
        if (key.startsWith("recharge")) return <strong>(Recharge {getRecharge(key.slice(8))})</strong>;
        if (key.startsWith("creature ")) return <strong>{cleanPipes(key.slice(9))}</strong>;
        if (key.startsWith("condition ")) return <strong>{cleanPipes(key.slice(10))}</strong>;
        if (key.startsWith("adventure ")) return <strong>{cleanPipes(key.slice(10))}</strong>;
        if (key.startsWith("action opportunity attack")) return <strong>Opportunity Attack</strong>;
        if (key.startsWith("quickref difficult terrain||3")) return <strong>difficult terrain</strong>;
        if (key.startsWith("quickref Cover||3||total cover")) return <strong>total cover</strong>;
        if (key.startsWith("quickref saving throws|PHB|2|1|saving throw")) return <strong>saving throw</strong>;

        if (key in actionsConsts) return <span>{actionsConsts[key]}</span>;

        return part;
    };

    const formattedString = str.split(/(\{@h\}\d+ |\{@hit \d+\} to hit|{@.*?\})/)
        .map((part, index) => <span key={"highlighted" + index}>{formatPart(part)}</span>);

    return <span className={desc ? 'infoDesc' : ''}>{formattedString}</span>;
};
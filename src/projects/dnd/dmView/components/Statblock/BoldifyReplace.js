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

    let str = name || desc
    const formattedString = str.split(/(\{@.*?\})/).map((part, index) => {
        const match = part.match(/^\{@(.*?)\}$/);
        if (!match) return <span key={index}>{part}</span>;
        
        const key = match[1];
        if (key.startsWith("action opportunity attack")) return <strong key={index}>Opportunity Attack</strong>;
        else if (key.startsWith("h")) return <i key={index}>Hit: </i>;
        else if (key.startsWith("dc ")) return <strong key={index}>DC {key.slice(3)}</strong>;
        else if (key.startsWith("hit ")) return <strong key={index}>+{key.slice(4)}</strong>;
        else if (key.startsWith("item ")) return <strong key={index}>{cleanPipes(key.slice(4))}</strong>;
        else if (key.startsWith("dice ")) return <strong key={index}>{key.slice(5)}</strong>;
        else if (key.startsWith("skill ")) return <strong key={index}>{key.slice(6)}</strong>;
        else if (key.startsWith("spell ")) return <strong key={index}>{key.slice(6)}</strong>;
        else if (key.startsWith("status")) return <strong key={index}>{cleanPipes(key.slice(7))}</strong>;
        else if (key.startsWith("damage ")) return <strong key={index}>{key.slice(7)}</strong>;
        else if (key.startsWith("recharge")) return <strong key={index}>(Recharge {getRecharge(key.slice(8))})</strong>;
        else if (key.startsWith("creature ")) return <strong key={index}>{key.slice(9)}</strong>;
        else if (key.startsWith("condition ")) return <strong key={index}>{key.slice(10)}</strong>;
        else if (key.startsWith("adventure ")) return <strong key={index}>{cleanPipes(key.slice(10))}</strong>;
        else if (key.startsWith("quickref difficult terrain||3")) return <strong key={index}>difficult terrain</strong>;
        else if (key.startsWith("quickref Cover||3||total cover")) return <strong key={index}>total cover</strong>;

        if(key in actionsConsts )
            return <span key={index}>{actionsConsts[key]}</span>;

        console.log("Got throuhh: ", part, key)
        return part
    });

    return <span className={desc ? 'infoDesc' : ''}> {formattedString} </span>
};
import '../../../../dmView/style/App.css';
import React from 'react';
import {replace} from '../../../replacements.js';

// Usage in a React Component
const SpellBoldifyReplace = ({ name, desc }) => {
    const str = (name || desc).toString();

    const formatPart = (part) => {
        // This is not in replace() becuase they are special
        if (part.startsWith("{@h}")) return <strong>Hit: {part.slice(4)}</strong>;
        if (part.startsWith("{@hit ")) return <strong>+{part.slice(6).replace("}", "")}</strong>;

        const match = part.match(/^\{@(.*?)\}$/);
        if (!match) return <span>{part}</span>;
        const key = match[1];
        return replace(key)
    };

    const formattedString = str.split(/(\{@h\}\d+ |\{@hit \d+\} to hit|{@.*?\})/)
        .map((part, index) => <span key={"highlighted" + index}>
                {formatPart(part)}
            </span>
        );

    return <span className={desc ? 'infoDesc' : ''}>{formattedString}</span>;
};

const ConditionBlock = ({condition}) => {
    if(!condition) {
        return null;
    } else return (
        <div className='spellBlockContainer'>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                <div className='topSpellInfo shadowBox'>
                    <span className='titleFontFamily'><b>{condition?.name}</b></span>
                </div>
            </div>
            <hr className="lineSeperator" />
            <hr className="lineSeperator" />
            <span>
                {condition.entries.map(entry => {
                    if(typeof entry === 'string')
                        return <span key={entry} style={{padding: '4px 4px 4px 0px'}}><SpellBoldifyReplace desc={entry}/></span>
                    else if(typeof entry === 'object') {
                        if(entry?.items) {
                            return  <ul className='spellList'>
                                        {entry.items.map(item => {
                                            if(item?.entries)
                                                return <li key={item.name}><strong>{item.name}: </strong><SpellBoldifyReplace desc={item.entries.join(" ")}/> </li>
                                            else 
                                                return <li key={item}><SpellBoldifyReplace desc={item}/></li>
                                        })}
                                    </ul>
                        } else if(entry?.entries) {
                            return  <ul className='spellList'>
                                {entry?.entries.map(entry2 => {
                                    if(entry2?.entries)
                                        return <li key={entry2.name}><strong>{entry2.name}: </strong><SpellBoldifyReplace desc={entry2.entries.join(" ")}/> </li>
                                    else return <>null entry</>
                                })}
                            </ul>
                        } else {
                            return <ul className='spellList' style={{paddingTop: '0', paddingBottom: '0', marginTop: '0', marginBottom: '0'}}><li style={{padding: '4px'}}><strong>{entry.name}: </strong><SpellBoldifyReplace desc={entry.entries.join(" ")}/> </li></ul>
                        }
                    } else return null
                })}
            </span>

        </div>
    );
}

export default ConditionBlock;

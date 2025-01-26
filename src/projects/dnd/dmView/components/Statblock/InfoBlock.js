import '../../../dmView/style/App.css';
import React from 'react';
import { cleanPipes, titleCase } from '../../constants.js';
import {actionsConsts, vocab, schoolOfSpell} from '../../replacements.js';


const calcCastingTime = (spell) => {

    let unit = vocab[spell.time[0].unit]
    if(unit !== 'Action' && unit !== 'Bonus action')
        unit = `${spell.time[0].number} ${unit}` 

    if(spell.time[0].number !== 1) 
        unit += 's'

    return unit

}

// Usage in a React Component
export const SpellBoldifyReplace = ({ name, desc }) => {
    const str = (name || desc).toString();

    const formatPart = (part) => {
        // Check for specific patterns and return corresponding elements
        if (part.startsWith("{@h}")) return <strong>Hit: {part.slice(4)}</strong>;
        if (part.startsWith("{@hit ")) return <strong>+{part.slice(6).replace("}", "")}</strong>;

        const match = part.match(/^\{@(.*?)\}$/);

        if (!match) return <span>{part}</span>;

        const key = match[1];
        if (key.startsWith("condition ")) return <strong>{titleCase(cleanPipes(key.slice(10)))}</strong>;
        else if (key.startsWith("spell ")) return <strong>{titleCase(cleanPipes(key.slice(6)))}</strong>;        
        else if (key.startsWith("status ")) return <strong>{cleanPipes(key.slice(7))}</strong>;        
        else if (key.startsWith("dc ")) return <strong>DC {key.slice(3)}</strong>;
        else if (key.startsWith("hit ")) return <strong>+{key.slice(4)}</strong>;
        else if (key.startsWith("dice ")) return <strong>{key.slice(5)}</strong>;
        else if (key.startsWith("damage ")) return <strong>{key.slice(7)}</strong>;
        else if (key.startsWith("hitYourSpellAttack ")) return <strong>{cleanPipes(key.slice(18))}</strong>;
        else if (key.startsWith("quickref difficult terrain||3")) return <strong>difficult terrain</strong>;
        else if (key.startsWith("quickref Vision and Light")) return <strong>{cleanPipes(key.slice(25))}</strong>;
        else if (key.startsWith("scaledamage ")) return <strong>{key.slice(12).split('|').at(-1)}</strong>;
        else if (key in actionsConsts) return <span>{actionsConsts[key]}</span>;
    };

    const formattedString = str.split(/(\{@h\}\d+ |\{@hit \d+\} to hit|{@.*?\})/)
        .map((part, index) => <span key={"highlighted" + index}>
                {formatPart(part)}
            </span>
        );

    return <span className={desc ? 'infoDesc' : ''}>{formattedString}</span>;
};

const InfoBlock = ({spell}) => {
    if(!spell) {
        return null;
    } else return (
        <div className='spellBlockContainer'>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                <div className='topSpellInfo shadowBox'>
                    <span className='titleFontFamily'><b>{spell?.name}</b></span>
                </div>
                <span><i> -  {spell.level === 0 ? `${schoolOfSpell[spell.school]} Cantrip` : `Level ${spell.level} ${schoolOfSpell[spell.school]}`}</i></span>
            </div>
            <hr className="lineSeperator" />
            <div className='spellStatGrid' >
                <span><strong>Casting Time:</strong> {calcCastingTime(spell)}</span>
                <span><strong>Range:</strong> {spell.range.distance.amount} {titleCase(spell.range.distance.type)}</span>
                <span><strong>Components:</strong> {Object.entries(spell.components).map(([key, value]) => {
                    return value ? key.toUpperCase() : null 
                }).join(", ")}</span>
                <span><strong>Duration:</strong> {spell?.duration[0]?.concentration && "Concentration, "} {spell.duration[0].type === 'timed' ? spell.duration[0].duration.amount + ' ' + spell.duration[0].duration.type + 's' : vocab[spell.duration[0].type]}</span>
            </div>
            <hr className="lineSeperator" />
            {spell.entries.map(desc => {

                if(typeof desc === 'string')
                    return <span style={{padding: '4px'}}><SpellBoldifyReplace desc={desc}/> </span>
                else if(typeof desc === 'object') {
                    return <ul className='spellList'>
                                {desc.entries.map(extraEntry => {
                                    return <span><strong>{desc.name}: </strong><SpellBoldifyReplace desc={extraEntry}/> </span>
                                })}
                            </ul>
                        
                    
                    

                }
            })}
            {spell?.entriesHigherLevel?.map(lvlObj => {
                return <span style={{padding: '4px'}}><strong>{lvlObj.name}</strong>
                {lvlObj.entries.map(desc => {
                    return <SpellBoldifyReplace desc={desc}/> 
                })}
                </span>
            })}
        </div>
    );
}

export default InfoBlock;

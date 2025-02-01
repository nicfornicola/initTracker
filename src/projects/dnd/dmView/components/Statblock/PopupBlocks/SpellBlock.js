import '../../../../dmView/style/App.css';
import React from 'react';
import {vocab, schoolOfSpell, replace, titleCase} from '../../../replacements.js';


const calcCastingTime = (spell) => {

    let unit = vocab[spell.time[0].unit]
    if(unit !== 'Action' && unit !== 'Bonus action')
        unit = `${spell.time[0].number} ${unit}` 

    if(spell.time[0].number !== 1) 
        unit += 's'

    if(spell?.meta?.ritual)
        unit += ' or ritual'

    return unit

}

const calcComponents = (spell) => {

    let components = Object.entries(spell.components).map(([key, value]) => {
        let component = null
        if(value) {
            component = key.toUpperCase()
            if(typeof value === 'string') {
                component += " (" + value + ")"
            } else if(typeof value === 'object') {
                component += " (" + value.text + ")"
            }
        }

        return component
    }).join(", ")

    return components
}

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

const SpellBlock = ({spell}) => {
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
                <span><strong>Components:</strong> {calcComponents(spell)}</span>
                <span><strong>Duration:</strong> {spell?.duration[0]?.concentration && "Concentration, "} {spell.duration[0].type === 'timed' ? spell.duration[0].duration.amount + ' ' + spell.duration[0].duration.type + 's' : vocab[spell.duration[0].type]}</span>
            </div>
            <hr className="lineSeperator" />
            <span>
                {spell.entries.map(entry => {
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
                        } else {
                            return <ul className='spellList' style={{paddingTop: '0', paddingBottom: '0', marginTop: '0', marginBottom: '0'}}><li style={{padding: '4px'}}><strong>{entry.name}: </strong><SpellBoldifyReplace desc={entry.entries.join(" ")}/> </li></ul>
                        }
                    } else return null
                })}
                {spell?.entriesHigherLevel?.map(lvlObj => {
                    return <div key={lvlObj.name} style={{padding: '4px 4px 4px 0px'}}><strong>{lvlObj.name}: </strong>
                        {lvlObj.entries.map(desc => {
                            return <SpellBoldifyReplace key={lvlObj.name} desc={desc}/> 
                        })}
                    </div>
                })}
            </span>

        </div>
    );
}

export default SpellBlock;

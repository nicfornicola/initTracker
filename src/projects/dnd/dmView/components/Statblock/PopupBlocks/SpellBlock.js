import '../../../../dmView/style/App.css';
import React from 'react';
import {vocab, schoolOfSpell, replace, titleCase} from '../../../replacements.js';
import { BoldifyReplace } from '../BoldifyReplace.js';

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
                <span><strong className='titleColor'>Casting Time:</strong> {calcCastingTime(spell)}</span>
                <span><strong className='titleColor'>Range:</strong> {spell.range.distance.amount} {titleCase(spell.range.distance.type)}</span>
                <span><strong className='titleColor'>Components:</strong> {calcComponents(spell)}</span>
                <span><strong className='titleColor'>Duration:</strong> {spell?.duration[0]?.concentration && "Concentration, "} {spell.duration[0].type === 'timed' ? spell.duration[0].duration.amount + ' ' + spell.duration[0].duration.type + 's' : vocab[spell.duration[0].type]}</span>
            </div>
            <hr className="lineSeperator" />
            <span>
                {spell.entries.map(entry => {
                    if(typeof entry === 'string')
                        return <ul className='spellList2'><li key={entry} style={{padding: '0', margin: '8px 0px 0px 0px'}}><BoldifyReplace desc={entry}/></li></ul>
                    else if(typeof entry === 'object') {
                        if(entry.type === "table") {
                            return <table className='spellTable'>
                                        <tr>
                                            {entry.colLabels.map((label) => {
                                                return <th><BoldifyReplace desc={label} /></th>
                                            })}
                                        </tr>
                                        {entry.rows.map((row) => {
                                            return <tr>
                                                        {row.map((rowData, index) => {
                                                            if(typeof rowData === 'object') {
                                                                if(rowData.roll?.exact)
                                                                    return <td className='spellTableDice'>{rowData.roll.exact}</td>
                                                                else 
                                                                    return <td className='spellTableDice'>{rowData.roll.min} - {rowData.roll.max}</td>
                                                            } else {
                                                                return <td className={index ? "" : "spellTableDice"}><BoldifyReplace desc={rowData}/></td>
                                                            }
                                                        })}
                                                    </tr>
                                        })}
                                    </table>
                        } else if(entry?.type === 'quote') {
                            return  <div className='quote'>
                                        <ul className='quoteList'>
                                            {entry.entries.map(quote => {
                                                return <li key={entry?.by}><i>"<BoldifyReplace desc={quote}/>"</i></li>
                                            })}
                                        </ul>
                                        <span className='quoteBy'>- {entry?.by}</span>
                                    </div>
                        } else if(entry?.items) {
                            return  <ul className='spellList'>
                                        {entry.items.map(item => {
                                            if(item?.entries)
                                                return <li key={item.name}><strong className='titleColor'>{item.name}: </strong><BoldifyReplace desc={item.entries.join(" ")}/> </li>
                                            else 
                                                return <li key={item}><BoldifyReplace desc={item}/></li>

                                        })}
                                    </ul>
                        } else {
                            return <ul className='spellList' style={{paddingTop: '0', paddingBottom: '0', marginTop: '0', marginBottom: '0'}}>
                                    <li style={{padding: '4px'}}>
                                        <strong className='titleColor'>{entry.name}: </strong>
                                        <BoldifyReplace desc={entry.entries.join(" ")}/> 
                                    </li>
                                </ul>
                        }
                    } else return null
                })}
                {spell?.entriesHigherLevel?.map(lvlObj => {
                    return <div key={lvlObj.name} style={{padding: '4px 4px 4px 0px'}}><strong className='titleColor'>{lvlObj.name}: </strong>
                        {lvlObj.entries.map(desc => {
                            return <BoldifyReplace key={lvlObj.name} desc={desc}/> 
                        })}
                    </div>
                })}
            </span>
            <hr className="lineSeperator" />
            <span>{spell?.source} - {spell?.page}</span>
        </div>
    );
}

export default SpellBlock;

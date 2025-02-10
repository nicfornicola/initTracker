import '../../../../dmView/style/App.css';
import React from 'react';
import { BoldifyReplace } from '../BoldifyReplace.js';

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
            <span>
                {condition.entries.map(entry => {
                    if(typeof entry === 'string')
                        return <span key={entry} style={{padding: '4px 4px 4px 0px'}}><BoldifyReplace desc={entry}/></span>
                    else if(typeof entry === 'object') {
                        if(entry?.items) {
                            return  <ul className='spellList'>
                                        {entry.items.map(item => {
                                            if(item?.entries)
                                                return <li key={item.name}><strong className='titleColor'>{item.name}: </strong><BoldifyReplace desc={item.entries.join(" ")}/> </li>
                                            else 
                                                return <li key={item}><BoldifyReplace desc={item}/></li>
                                        })}
                                    </ul>
                        } else if(entry?.entries) {
                            return  <ul className='spellList'>
                                {entry?.entries.map(entry2 => {
                                    if(entry2?.entries)
                                        return <li key={entry2.name}><strong className='titleColor'>{entry2.name}: </strong><BoldifyReplace desc={entry2.entries.join(" ")}/> </li>
                                    else return <>null entry</>
                                })}
                            </ul>
                        } else {
                            return <ul className='spellList' style={{paddingTop: '0', paddingBottom: '0', marginTop: '0', marginBottom: '0'}}>
                                    <li style={{padding: '4px'}}>
                                        <strong className='titleColor'>{entry.name}: </strong><BoldifyReplace desc={entry.entries.join(" ")}/> 
                                    </li>
                                </ul>
                        }
                    } else return null
                })}
            </span>
            <hr className="lineSeperator" />
            <span>{condition?.source} - {condition?.page}</span>
        </div>
    );
}

export default ConditionBlock;

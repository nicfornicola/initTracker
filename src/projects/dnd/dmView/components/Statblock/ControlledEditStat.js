import React, {useEffect, useState} from 'react';

const ControlledEditStat = ({label, value, setValue, setCreature, type = 'text'}) => {
    
    let w, h, alignItems, textAlign = ''
    if(type === 'number') {
        w = '45px';
        alignItems = 'center'
        textAlign = 'center'
    } else if (type === 'checkbox') {
        w = '50px'
        h = '15px'
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleBlur = () => {
        setCreature()
    }

    return (
        <div className='editBlock' style={{alignItems}}>
            <i className='editBlockTitle'>{label}</i>
            <input className="editBlockInput" type={type} style={{width: w, height: h, textAlign: textAlign}}
                value={value}
                onChange={handleChange} 
                onBlur={handleBlur} 
            />
        </div>
    )
}

export default ControlledEditStat;
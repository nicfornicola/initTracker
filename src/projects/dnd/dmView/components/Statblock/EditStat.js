import React from 'react';

const EditStat = ({label, value, cKey, category = undefined, handleChange = undefined, type = 'text'}) => {

    let w, h, alignItems, textAlign = ''
    if(type === 'number') {
        w = '45px';
        alignItems = 'center'
        textAlign = 'center'
    } else if (type === 'checkbox') {
        w = '50px'
        h = '15px'
    }

    return (
        <div className='editBlock' style={{alignItems}}>
            <i className='editBlockTitle'>{label}</i>
            <input className="editBlockInput" type={type} style={{width: w, height: h, textAlign: textAlign}}
                value={value}
                checked={value}
                onChange={(e) => handleChange(e, cKey, category)} 
                onBlur={(e) => handleChange(e, cKey, category, undefined, true)} 
                onFocus={(e) => {e.target.select()}}
            />
        </div>
    )
}

export default EditStat;
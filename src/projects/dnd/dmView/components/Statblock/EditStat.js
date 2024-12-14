import React from 'react';

const EditStat = ({label, value, cKey, category = undefined, handleChange = undefined, type = 'text'}) => {

    let w = label === 'Name' ? '100%' : '95%'
    let h, alignItems, textAlign = ''
    if(type === 'number') {
        w = '45px';
        alignItems = 'center'
        textAlign = 'center'
    } else if (type === 'checkbox') {
        w = '50px'
        h = '15px'
    }

    const validate = (e, cKey, category, send = false) => {
        if((type === 'number' && !isNaN(e.target.value)) || type === 'text' || type === 'checkbox') {
            handleChange(e, cKey, category, undefined, send)
        }
    }

    return (
        <div className='editBlock' style={{alignItems}}>
            <i className='editBlockTitle'>{label}</i>
            <input className="editBlockInput" style={{width: w, height: h, textAlign: textAlign}}
                type={type === 'checkbox' ? type : 'text'}
                value={value}
                checked={value}
                onChange={(e) => validate(e, cKey, category)} 
                onBlur={(e) => validate(e, cKey, category, true)} 
                onFocus={(e) => {e.target.select()}}
            />
        </div>
    )
}

export default EditStat;
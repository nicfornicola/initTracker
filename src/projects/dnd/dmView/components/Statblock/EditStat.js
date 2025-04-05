import React, { useState } from 'react';

const EditStat = ({label, value, cKey, category = undefined, index = undefined, handleChange = undefined, type = 'text', showLabel = true}) => {
    const [content, setContent] = useState(value)


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

    const validate = (e, cKey, category, index, send = false) => {
        const { value, checked, type } = e.target;
        if((type === 'number' && !isNaN(value)) || type === 'text' || type === 'checkbox') {
            if(send) {
                handleChange(e, cKey, category, index, send)
            } else if(type === 'number'  || type === 'text') {
                setContent(value)
            } else {
                setContent(checked)
            }
        }
    }

    const handleFocus = (e) => { 
        if(e.target.value === 'None' || e.target.value === '--') 
            e.target.select();
    }

    return (
        <div className='editBlock' style={{alignItems}}>
            {showLabel && <i className='editBlockTitle'>{label}</i>}
            <input className="editBlockInput" style={{width: w, height: h, textAlign: textAlign}}
                type={type === 'checkbox' ? type : 'text'}
                value={content}
                checked={content}
                onChange={(e) => validate(e, cKey, category, index)} 
                onBlur={(e) => validate(e, cKey, category, index, true)} 
                size={index !== undefined && content.length}
                onFocus={handleFocus}
            />
        </div>
    )
}

export default EditStat;